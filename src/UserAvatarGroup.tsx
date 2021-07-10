import React from "react";
import { UserDisplay } from "./UserDisplay";
import { Avatar, AvatarGroup } from "@material-ui/core";

export const UserAvatarGroup: React.FC<{ users: UserDisplay[] }> = (props) => {
  return (
    <AvatarGroup>
      {props.users.map((u) => (
        <Avatar
          key={u.id}
          alt={u.name ?? undefined}
          src={u.image ?? undefined}
        />
      ))}
    </AvatarGroup>
  );
};
