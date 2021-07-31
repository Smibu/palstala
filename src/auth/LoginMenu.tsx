import { User } from "next-auth";
import { Button, Stack } from "@material-ui/core";
import { signIn, signOut } from "next-auth/client";
import { UserAvatar } from "../user/UserAvatar";

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
          <UserAvatar user={props.user} />
          <Button variant="outlined" color="primary" onClick={() => signOut()}>
            Sign out
          </Button>
        </Stack>
      )}
    </>
  );
}
