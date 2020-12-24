import * as React from 'react';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Linking, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  itemStyle: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default function DrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} itemStyle={styles.itemStyle} activeBackgroundColor={"#fefefe"} />
      <DrawerItem
        label="Help"
        onPress={() => Linking.openURL('https://mywebsite.com/help')}
      />
    </DrawerContentScrollView>
  );
}