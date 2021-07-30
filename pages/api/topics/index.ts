import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../src/client";
import {
  authRequired,
  getReqData,
  getSessionTyped,
  validateData,
} from "../../../src/utils";
import * as t from "io-ts";
import { ResponseData } from "../../../src/responseData";

const PostReqCodec = t.type({
  content: t.string,
  title: t.string,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  switch (req.method) {
    case "GET":
      break;
    case "POST":
      const sess = await getSessionTyped({ req });
      if (!sess) {
        authRequired(res);
        break;
      }
      const r = validateData(PostReqCodec, getReqData(req), res);
      if (!r) {
        return;
      }
      const topic = await prisma.topic.create({
        data: {
          title: r.title,
          posts: {
            create: [{ content: r.content, authorId: sess.userId }],
          },
        },
      });
      res.status(200).json({ id: topic.id });
      break;
  }
}
