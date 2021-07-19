import { createServer, Server } from "http";
import { parse } from "url";
import { test } from "@playwright/test";
import next from "next";
import path from "path";
import { AddressInfo } from "net";

const nextTest = test.extend<{}, { port: number }>({
  port: [
    async ({}, use) => {
      const nextApp = next({
        dev: true,
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
});

export default nextTest;
