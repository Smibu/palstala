import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../dbClient";
import { getReqData, validateData } from "../../../utils";
import * as t from "io-ts";
import { isModOrAdmin } from "../../../user/roles";
import { ApiResponse } from "../../../ApiResponse";
import { getSessionTyped } from "../../../auth/session";
import { authRequired, notFoundOrNotAccessible } from "../../../errorResponses";

const PutReqCodec = t.type({
  id: t.string,
  content: t.string,
});

const DeleteReqCodec = t.type({
  id: t.string,
});

function handleDbResult(
  result: { count: number },
  res: NextApiResponse<ApiResponse>,
  req: NextApiRequest
) {
  if (result.count === 0) {
    notFoundOrNotAccessible(res);
    return;
  }
  res.status(200).json({ id: req.query.id as string });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
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
      handleDbResult(result, res, req);
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
      handleDbResult(result, res, req);
      break;
  }
}
