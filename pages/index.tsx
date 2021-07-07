import { useSession } from "next-auth/client";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@material-ui/core";
import { Layout } from "../src/Layout";
import AddIcon from "@material-ui/icons/Add";
import { TopicList } from "../src/TopicList";
import { LoginMenu } from "../src/LoginMenu";
import Link from "../src/Link";

export default function TopicPage() {
  return (
    <Layout>
      <TopicList />
      <Link href="/topic/new">
        <Button startIcon={<AddIcon />} variant="contained">
          New topic
        </Button>
      </Link>
    </Layout>
  );
}
