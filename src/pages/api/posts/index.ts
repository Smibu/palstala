import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../dbClient";
import { getReqData, validateData } from "../../../utils";
import * as t from "io-ts";
import { ApiResponse } from "../../../ApiResponse";
import { getSessionTyped } from "../../../auth/session";
import { authRequired } from "../../../errorResponses";

const PostReqCodec = t.type({
  topic: t.string,
  content: t.string,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
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
