import { styled } from "@material-ui/styles";
import TimeAgo from "timeago-react";

export const PostTimestamp = styled(TimeAgo)((props) => ({
  fontStyle: "italic",
  color: "gray",
}));
