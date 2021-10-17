import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Bar from "./Bar";
import Foo from "./Foo";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {

  return (
      <Drawer.Navigator initialRouteName="Bar">
        <Drawer.Screen name="Bar" component={Bar} />
        <Drawer.Screen name="Foo" component={Foo} />
      </Drawer.Navigator>
  );
};

export default DrawerNavigator;
