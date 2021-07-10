import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import prisma from "../../../src/client";

type Data =
  | {
      id: string;
    }
  | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      break;
    case "POST":
      const sess = await getSession({ req });
      if (!sess) {
        res.status(401).json({ error: "Authorization required" });
        break;
      }
      const post = await prisma.post.create({
        data: {
          content: req.body.content,
          authorId: sess.userId as string,
          topicId: req.body.topic,
        },
      });
      res.status(200).json({ id: post.id });
      break;
  }
}
