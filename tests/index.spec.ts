import test from "./next-fixture";
import { expect } from "@playwright/test";
import { createUser } from "./utils";
import { Role } from "@prisma/client";
import prisma from "../src/dbClient";
import { getTopicWithVisiblePosts, getVisibleTopics } from "../src/topic/topic";
import axios, { AxiosError } from "axios";
import type { ApiResponse } from "../src/ApiResponse";

test("index page", async ({ page, port }) => {
  await page.goto(`http://localhost:${port}/`);
  const name = await page.innerText("h1");
  expect(name).toBe("Palstala");
});

test("create new topic requires login", async ({ page, port, waitLoad }) => {
  await page.goto(`http://localhost:${port}/`);
  await page.click("text=New topic");
  await waitLoad();
  expect(await page.title()).toBe("New topic - Palstala");
  const txt = await page.textContent("body");
  expect(txt).toContain("Please sign in to create a topic.");
});

test("create new topic", async ({ page, port, loginUser, waitLoad }) => {
  await loginUser("1", "Test User", Role.USER);
  await page.goto(`http://localhost:${port}/`);
  const avatarText = await page.innerText(".MuiAvatar-root");
  expect(avatarText).toBe("TU");
  await page.click("text=New topic");
  await page.fill("#title", "Test topic");
  await page.fill("#content", "Test content");
  await page.click("text=Create");
  await waitLoad();
  await page.goto(`http://localhost:${port}/`);
  await page.waitForLoadState("networkidle");
  const table = await page.$(".MuiTable-root");
  expect(await table!.screenshot()).toMatchSnapshot("one-topic.png");
});

async function createTestData() {
  const [u1, u2, u3, u4] = await prisma.$transaction([
    createUser("1", "New User", Role.NEWUSER),
    createUser("2", "New User 2", Role.NEWUSER),
    createUser("3", "Normal User", Role.USER),
    createUser("4", "Admin", Role.ADMIN),
  ]);
  const t = await prisma.topic.create({
    data: {
      title: "Topic 1",
      posts: {
        create: [
          { content: "test1", authorId: u1.id },
          { content: "test2", authorId: u2.id },
          { content: "test3", authorId: u3.id },
          { content: "test4", authorId: u4.id },
        ],
      },
    },
    select: { id: true, posts: true },
  });
  await prisma.$transaction([
    prisma.topic.create({
      data: {
        title: "Topic 2",
        posts: {
          create: [{ content: "test2", authorId: u2.id }],
        },
      },
    }),
    prisma.topic.create({
      data: {
        title: "Topic 3",
        posts: {
          create: [{ content: "test3", authorId: u3.id }],
        },
      },
    }),
    prisma.topic.create({
      data: {
        title: "Topic 4",
        posts: {
          create: [{ content: "test4", authorId: u4.id }],
        },
      },
    }),
  ]);
  return { u1, u2, u3, u4, t };
}

test("a normal user cannot see posts from newusers", async ({ loginUser }) => {
  const { u1, u2, u3, u4, t } = await createTestData();
  const expectedVisibilities = [
    [u1, ["test1", "test3", "test4"]],
    [u2, ["test2", "test3", "test4"]],
    [u3, ["test3", "test4"]],
    [u4, ["test1", "test2", "test3", "test4"]],
  ] as const;
  for (const [u, exp] of expectedVisibilities) {
    const vis = await getTopicWithVisiblePosts(t.id, u);
    expect(vis!.posts.map((p) => p.content)).toStrictEqual(exp);
  }

  const expectedTopicVisibilities = [
    [u1, ["Topic 1", "Topic 3", "Topic 4"]],
    [u2, ["Topic 2", "Topic 3", "Topic 4"]],
    [u3, ["Topic 3", "Topic 4"]],
    [u4, ["Topic 1", "Topic 2", "Topic 3", "Topic 4"]],
  ] as const;
  for (const [u, exp] of expectedTopicVisibilities) {
    const vis = await getVisibleTopics(u);
    expect(vis!.map((t) => t.title)).toStrictEqual(exp);
  }
});

test("posts can be edited by mods and authors, and deleted by mods", async ({
  page,
  port,
  loginUser,
}) => {
  const { u1, u2, u3, u4, t } = await createTestData();
  const expectedResponses = {
    "2": { put: [404, 200, 404, 404], delete: [404, 404, 404, 404] },
    "3": { put: [404, 404, 200, 404], delete: [404, 404, 404, 404] },
    "4": { put: [200, 200, 200, 200], delete: [200, 200, 200, 200] },
  };
  for (const u of [u2, u3, u4]) {
    await loginUser(u.id, u.name, u.role);
    await page.goto(`http://localhost:${port}/topics/${t.id}`);
    const posts = await page.$(".posts");
    expect(await posts!.screenshot()).toMatchSnapshot(`topic-u${u.id}.png`);
  }
  for (const u of [u2, u3, u4]) {
    await loginUser(u.id, u.name, u.role);
    for (const [method, expected] of Object.entries(
      expectedResponses[u.id as "2" | "3" | "4"]
    )) {
      const m = method as "put" | "delete";
      const r = await Promise.all(
        [0, 1, 2, 3].map((i) =>
          axios
            .request<ApiResponse>({
              method: m,
              url: `http://localhost:${port}/api/posts/${t.posts[i].id}`,
              data: {
                content: t.posts[i].content + " edited",
              },
            })
            .then((r) => r.status)
            .catch((r: AxiosError) => r.response!.status)
        )
      );
      expect(r).toStrictEqual(expected);
    }
  }
});

test("topics of unapproved users have a marker", async ({
  page,
  port,
  waitLoad,
  loginUser,
}) => {
  const [u1, u2] = await prisma.$transaction([
    createUser("1", "New User", Role.NEWUSER),
    createUser("2", "Normal User", Role.USER),
  ]);
  await prisma.$transaction([
    prisma.topic.create({
      data: {
        title: "Topic 1",
        posts: {
          create: [{ content: "test1", authorId: u1.id }],
        },
      },
    }),
    prisma.topic.create({
      data: {
        title: "Topic 2",
        posts: {
          create: [{ content: "test2", authorId: u2.id }],
        },
      },
    }),
  ]);
  await loginUser("3", "Moderator", Role.MODERATOR);
  await page.goto(`http://localhost:${port}/`);
  await page.waitForLoadState("networkidle");
  const table = await page.$(".MuiTable-root");
  expect(await table!.screenshot()).toMatchSnapshot(
    "unapproved-user-topic.png"
  );
});
