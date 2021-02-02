import { Theme } from "react-native-elements";
import { color } from "react-native-reanimated";

const colors = {
  jet: "#353535ff",
  ming: "#3c6e71ff",
  white: "#ffffffff",
  gainsboro: "#d9d9d9ff",
  "indigo-dye": "#284b63ff",
};

export const theme: Theme = {
  colors: {
    error: "#c4352b",
    primary: colors.ming,
    background: colors.white,
    text: colors.jet,
    border: colors.gainsboro,
    secondary: colors["orange-web"],
    searchBg: colors.ming
  }
};