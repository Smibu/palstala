import React from "react";
import type { UserBasicInfo } from "./UserBasicInfo";
import { Avatar, AvatarGroup } from "@material-ui/core";

export const UserAvatarGroup: React.FC<{ users: UserBasicInfo[] }> = (
  props
) => {
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
