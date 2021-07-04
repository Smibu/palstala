import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "next-auth/client";
import { CacheProvider } from "@emotion/react";
import Head from "next/head";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import theme from "../src/theme";
import createCache from "@emotion/cache";

const cache = createCache({ key: "css", prepend: true });
cache.compat = true;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider session={pageProps.session}>
      <CacheProvider value={cache}>
        <Head>
          <title>Palstala</title>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
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
