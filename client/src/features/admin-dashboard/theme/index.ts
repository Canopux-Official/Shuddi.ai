import { createTheme } from "@mui/material/styles";
import { colors, radius, fonts } from "./tokens";

const theme = createTheme({
  palette: {
    primary: { main: colors.forest },
    secondary: { main: colors.accentGold },
    background: { default: colors.cream, paper: colors.surface },
    text: { primary: colors.ink, secondary: colors.inkMuted },
    divider: colors.border,
    error: { main: colors.danger },
  },
  typography: {
    fontFamily: fonts.body,
    h1: { fontFamily: fonts.display, fontWeight: 600 },
    h2: { fontFamily: fonts.display, fontWeight: 600 },
    h3: { fontFamily: fonts.display, fontWeight: 600 },
    h4: { fontFamily: fonts.display, fontWeight: 600 },
    h5: { fontFamily: fonts.display, fontWeight: 600 },
    h6: { fontFamily: fonts.display, fontWeight: 600 },
  },
  shape: { borderRadius: radius.control },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: radius.card, border: `0.5px solid ${colors.border}` },
      },
      defaultProps: { elevation: 0 },
    },
    MuiButton: {
      styleOverrides: { root: { textTransform: "none", fontWeight: 500 } },
    },
  },
});

export default theme;