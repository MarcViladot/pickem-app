import React, { FC, useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "./HomeScreen";
import Foo from "./league/GroupLeagueScreen";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DrawerContentComponentProps } from "@react-navigation/drawer/src/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reducers";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import AccordionList from "./common/AccordionList";
import { UserGroup } from "../interfaces/user.interface";
import league from "../api/league";
import { showApiErrorToast } from "../actions/utils/showApiErrorToast";
import GroupLeagueScreen from "./league/GroupLeagueScreen";
import UserImage from "./common/UserImage";
import LeagueHeader, {HomeHeader} from "./league/LeagueHeader";
import { LeagueInfo } from "../interfaces/league.interface";
import {DrawerHeaderProps} from '@react-navigation/drawer/lib/typescript/src/types';
import NotificationsScreen from './NotificationsScreen';
import {logout} from '../actions/auth/logout';

export type DrawerStackParamList = {
  Home: undefined;
  GroupLeague: {
    leagueInfo: LeagueInfo
  };
  Notifications: undefined;
};
const Drawer = createDrawerNavigator<DrawerStackParamList>();

const DrawerNavigator = () => {

  return (
    <Drawer.Navigator initialRouteName="Home" drawerType={"slide"}
                      drawerContent={(props) => <CustomDrawerContent {...props} />}
                      drawerStyle={{
                        backgroundColor: "#c6cbef",
                        width: 230
                      }}>
      <Drawer.Screen name="Home" component={HomeScreen} options={{
        header: (props) => <HomeHeader {...props} />,
        headerShown: true
      }}/>
      <Drawer.Screen name="Notifications" component={NotificationsScreen} options={{
        header: (props) => <HomeHeader {...props} />,
        headerShown: true
      }}/>
      <Drawer.Screen name="GroupLeague" component={GroupLeagueScreen} options={{
        header: (props) => <LeagueHeader {...props} />,
        headerShown: true
      }} />
    </Drawer.Navigator>
  );
};



const CustomDrawerContent: FC<DrawerContentComponentProps> = ({ navigation }) => {

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const [loading, setLoading] = useState(false);

  const loadLeague = async (groupId: number, leagueId: number) => {
    const res = await league.getGroupLeague(groupId, leagueId);
    if (!res.IsError) {
      navigation.navigate('GroupLeague', {leagueInfo: res.Result});
    } else {
      dispatch(showApiErrorToast(res));
    }
  }

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <View style={styles.userInfo}>
          <UserImage user={user} styles={styles.userPhoto} />
          <Text style={styles.userName}>{user.name}</Text>
        </View>
        <TouchableOpacity activeOpacity={.8} onPress={() => dispatch(logout())}>
          <FontAwesomeIcon icon={faCog} style={{ color: "gray" }} size={17} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {user.groups.map((userGroup: UserGroup, i) => (
            <AccordionList key={userGroup.id} openByDefault={user.groups.length === 1 && i === 0}
                           name={userGroup.group.name} listItems={userGroup.group.leagues.map((league) => (
              <TouchableOpacity activeOpacity={.4} disabled={loading} onPress={() => loadLeague(userGroup.group.id, league.id)} style={styles.leagueButton}
                                key={league.id}>
                <Image source={{ uri: league.logo }} style={styles.leagueLogo} />
                <Text style={{ color: "#000", fontSize: 13 }}>{league.name}</Text>
              </TouchableOpacity>
            ))} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    height: "100%",
    backgroundColor: "#FCFCFC"
  },
  drawerHeader: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: "#EEEEF3",
    marginBottom: 10
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "80%"
  },
  userName: {
    color: "#000",
    fontSize: 16,
    flex: 1,
    flexWrap: "wrap"
  },
  userPhoto: {
    width: 37,
    height: 37,
    borderRadius: 50,
    marginRight: 10
  },
  leagueButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },
  leagueLogo: {
    width: 25,
    height: 25,
    marginRight: 10
  }
});

export default DrawerNavigator;
