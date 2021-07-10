import { Layout } from "../../src/Layout";
import { Button, Stack, TextField, Typography } from "@material-ui/core";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import React from "react";
import { Post } from "@prisma/client";
import prisma from "../../src/client";
import { UserDisplayNoId } from "../../src/UserDisplay";
import { UserAvatar } from "../../src/UserAvatar";
import { Controller, useForm } from "react-hook-form";
import { useSession } from "next-auth/client";
import axios from "axios";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";

const TopicPage: React.FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
  const { handleSubmit, control, reset } = useForm<{ content: string }>({
    defaultValues: { content: "" },
    mode: "onChange",
  });

  const [session, loading] = useSession();
  const router = useRouter();
  if (!props.topic) {
    return <Typography>Topic not found</Typography>;
  }
  const topic = props.topic;
  return (
    <Layout>
      <Typography variant="h4">{props.topic.title}</Typography>
      <Stack direction="column" spacing={2}>
        {props.topic.posts.map((p) => (
          <PostC key={p.id} post={p} />
        ))}
      </Stack>
      {session && (
        <form
          onSubmit={handleSubmit(async (data) => {
            await axios.post(`/api/posts`, {
              content: data.content,
              topic: topic.id,
            });
            await router.replace(router.asPath);
            reset();
          })}
        >
          <Stack spacing={2} alignItems="flex-start">
            <Controller
              render={({
                field,
                fieldState: { invalid, isTouched, isDirty, error },
              }) => (
                <TextField
                  error={invalid && isTouched}
                  label="Add reply..."
                  {...field}
                  multiline
                  fullWidth
                  rows={5}
                />
              )}
              name="content"
              control={control}
              rules={{ required: true }}
            />
            <Button type="submit" variant="contained">
              Post
            </Button>
          </Stack>
        </form>
      )}
      {!session && !loading && <Typography>Please sign in to post.</Typography>}
    </Layout>
  );
};

const PostC: React.FC<{ post: Post & { author: UserDisplayNoId } }> = (
  props
) => {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <UserAvatar user={props.post.author} />
      <ReactMarkdown>{props.post.content}</ReactMarkdown>
    </Stack>
  );
};

export default TopicPage;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const topic = await prisma.topic.findUnique({
    where: { id: context.params!.id as string },
    include: {
      posts: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });
  return {
    props: { topic },
  };
};
