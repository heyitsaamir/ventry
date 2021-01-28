import React, { useEffect, useState } from "react";
import { ThemeProvider, Text } from "react-native-elements";
import { AppNavigator } from "./Components/Navigation";

import { Provider } from "react-redux";
import Store from "./Store";
import { PersistGate } from "redux-persist/integration/react";

const theme = { colors: { error: "#c4352b" } };

export default () => {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={Store.store}>
        <PersistGate loading={<Text>Loading!</Text>} persistor={Store.persistor}>
          <AppNavigator />
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
};
