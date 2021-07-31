import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Stack, TextField } from "@material-ui/core";

type FormData = { title: string; content: string };

export const TopicForm = (props: { onSubmit: (v: FormData) => void }) => {
  const { handleSubmit, control } = useForm<FormData>({
    defaultValues: { title: "", content: "" },
    mode: "onChange",
  });

  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
      <Stack spacing={2} alignItems="flex-start">
        <Controller
          render={({
            field,
            fieldState: { invalid, isTouched, isDirty, error },
          }) => (
            <TextField
              id="title"
              label="Topic title"
              {...field}
              required
              fullWidth
              error={invalid && isTouched}
            />
          )}
          name="title"
          control={control}
          rules={{ required: true }}
        />
        <Controller
          render={({
            field,
            fieldState: { invalid, isTouched, isDirty, error },
          }) => (
            <TextField
              id="content"
              error={invalid && isTouched}
              label="Content"
              {...field}
              multiline
              required
              fullWidth
              rows={5}
            />
          )}
          name="content"
          control={control}
          rules={{ required: true }}
        />
        <Button type="submit" variant="contained">
          Create
        </Button>
      </Stack>
    </form>
  );
};
