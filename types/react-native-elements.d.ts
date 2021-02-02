import { Colors, FullTheme } from 'react-native-elements'

type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]> }

declare module 'react-native-elements' {
  export interface Colors {
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
  }

  // Example of adding additional stuff to theme
  // type ThemeFontDimention = {
  //   fontSize: number
  //   lineHeight: number
  // }

  export interface FullTheme {
    colors: RecursivePartial<Colors>
    // padding: {
    //   small: number
    //   default: number
    //   large: number
    //   screen: number
    // }
    // fontSizes: {
    //   small: ThemeFontDimention
    //   medium: ThemeFontDimention
    //   large: ThemeFontDimention
    // }
  }
}
