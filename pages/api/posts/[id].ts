import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../src/client";
import {
  authRequired,
  getReqData,
  getSessionTyped,
  handleResult,
  notFoundOrNotAccessible,
  validateData,
} from "../../../src/utils";
import * as t from "io-ts";
import { isModOrAdmin } from "../../../src/roles";
import { ResponseData } from "../../../src/responseData";

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
    authRequired(res);
    return;
  }
  const modOrAdmin = isModOrAdmin(sess.userRole);
  switch (req.method) {
    case "GET":
      break;
    case "DELETE": {
      const r = validateData(DeleteReqCodec, getReqData(req), res);
      if (!r) {
        return;
      }
      if (!modOrAdmin) {
        notFoundOrNotAccessible(res);
        return;
      }
      const result = await prisma.post.deleteMany({
        where: {
          id: r.id,
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
      const whereClause = modOrAdmin
        ? {
            id: r.id,
          }
        : { id: r.id, authorId: sess.userId };
      const result = await prisma.post.updateMany({
        where: whereClause,
        data: {
          content: r.content,
        },
      });
      handleResult(result, res, req);
      break;
  }
}
