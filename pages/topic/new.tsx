import { Layout } from "../../src/Layout";
import { useSession } from "next-auth/client";
import Head from "next/head";
import { Typography } from "@material-ui/core";
import React from "react";
import { TopicForm } from "../../src/TopicForm";

export default function Page() {
  const [session, loading] = useSession();

  return (
    <Layout>
      <Head>
        <title>New topic - Palstala</title>
      </Head>
      {!session && <>Please sign in to create a topic.</>}
      {session && (
        <>
          <Typography variant="h4">New topic</Typography>
          <TopicForm />
        </>
      )}
    </Layout>
  );
}
