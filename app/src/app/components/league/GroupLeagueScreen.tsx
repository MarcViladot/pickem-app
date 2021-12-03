import React, { FC } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { DrawerStackParamList } from "../DrawerNavigator";
import TabHomeScreen from "./tabs/TabHomeScreen";
import TabRoundsScreen from "./tabs/Rounds/TabRoundsScreen";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBars, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";
import { faHome } from "@fortawesome/free-solid-svg-icons/faHome";
import { useTranslation } from "react-i18next";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import TabTableScreen from "./tabs/TabTableScreen";
import TabMoreScreen from "./tabs/TabMoreScreen";
import { LeagueInfo } from "../../interfaces/league.interface";

type ScreenNavigationProps = StackNavigationProp<DrawerStackParamList, "GroupLeague">;
type ScreenRouteProp = RouteProp<DrawerStackParamList, "GroupLeague">;

interface Props {
  navigation: ScreenNavigationProps;
  route: ScreenRouteProp;
}

export type TabsStackParamList = {
  TabHome: {
    leagueInfo: LeagueInfo
  },
  TabTable: {
    leagueInfo: LeagueInfo
  };
  TabMore: {
    leagueInfo: LeagueInfo
  };
  TabRounds: {
    leagueInfo: LeagueInfo
  };
};
const Tab = createBottomTabNavigator<TabsStackParamList>();

const GroupLeagueScreen: FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { leagueInfo } = route.params;
  return (
    <Tab.Navigator initialRouteName={"TabHome"} screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBarStyle,
      tabBarLabelStyle: styles.tabBarLabelStyle,
      tabBarIconStyle: styles.tabBarIconStyle
    }}>
      <Tab.Screen name="TabHome" component={TabHomeScreen} options={{
        tabBarIcon: ({ focused, color }) => <FontAwesomeIcon icon={faHome} size={15} />,
        tabBarLabel: t("LEAGUE.HOME")
      }} initialParams={{ leagueInfo }} />
      <Tab.Screen name="TabRounds" component={TabRoundsScreen} options={{
        tabBarIcon: ({ focused, color }) => <FontAwesomeIcon icon={faClock} size={15} />,
        tabBarLabel: t("LEAGUE.ROUNDS")
      }} initialParams={{ leagueInfo }} />
      <Tab.Screen name="TabTable" component={TabTableScreen} options={{
        tabBarIcon: ({ focused, color }) => <FontAwesomeIcon icon={faTrophy} size={15} />,
        tabBarLabel: t("LEAGUE.TABLE")
      }} initialParams={{ leagueInfo }} />
      <Tab.Screen name="TabMore" component={TabMoreScreen} options={{
        tabBarIcon: ({ focused, color }) => <FontAwesomeIcon icon={faBars} size={15} />,
        tabBarLabel: t("LEAGUE.MORE")
      }} initialParams={{ leagueInfo }} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    position: "absolute",
    top: 0,
    // Remove border top on both android & ios
    borderTopWidth: 0,
    elevation: 0,
    shadowColor: "#5bc4ff",
    shadowOpacity: 0,
    shadowOffset: {
      width: 0, height: 0 // for iOS
    },
    shadowRadius: 0,
    height: 40
  },
  tabBarLabelStyle: {
    marginVertical: 4,
    fontSize: 12
  },
  tabBarIconStyle: {
    marginTop: 5
  }
});

export default GroupLeagueScreen;
