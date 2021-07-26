import test from "./next-fixture";
import { expect } from "@playwright/test";

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
  await useUser("12345", "Test User");
  await page.goto(`http://localhost:${port}/`);
  const avatarText = await page.innerText(".MuiAvatar-root");
  expect(avatarText).toBe("TU");
  await page.click("text=New topic");
  await page.fill("#title", "Test topic");
  await page.fill("#content", "Test content");
  await page.click("text=Create");
  await waitLoad();
  await page.goto(`http://localhost:${port}/`);
  await page.waitForLoadState("domcontentloaded");
  expect(await page.screenshot()).toMatchSnapshot("one-topic.png");
});
