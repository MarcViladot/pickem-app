import React, { FC } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "./HomeScreen";
import Foo from "./Foo";
import { Image, StyleSheet, Text, View } from "react-native";
import { DrawerContentComponentProps } from "@react-navigation/drawer/src/types";
import { useSelector } from "react-redux";
import { RootState } from "../reducers";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import AccordionList from "./common/AccordionList";
import { LeagueType, UserGroup } from "../interfaces/user.interface";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {

  return (
    <Drawer.Navigator initialRouteName="Home" drawerType={"slide"}
                      drawerContent={(props) => <CustomDrawerContent {...props} />}
                      drawerStyle={{
                        backgroundColor: '#c6cbef',
                        width: 220,
                      }}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Foo" component={Foo} />
    </Drawer.Navigator>
  );
};

const CustomDrawerContent: FC<DrawerContentComponentProps> = (props) => {

  const user = useSelector((state: RootState) => state.user.currentUser);
  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: user.photo }} style={styles.userPhoto} />
          <Text style={styles.userName}>Marc Viladot Aguaron</Text>
        </View>
        <FontAwesomeIcon icon={faCog} style={{ color: "gray" }} size={15} />
      </View>
      <View>
        {user.groups.map((userGroup: UserGroup, i) => (
          <AccordionList key={userGroup.id} openByDefault={user.groups.length === 1 && i === 0} name={userGroup.group.name} listItems={userGroup.leagues.map((league) => (
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}} key={league.id}>
              <Image source={{uri: league.logo}} style={{width: 25, height: 25, marginRight: 10}} />
              <Text>{league.name}</Text>
            </View>
          ))} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    height: '100%',
    backgroundColor: '#F2F4F7'
  },
  drawerHeader: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#EEEEF3'
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: '80%'
  },
  userName: {
    color: "#000",
    fontSize: 16,
    flex: 1,
    flexWrap: 'wrap'
  },
  userPhoto: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 10
  }
});

export default DrawerNavigator;
