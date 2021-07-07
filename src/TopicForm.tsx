import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Stack, TextField } from "@material-ui/core";

type FormData = { title: string; content: string };

export const TopicForm: React.FC = (props) => {
  const { handleSubmit, control } = useForm<FormData>({
    defaultValues: { title: "", content: "" },
    mode: "onChange",
  });

  const onSubmit = (v: FormData) => {
    console.log(v);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} alignItems="flex-start">
        <Controller
          render={({
            field,
            fieldState: { invalid, isTouched, isDirty, error },
          }) => (
            <TextField
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
