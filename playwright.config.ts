import { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  globalSetup: "./tests/global-setup.ts",
  use: {
    screenshot: "only-on-failure",
  },
};
export default config;
