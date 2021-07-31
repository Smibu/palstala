import { Avatar } from "@material-ui/core";
import initials from "initials";
import type { UserVisibleInfo } from "./UserVisibleInfo";

export const UserAvatar = (props: { user: UserVisibleInfo }) => (
  <Avatar src={props.user.image ?? ""} alt={props.user.name ?? undefined}>
    {initials(props.user.name!)}
  </Avatar>
);
