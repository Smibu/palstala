import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../src/client";
import {
  getReqData,
  getSessionTyped,
  handleResult,
  ResponseData,
  validateData,
} from "../../../src/utils";
import * as t from "io-ts";

const PutReqCodec = t.type({
  id: t.string,
  content: t.string,
});

const DeleteReqCodec = t.type({
  id: t.string,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const sess = await getSessionTyped({ req });
  if (!sess) {
    res.status(401).json({ error: "Authorization required" });
    return;
  }
  switch (req.method) {
    case "GET":
      break;
    case "DELETE": {
      const r = validateData(DeleteReqCodec, getReqData(req), res);
      if (!r) {
        return;
      }
      const result = await prisma.post.deleteMany({
        where: {
          id: r.id,
          authorId: sess.userId,
        },
      });
      handleResult(result, res, req);
      break;
    }
    case "PUT":
      const r = validateData(PutReqCodec, getReqData(req), res);
      if (!r) {
        return;
      }
      const result = await prisma.post.updateMany({
        where: {
          id: r.id,
          authorId: sess.userId,
        },
        data: {
          content: r.content,
        },
      });
      handleResult(result, res, req);
      break;
  }
}
