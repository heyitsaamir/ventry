import { useContext } from "react";
import { ThemeContext, ThemeProps, Theme as OriginalTheme, Colors } from "react-native-elements";

export type Theme = OriginalTheme<{}> & {
  colors: {
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
  } & Colors
};

type TP = Omit<ThemeProps<{}>, 'theme'> & { theme: Theme };

export const useTheme: () => TP = () => {
  const allContext = useContext(ThemeContext);
  return allContext as TP;
}