import { NextApiResponse } from "next";
import { ApiResponse } from "./ApiResponse";

export function notFoundOrNotAccessible(res: NextApiResponse<ApiResponse>) {
  res.status(404).json({ error: "Post not found or not accessible" });
}

export function authRequired(res: NextApiResponse<ApiResponse>) {
  res.status(401).json({ error: "Authorization required" });
}
