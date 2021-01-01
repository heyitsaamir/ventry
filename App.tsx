import React, { useEffect, useState } from "react";
import { ThemeProvider, Text } from "react-native-elements";
import { AppNavigator } from "./Components/Navigation";

import { Provider } from "react-redux";
import Store from "./Store";

export default () => {
  return (
    <ThemeProvider>
      <Provider store={Store}>
        <AppNavigator />
      </Provider>
    </ThemeProvider>
  );
};
