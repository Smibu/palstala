import { createTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        // The default h1 looks very large, so let's map variant h[x] -> h[x-1] and never use the h1 variant.
        variantMapping: {
          h2: "h1",
          h3: "h2",
          h4: "h3",
          h5: "h4",
          h6: "h5",
        },
      },
    },
  },
});

export default theme;
