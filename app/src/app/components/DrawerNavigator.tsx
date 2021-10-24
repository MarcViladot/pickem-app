import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "./HomeScreen";
import Foo from "./Foo";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {

  return (
      <Drawer.Navigator initialRouteName="Home" drawerType={"slide"}>
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Foo" component={Foo} />
      </Drawer.Navigator>
  );
};

export default DrawerNavigator;
