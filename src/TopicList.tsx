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

export const TopicList: React.FC<{ topics: Topic[] }> = (props) => (
  <TableContainer>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell align="right">Tags</TableCell>
          <TableCell align="right">Author</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.topics.map((row) => (
          <TableRow key={row.id}>
            <TableCell component="th" scope="row">
              <Link href={`/topics/${row.id}`}>{row.title}</Link>
            </TableCell>
            <TableCell align="right">{row.title}</TableCell>
            <TableCell align="right">{row.title}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);
