import {
  Box,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@material-ui/core";
import { LoginMenu } from "./LoginMenu";
import { useSession } from "next-auth/client";

export const Layout: React.FC = (props) => {
  const [session, loading] = useSession();
  return (
    <Container maxWidth="sm">
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <Typography variant="h2">Palstala</Typography>
          <Box>
            {!loading && <LoginMenu user={session?.user} />}
            {loading && <CircularProgress />}
          </Box>
        </Stack>
        {props.children}
      </Stack>
    </Container>
  );
};
