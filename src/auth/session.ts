import { getSession, GetSessionOptions, useSession } from "next-auth/client";
import { TypedSession } from "./TypedSession";

export function useSessionTyped() {
  return useSession() as [TypedSession | null, boolean];
}

export async function getSessionTyped(
  options?: GetSessionOptions
): Promise<TypedSession | null> {
  return (await getSession(options)) as TypedSession | null;
}
