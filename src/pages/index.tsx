import { Button, Typography } from "@material-ui/core";
import { Layout } from "../Layout";
import AddIcon from "@material-ui/icons/Add";
import { TopicList } from "../topic/TopicList";
import Link from "../Link";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import React from "react";
import prisma from "../dbClient";
import type { UserBasicInfo } from "../user/UserBasicInfo";
import { getVisibleTopics } from "../topic/topic";
import { getSessionTyped } from "../auth/session";

const TopicsPage: React.FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => (
  <Layout>
    <Typography variant="h3">Topics</Typography>
    {props.topics.length > 0 ? (
      <TopicList topics={props.topics} />
    ) : (
      <Typography>There are no topics yet.</Typography>
    )}
    <Link href="/topics/new">
      <Button startIcon={<AddIcon />} variant="contained">
        New topic
      </Button>
    </Link>
  </Layout>
);

export default TopicsPage;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSessionTyped(context);
  const topics = await getVisibleTopics(
    session ? { id: session.userId, role: session.userRole } : undefined
  );
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: topics.flatMap((t) => t.posts.map((p) => p.authorId)),
      },
    },
    select: {
      id: true,
      name: true,
      image: true,
    },
  });
  const userMap = new Map<string, UserBasicInfo>();
  for (const u of users) {
    userMap.set(u.id, u);
  }

  return {
    props: {
      session,
      topics: topics.map((t) => ({
        id: t.id,
        title: t.title,
        users: [...new Set(t.posts.map((p) => p.authorId))].map(
          (uid) => userMap.get(uid)!
        ),
        authorRole: t.posts[0].author.role,
      })),
    },
  };
};
