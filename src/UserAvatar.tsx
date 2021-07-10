import { Avatar } from "@material-ui/core";
import initials from "initials";
import { UserDisplayNoId } from "./UserDisplay";

export const UserAvatar = (props: { user: UserDisplayNoId }) => (
  <Avatar src={props.user.image ?? ""} alt={props.user.name ?? undefined}>
    {initials(props.user.name!)}
  </Avatar>
);
