import { User } from "next-auth";
import { Avatar, Button, Stack } from "@material-ui/core";
import { signIn, signOut } from "next-auth/client";
import initials from "initials";

export function LoginMenu(props: { user: User | undefined }) {
  return (
    <>
      {!props.user && (
        <Button variant="outlined" color="primary" onClick={() => signIn()}>
          Sign in
        </Button>
      )}
      {props.user && (
        <Stack direction="row" spacing={1}>
          <Avatar
            src={props.user.image ?? ""}
            alt={props.user.name ?? undefined}
          >
            {initials(props.user.name!)}
          </Avatar>
          <Button variant="outlined" color="primary" onClick={() => signOut()}>
            Sign out
          </Button>
        </Stack>
      )}
    </>
  );
}
