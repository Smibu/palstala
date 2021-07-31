import { NextApiRequest, NextApiResponse } from "next";
import * as t from "io-ts";
import { isLeft } from "fp-ts/Either";
import { PathReporter } from "io-ts/PathReporter";
import { ErrorResponse } from "./ApiResponse";

export function validateData<T>(
  codec: t.Type<T>,
  data: unknown,
  res: NextApiResponse<ErrorResponse>
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
  } as Record<string, unknown>;
}
