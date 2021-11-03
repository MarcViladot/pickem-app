import React, { FC } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { DrawerStackParamList } from "../DrawerNavigator";
import TabHomeScreen from "./tabs/TabHomeScreen";
import TabRoundsScreen from "./tabs/TabRoundsScreen";
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
  TabHomeScreen: undefined;
  TabRoundsScreen: undefined;
  TabTableScreen: undefined;
  TabMoreScreen: undefined;
};
const Tab = createBottomTabNavigator<TabsStackParamList>();

const GroupLeagueScreen: FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  return (
    <Tab.Navigator initialRouteName={"TabHomeScreen"} screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBarStyle,
      tabBarLabelStyle: styles.tabBarLabelStyle,
      tabBarIconStyle: styles.tabBarIconStyle
    }}>
      <Tab.Screen name="TabHomeScreen" component={TabHomeScreen} options={{
        tabBarIcon: ({ focused, color }) => <FontAwesomeIcon icon={faHome} size={14} />,
        tabBarLabel: t("LEAGUE.HOME")
      }} />
      <Tab.Screen name="TabRoundsScreen" component={TabRoundsScreen} options={{
        tabBarIcon: ({ focused, color }) => <FontAwesomeIcon icon={faClock} size={14} />,
        tabBarLabel: t("LEAGUE.ROUNDS")
      }} />
      <Tab.Screen name="TabTableScreen" component={TabTableScreen} options={{
        tabBarIcon: ({ focused, color }) => <FontAwesomeIcon icon={faTrophy} size={14} />,
        tabBarLabel: t("LEAGUE.TABLE")
      }} />
      <Tab.Screen name="TabMoreScreen" component={TabMoreScreen} options={{
        tabBarIcon: ({ focused, color }) => <FontAwesomeIcon icon={faBars} size={14} />,
        tabBarLabel: t("LEAGUE.MORE")
      }} />
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
    height: 35
  },
  tabBarLabelStyle: {
    marginVertical: 2,
    fontSize: 8
  },
  tabBarIconStyle: {
    marginTop: 5
  }
});

export default GroupLeagueScreen;
