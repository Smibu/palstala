import { Layout } from "../../Layout";
import {
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@material-ui/core";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import React, { useState } from "react";
import { Post, Role } from "@prisma/client";
import { UserAvatar } from "../../user/UserAvatar";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { getTopicWithVisiblePosts } from "../../topic/topic";
import { isModOrAdmin } from "../../user/roles";
import { getSessionTyped, useSessionTyped } from "../../auth/session";
import { UserVisibleInfo } from "../../user/UserVisibleInfo";

const TopicPage: React.FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
  const [session, loading] = useSessionTyped();
  const router = useRouter();
  if (!props.topic) {
    return <Typography>Topic not found</Typography>;
  }
  const isMod = isModOrAdmin(session?.userRole ?? Role.USER);
  const topic = props.topic;
  return (
    <Layout>
      <Typography variant="h3">{props.topic.title}</Typography>
      <Stack direction="column" spacing={2} className="posts">
        {props.topic.posts.map((p) => (
          <PostC
            key={p.id}
            post={p}
            author={p.author}
            editable={!!session && (p.author.id === session.userId || isMod)}
            deletable={!!session && isMod}
            onSubmit={async (data: { content: string }) => {
              await axios.put(`/api/posts/${p.id}`, {
                content: data.content,
              });
              await router.replace(router.asPath);
            }}
          />
        ))}
      </Stack>
      {session && (
        <PostC
          post={null}
          author={session.user}
          editable={true}
          deletable={false}
          onSubmit={async (data: { content: string }) => {
            await axios.post(`/api/posts`, {
              content: data.content,
              topic: topic.id,
            });
            await router.replace(router.asPath);
          }}
        />
      )}
      {!session && !loading && <Typography>Please sign in to post.</Typography>}
    </Layout>
  );
};

const PostC: React.FC<{
  post: Post | null;
  author: UserVisibleInfo;
  editable: boolean;
  deletable: boolean;
  onSubmit: (data: { content: string }) => Promise<unknown>;
}> = (props) => {
  const isNew = props.post === null;
  const [editing, setEditing] = useState(isNew);
  const { handleSubmit, control, reset } = useForm<{
    content: string;
  }>({
    defaultValues: { content: props.post?.content ?? "" },
    mode: "onChange",
  });
  const router = useRouter();
  return (
    <Paper variant={"outlined"}>
      <Stack
        direction="column"
        spacing={1}
        padding={1}
        divider={<Divider flexItem />}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          spacing={1}
          justifyContent={"space-between"}
        >
          <UserAvatar user={props.author} />
          {!isNew && (
            <Stack direction={"row"}>
              {props.editable && (
                <IconButton onClick={() => setEditing(!editing)}>
                  <EditIcon />
                </IconButton>
              )}
              {props.deletable && (
                <IconButton
                  onClick={async () => {
                    await axios.delete(`/api/posts/${props.post!.id}`);
                    await router.replace(router.asPath);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Stack>
          )}
        </Stack>

        {!editing && <ReactMarkdown>{props.post?.content ?? ""}</ReactMarkdown>}
        {editing && (
          <form
            onSubmit={handleSubmit(async (data) => {
              await props.onSubmit(data);
              if (isNew) {
                reset();
              } else {
                setEditing(false);
              }
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
                    label={isNew ? "Add reply..." : undefined}
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
                {isNew ? "Post" : "Save"}
              </Button>
            </Stack>
          </form>
        )}
      </Stack>
    </Paper>
  );
};

export default TopicPage;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSessionTyped(context);
  const topic = await getTopicWithVisiblePosts(
    context.params!.id as string,
    session ? { id: session.userId, role: session.userRole } : undefined
  );
  return {
    props: { topic, session },
  };
};
