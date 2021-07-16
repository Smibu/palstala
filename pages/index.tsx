import { Button } from "@material-ui/core";
import { Layout } from "../src/Layout";
import AddIcon from "@material-ui/icons/Add";
import { TopicList } from "../src/TopicList";
import Link from "../src/Link";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import React from "react";
import prisma from "../src/client";
import { UserDisplay } from "../src/UserDisplay";

const TopicsPage: React.FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => (
  <Layout>
    <TopicList topics={props.topics} />
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
  const topics = await prisma.topic.findMany({
    select: {
      id: true,
      title: true,
      posts: {
        select: {
          authorId: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
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
  const userMap = new Map<string, UserDisplay>();
  for (const u of users) {
    userMap.set(u.id, u);
  }

  return {
    props: {
      topics: topics.map((t) => ({
        id: t.id,
        title: t.title,
        users: [...new Set(t.posts.map((p) => p.authorId))].map(
          (uid) => userMap.get(uid)!
        ),
      })),
    },
  };
};
