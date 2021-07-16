import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../src/client";
import {
  getReqData,
  getSessionTyped,
  ResponseData,
  validateData,
} from "../../../src/utils";
import * as t from "io-ts";

const PostReqCodec = t.type({
  topic: t.string,
  content: t.string,
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
        res.status(401).json({ error: "Authorization required" });
        break;
      }
      const r = validateData(PostReqCodec, getReqData(req), res);
      if (!r) {
        return;
      }
      const post = await prisma.post.create({
        data: {
          content: r.content,
          authorId: sess.userId,
          topicId: r.topic,
        },
      });
      res.status(200).json({ id: post.id });
      break;
  }
}
