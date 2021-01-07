import React, { useEffect, useState } from "react";
import { ThemeProvider, Text } from "react-native-elements";
import { AppNavigator } from "./Components/Navigation";

import { Provider } from "react-redux";
import Store from "./Store";
import { OnItemTap, SearchContext } from "./Components/Navigation/searchContext";
import { PersistGate } from "redux-persist/integration/react";

export default () => {
  return (
    <ThemeProvider>
      <Provider store={Store.store}>
        <PersistGate loading={<Text>Loading!</Text>} persistor={Store.persistor}>
          <AppNavigator />
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
};
