import { Layout } from "../../Layout";
import Head from "next/head";
import { Typography } from "@material-ui/core";
import React from "react";
import { TopicForm } from "../../topic/TopicForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useSessionTyped } from "../../auth/session";

export default function Page() {
  const [session, loading] = useSessionTyped();
  const router = useRouter();
  return (
    <Layout>
      <Head>
        <title>New topic - Palstala</title>
      </Head>
      {!session && <Typography>Please sign in to create a topic.</Typography>}
      {session && (
        <>
          <Typography variant="h3">New topic</Typography>
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
