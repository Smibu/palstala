import { Container, Stack } from "@material-ui/core";

export const Layout: React.FC = (props) => {
  return (
    <Container maxWidth="sm">
      <Stack spacing={2} alignItems="flex-start">
        {props.children}
      </Stack>
    </Container>
  );
};
