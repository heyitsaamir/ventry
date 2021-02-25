import { Theme } from 'react-native-elements';

declare module "@emotion/react" {
  export interface Theme { colors: Theme['colors'] }
}
