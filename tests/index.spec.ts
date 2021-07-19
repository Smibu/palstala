import test from "./next-fixture";
import { expect } from "@playwright/test";

test("index page", async ({ page, port }) => {
  await page.goto(`http://localhost:${port}/`);
  const name = await page.innerText("h2");
  expect(name).toBe("Palstala");
});

test("create new topic", async ({ page, port }) => {
  await page.goto(`http://localhost:${port}/`);
  await page.click("text=New topic");
  await page.waitForSelector(".nprogress-busy", { state: "hidden" });
  expect(await page.title()).toBe("New topic - Palstala");
  const txt = await page.innerText("p");
  expect(txt).toBe("Please sign in to create a topic.");
});
