import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@material-ui/core";
import { LoginMenu } from "./auth/LoginMenu";
import Link from "./Link";
import { useSessionTyped } from "./auth/session";

export const Layout: React.FC = (props) => {
  const [session, loading] = useSessionTyped();
  return (
    <Container maxWidth="sm">
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <Typography variant="h2">
            <Link href={"/"}>Palstala</Link>
          </Typography>
          <Box>
            {!loading && <LoginMenu user={session?.user} />}
            {loading && <CircularProgress />}
          </Box>
        </Stack>
        <Typography>
          <i>Palstala</i> is a simple discussion forum, built as a result of
          learning React, Next.js and related technologies.
        </Typography>
        <Alert severity="warning">
          <strong>Do not use Palstala for anything serious.</strong> This app
          instance is just a demo, so there is no support, and data may be
          deleted any time without prior notice.
        </Alert>
        {props.children}
      </Stack>
    </Container>
  );
};
