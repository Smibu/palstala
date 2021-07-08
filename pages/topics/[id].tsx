import { Layout } from "../../src/Layout";
import { Stack, Typography } from "@material-ui/core";
import { GetServerSideProps } from "next";
import React from "react";
import { Post, PrismaClient, Topic } from "@prisma/client";

const TopicPage: React.FC<{ topic: Topic & { posts: Post[] } }> = (props) => {
  return (
    <Layout>
      <Typography variant={"h4"}>{props.topic.title}</Typography>
      <Stack direction="column" spacing={2}>
        {props.topic.posts.map((p) => (
          <PostC key={p.id} post={p} />
        ))}
      </Stack>
    </Layout>
  );
};

const PostC: React.FC<{ post: Post }> = (props) => {
  return <Typography>{props.post.content}</Typography>;
};

export default TopicPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const prisma = new PrismaClient();
  const topic = await prisma.topic.findUnique({
    where: { id: context.params!.id as string },
    include: {
      posts: true,
    },
  });
  return {
    props: { topic },
  };
};
