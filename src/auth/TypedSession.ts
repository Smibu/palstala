import type { Role } from "@prisma/client";

export interface TypedSession {
  user: { name?: string | null };
  userId: string;
  userRole: Role;
}
