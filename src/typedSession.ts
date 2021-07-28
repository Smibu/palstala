import { Role } from "@prisma/client";

export interface TypedSession {
  user: { name?: string };
  userId: string;
  userRole: Role;
}
