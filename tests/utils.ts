import { Role } from "@prisma/client";
import prisma from "../src/client";

export function createUser(id: string, name: string | null, role: Role) {
  return prisma.user.upsert({
    where: { id },
    create: { id, name, role },
    update: { id, name, role },
  });
}

export function getModule(modulePath: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return require(`../${process.env.BUILD_DIR || ".next"}/server/${modulePath}`);
}
