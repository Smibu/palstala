import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "next-auth/client";
import { CacheProvider } from "@emotion/react";
import Head from "next/head";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import theme from "../src/theme";
import createCache from "@emotion/cache";
import Router from "next/router";
import NProgress from "nprogress";
import { Session } from "next-auth";

const cache = createCache({ key: "css", prepend: true });
cache.compat = true;

Router.events.on("routeChangeStart", (url) => {
  NProgress.start();
});
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider session={(pageProps as { session?: Session }).session}>
      <CacheProvider value={cache}>
        <Head>
          <title>Palstala</title>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://unpkg.com/nprogress@0.2.0/nprogress.css"
          />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </CacheProvider>
    </Provider>
  );
}

export default MyApp;
