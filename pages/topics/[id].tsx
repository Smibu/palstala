import { Layout } from "../../src/Layout";
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
import { Post } from "@prisma/client";
import { UserDisplayNoId } from "../../src/UserDisplay";
import { UserAvatar } from "../../src/UserAvatar";
import { Controller, useForm } from "react-hook-form";
import { useSession } from "next-auth/client";
import axios from "axios";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { getSessionTyped } from "../../src/utils";
import { getTopicWithVisiblePosts } from "../../src/topic";

const TopicPage: React.FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
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
          <PostC
            key={p.id}
            post={p}
            author={p.author}
            editable={true}
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
          author={session.user!}
          editable={true}
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
  author: UserDisplayNoId;
  editable: boolean;
  onSubmit: (data: { content: string }) => Promise<unknown>;
}> = (props) => {
  const isNew = props.post === null;
  const [editing, setEditing] = useState(isNew);
  const { handleSubmit, control } = useForm<{
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
          {props.editable && !isNew && (
            <Stack direction={"row"}>
              <IconButton onClick={() => setEditing(!editing)}>
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={async () => {
                  await axios.delete(`/api/posts/${props.post!.id}`);
                  await router.replace(router.asPath);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          )}
        </Stack>

        {!editing && <ReactMarkdown>{props.post?.content ?? ""}</ReactMarkdown>}
        {editing && (
          <form
            onSubmit={handleSubmit(async (data) => {
              await props.onSubmit(data);
              setEditing(false);
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
