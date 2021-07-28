import test from "./next-fixture";
import { expect } from "@playwright/test";
import { createUser } from "./utils";
import { Role } from "@prisma/client";
import prisma from "../src/client";
import { getTopicWithVisiblePosts, getVisibleTopics } from "../src/topic";

test("index page", async ({ page, port }) => {
  await page.goto(`http://localhost:${port}/`);
  const name = await page.innerText("h2");
  expect(name).toBe("Palstala");
});

test("create new topic requires login", async ({ page, port, waitLoad }) => {
  await page.goto(`http://localhost:${port}/`);
  await page.click("text=New topic");
  await waitLoad();
  expect(await page.title()).toBe("New topic - Palstala");
  const txt = await page.innerText("p");
  expect(txt).toBe("Please sign in to create a topic.");
});

test("create new topic", async ({ page, port, useUser, waitLoad }) => {
  await useUser("1", "Test User");
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
  expect(await page.screenshot()).toMatchSnapshot("one-topic.png");
});

test("a normal user cannot see posts from newusers", async ({ useUser }) => {
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
