import { Role } from "@prisma/client";

export function isModOrAdmin(role: Role) {
  return role === Role.ADMIN || role === Role.MODERATOR;
}

export function isApprovedRole(role: Role) {
  return role !== Role.NEWUSER && role !== Role.BANNED;
}
