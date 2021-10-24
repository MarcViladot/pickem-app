import React from "react";
import { Button, Text, View } from "react-native";

const HomeScreen = ({navigation}) => {

  return (
    <View style={{backgroundColor: 'red'}}>
      <Button title={"toggle"} onPress={() => navigation.toggleDrawer()} />
      <Text>Bar</Text>
    </View>
  );
};

export default HomeScreen;
