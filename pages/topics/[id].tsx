import { Layout } from "../../src/Layout";
import { Stack, Typography } from "@material-ui/core";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import React from "react";
import { Post } from "@prisma/client";
import prisma from "../../src/client";

const TopicPage: React.FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
  if (!props.topic) {
    return <Typography>Topic not found</Typography>;
  }
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

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
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
