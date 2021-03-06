import { createServer, Server } from "http";
import { parse } from "url";
import { Page, test } from "@playwright/test";
import next from "next";
import path from "path";
import type { AddressInfo } from "net";
import type { SetupServerApi } from "msw/node";
import { ResponseComposition, rest } from "msw";
import prisma from "../src/dbClient";
import { createUser, getModule } from "./utils";
import type { Role } from "@prisma/client";
import type { TypedSession } from "../src/auth/TypedSession";

type UseUserFn = (
  userId: string,
  name: string | null,
  role: Role
) => Promise<void>;

const nextTest = test.extend<
  {
    requestInterceptor: SetupServerApi;
    loginUser: UseUserFn;
    waitLoad: () => Promise<void>;
  },
  { port: number; rest: typeof rest }
>({
  port: [
    async ({}, use) => {
      const nextApp = next({
        dev: false,
        dir: path.resolve(__dirname, ".."),
      });
      await nextApp.prepare();
      const handler = nextApp.getRequestHandler();

      const server: Server = await new Promise((resolve) => {
        const server = createServer((req, res) => {
          const parsedUrl = parse(req.url!, true);
          handler(req, res, parsedUrl);
        });
        server.listen((error: unknown) => {
          if (error) throw error;
          resolve(server);
        });
      });

      const port = (server.address() as AddressInfo).port;
      process.env.NEXTAUTH_URL = `http://localhost:${port}`;
      await use(port);
    },
    {
      scope: "worker",
    },
  ],
  requestInterceptor: [
    async ({}, use) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const getRequestInterceptor = getModule(`pages/_app`)
        .getReqInterceptor as () => Promise<SetupServerApi>;
      const requestInterceptor = await getRequestInterceptor();
      await use(requestInterceptor);
      requestInterceptor.resetHandlers();
    },
    {
      scope: "test",
    },
  ],
  loginUser: [
    async (
      {
        requestInterceptor,
        page,
        port,
      }: { requestInterceptor: SetupServerApi; page: Page; port: number },
      use: (x: UseUserFn) => void
    ) => {
      await use(async (userId, userName, role) => {
        await createUser(userId, userName, role);
        requestInterceptor.use(
          rest.get(
            `http://localhost:${port}/api/auth/session`,
            (req, res: ResponseComposition<TypedSession>, ctx) => {
              return res(
                ctx.json({
                  user: { name: userName },
                  userId: userId,
                  userRole: role,
                })
              );
            }
          )
        );
        await page.route(`http://localhost:${port}/api/auth/session`, (route) =>
          route.fulfill({
            status: 200,
            body: JSON.stringify({
              user: { name: userName },
              userId: userId,
              userRole: role,
            }),
          })
        );
      });
      await prisma.$transaction([
        prisma.post.deleteMany(),
        prisma.topic.deleteMany(),
        prisma.user.deleteMany(),
      ]);
    },
    {
      scope: "test",
    },
  ],
  waitLoad: [
    async ({ page }, use) => {
      await use(async () => {
        await page.waitForSelector(".nprogress-busy", { state: "hidden" });
      });
    },
    { scope: "test" },
  ],
  rest: [
    async ({}, use) => {
      await use(rest);
    },
    { scope: "worker" },
  ],
});

export default nextTest;
