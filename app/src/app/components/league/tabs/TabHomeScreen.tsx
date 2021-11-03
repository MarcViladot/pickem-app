import React from "react";
import { Text, View } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

const TabHomeScreen = () => {

  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View style={{marginTop: tabBarHeight, backgroundColor: '#FCFCFC', height: '100%'}}>
      <Text>Home</Text>
    </View>
  );
};

export default TabHomeScreen;
