import { Theme } from "./theme-context";

const colors = {
  jet: "#353535ff",
  ming: "#3c6e71ff",
  white: "#ffffffff",
  gainsboro: "#d9d9d9ff",
  "indigo-dye": "#284b63ff",
  red: "#c4352b",
};

export const theme: Theme = {
  colors: {
    error: colors.red,
    primary: colors["indigo-dye"],
    background: colors.white,
    text: colors.jet,
    border: colors.gainsboro,
    secondary: colors["indigo-dye"],
    searchBg: colors.ming,
  } as Theme['colors'],
};
