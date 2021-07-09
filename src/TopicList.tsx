import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Topic } from "@prisma/client";
import React from "react";
import Link from "./Link";
import { UserDisplay } from "./UserDisplay";
import { UserAvatarGroup } from "./UserAvatarGroup";

export const TopicList: React.FC<{
  topics: (Topic & { users: UserDisplay[] })[];
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
              <Link href={`/topics/${row.id}`}>{row.title}</Link>
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
