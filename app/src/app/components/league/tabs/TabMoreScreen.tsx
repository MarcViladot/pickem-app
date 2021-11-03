import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

const LeagueMoreScreen = () => {

  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View style={{marginTop: tabBarHeight, backgroundColor: '#FCFCFC', height: '100%'}}>
      <Text>More</Text>
    </View>
  );
};

const styles = StyleSheet.create({
})

export default LeagueMoreScreen;
