import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import { Role, Topic } from "@prisma/client";
import React from "react";
import Link from "./Link";
import { UserDisplay } from "./UserDisplay";
import { UserAvatarGroup } from "./UserAvatarGroup";
import { isApprovedRole } from "./roles";
import AccessTimeIcon from "@material-ui/icons/AccessTime";

export const TopicList: React.FC<{
  topics: (Topic & { users: UserDisplay[]; authorRole: Role })[];
}> = (props) => (
  <TableContainer>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell align="right">Tags</TableCell>
          <TableCell align="right">Participants</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.topics.map((row) => (
          <TableRow key={row.id}>
            <TableCell component="th" scope="row">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Link href={`/topics/${row.id}`}>{row.title}</Link>
                {isApprovedRole(row.authorRole) ? null : (
                  <Tooltip title="Awaiting moderator approval">
                    <AccessTimeIcon />
                  </Tooltip>
                )}
              </Stack>
            </TableCell>
            <TableCell align="right">TODO</TableCell>
            <TableCell align="right">
              <UserAvatarGroup users={row.users} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);
