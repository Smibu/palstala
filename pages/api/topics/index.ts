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
      res.status(200).json({ id: "John Doe" });
      break;
    case "POST":
      const sess = await getSession({ req });
      if (!sess) {
        res.status(401).json({ error: "Authorization required" });
        break;
      }
      const topic = await prisma.topic.create({
        data: {
          title: req.body.title,
          posts: {
            create: [
              { content: req.body.content, authorId: sess.userId as string },
            ],
          },
        },
      });
      res.status(200).json({ id: topic.id });
      break;
  }
}
