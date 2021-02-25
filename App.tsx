import React from "react";
import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import Toast from "react-native-toast-message";
import { ThemeProvider, Text } from "react-native-elements";
import { AppNavigator } from "./Components/Navigation";

import { Provider } from "react-redux";
import Store from "./Store";
import { PersistGate } from "redux-persist/integration/react";
import { theme } from "./Components/Theme";

export default () => {
  return (
    <ThemeProvider theme={theme}>
      <EmotionThemeProvider theme={theme}>
        <Provider store={Store.store}>
          <PersistGate loading={<Text>Loading!</Text>} persistor={Store.persistor}>
            <AppNavigator />
          </PersistGate>
        </Provider>
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </EmotionThemeProvider>
    </ThemeProvider>
  );
};
