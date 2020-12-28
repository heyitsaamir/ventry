import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Button, Divider, Input, Layout, Text } from "@ui-kitten/components";
import { ThemeContext } from "../../Theme/theme-context";
import styled from "@emotion/native";
import { NavigatorProps } from "../../Components/Navigation/Routes";

const useInputState = (initialValue = "") => {
  const [value, setValue] = React.useState(initialValue);
  return { value, onChangeText: setValue };
};

interface Props {
  navigation: NavigatorProps<"Home">;
}

export const HomeScreen = ({ navigation }: Props) => {
  const themeContext = React.useContext(ThemeContext);

  const largeInputState = useInputState();
  const navigateDetails = () => {
    navigation.navigate("Details");
  };

  const navigateAddItem = () => {
    navigation.navigate("AddItem");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <HorizontalSplit>
          <Text category="h2">Search</Text>
          <SearchInput size="large" placeholder="Search" {...largeInputState} />
        </HorizontalSplit>
        <Divider />
        <HorizontalSplit>
          <Button style={styles.button} onPress={navigateAddItem}>
            ADD ITEM
          </Button>
          <Button style={styles.button} onPress={navigateDetails}>
            OPEN DETAILS
          </Button>
          <Button style={styles.button} onPress={themeContext.toggleTheme}>
            TOGGLE THEME
          </Button>
        </HorizontalSplit>
      </Layout>
    </SafeAreaView>
  );
};

const SearchInput = styled(Input)({
  margin: 20,
});

const HorizontalSplit = styled(View)({
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
});

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
  },
});
