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

export default function Page() {
  const [session, loading] = useSession();

  return (
    <Layout>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ width: "100%" }}
      >
        <Typography variant="h1">Palstala</Typography>
        <Box>
          {!loading && <LoginMenu user={session?.user} />}
          {loading && <CircularProgress />}
        </Box>
      </Stack>
      <TopicList />
      <Button startIcon={<AddIcon />} variant="contained">
        New topic
      </Button>
    </Layout>
  );
}
