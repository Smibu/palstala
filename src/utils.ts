import { getSession, GetSessionOptions } from "next-auth/client";
import { NextApiRequest, NextApiResponse } from "next";
import * as t from "io-ts";
import { isLeft } from "fp-ts/Either";
import { PathReporter } from "io-ts/PathReporter";
import { TypedSession } from "./typedSession";
import { ResponseData } from "./responseData";

export async function getSessionTyped(
  options?: GetSessionOptions
): Promise<TypedSession | null> {
  return (await getSession(options)) as TypedSession | null;
}

export function notFoundOrNotAccessible(res: NextApiResponse<ResponseData>) {
  res.status(404).json({ error: "Post not found or not accessible" });
}

export function handleResult(
  result: { count: number },
  res: NextApiResponse<ResponseData>,
  req: NextApiRequest
) {
  if (result.count === 0) {
    notFoundOrNotAccessible(res);
    return;
  }
  res.status(200).json({ id: req.query.id as string });
}

export function validateData<T>(
  codec: t.Type<T>,
  data: unknown,
  res: NextApiResponse<ResponseData>
) {
  const r = codec.decode(data);
  if (isLeft(r)) {
    res.status(422).json({ error: PathReporter.report(r).join(", ") });
    return;
  }
  return r.right;
}

export function getReqData(req: NextApiRequest) {
  return {
    ...req.query,
    ...req.body,
  } as unknown;
}

export function authRequired(res: NextApiResponse<ResponseData>) {
  res.status(401).json({ error: "Authorization required" });
}
