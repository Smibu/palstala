import { Layout } from "../../src/Layout";
import { useSession } from "next-auth/client";
import Head from "next/head";
import { Typography } from "@material-ui/core";
import React from "react";
import { TopicForm } from "../../src/TopicForm";
import axios from "axios";
import { useRouter } from "next/router";

export default function Page() {
  const [session, loading] = useSession();
  const router = useRouter();
  return (
    <Layout>
      <Head>
        <title>New topic - Palstala</title>
      </Head>
      {!session && <>Please sign in to create a topic.</>}
      {session && (
        <>
          <Typography variant="h4">New topic</Typography>
          <TopicForm
            onSubmit={async (v) => {
              const result = await axios.post<{ id: number }>("/api/topics", v);
              await router.push(`/topics/${result.data.id}`);
            }}
          />
        </>
      )}
    </Layout>
  );
}
