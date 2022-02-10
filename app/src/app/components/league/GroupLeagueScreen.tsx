import React, {FC, useEffect} from "react";
import {StackNavigationProp} from "@react-navigation/stack";
import {RouteProp, useTheme} from "@react-navigation/native";
import {DrawerStackParamList} from "../DrawerNavigator";
import TabHomeScreen from "./tabs/TabHomeScreen";
import TabRoundsScreen from "./tabs/Rounds/TabRoundsScreen";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faBars, faTrophy} from "@fortawesome/free-solid-svg-icons";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {StyleSheet} from "react-native";
import {faHome} from "@fortawesome/free-solid-svg-icons/faHome";
import {useTranslation} from "react-i18next";
import {faClock} from "@fortawesome/free-regular-svg-icons";
import TabTableScreen from "./tabs/Table/TabTableScreen";
import TabMoreScreen from "./tabs/More/TabMoreScreen";
import {LeagueInfo} from "../../interfaces/league.interface";

type ScreenNavigationProps = StackNavigationProp<DrawerStackParamList, "GroupLeague">;
type ScreenRouteProp = RouteProp<DrawerStackParamList, "GroupLeague">;

interface Props {
    navigation: ScreenNavigationProps;
    route: ScreenRouteProp;
}

export type TabsStackParamList = {
    TabHome: undefined;
    TabTable: undefined;
    TabMore: undefined;
    TabRounds: undefined;
};
const Tab = createBottomTabNavigator<TabsStackParamList>();

const GroupLeagueScreen: FC<Props> = ({navigation, route}) => {

    const {colors} = useTheme();
    const {t} = useTranslation();
    const {leagueInfo} = route.params;

    return (
        <Tab.Navigator initialRouteName={"TabHome"} screenOptions={{
            headerShown: false,
            tabBarStyle: [styles.tabBarStyle, {backgroundColor: colors.card}],
            tabBarLabelStyle: styles.tabBarLabelStyle,
            tabBarIconStyle: styles.tabBarIconStyle,
        }}>
            <Tab.Screen name="TabHome" component={TabHomeScreen} options={{
                tabBarIcon: ({focused, color}) => <FontAwesomeIcon icon={faHome} color={colors.text} size={15}/>,
                tabBarLabel: t("LEAGUE.HOME")
            }}/>
            <Tab.Screen name="TabRounds"
                        children={props => <TabRoundsScreen {...props} leagueInfo={leagueInfo}/>}
                        options={{
                            tabBarIcon: ({focused, color}) => <FontAwesomeIcon icon={faClock} color={colors.text}
                                                                               size={15}/>,
                            tabBarLabel: t("LEAGUE.ROUNDS")
                        }}/>
            <Tab.Screen name="TabTable"
                        children={props => <TabTableScreen {...props} leagueInfo={leagueInfo}/>}
                        options={{
                            tabBarIcon: ({focused, color}) => <FontAwesomeIcon icon={faTrophy} color={colors.text}
                                                                               size={15}/>,
                            tabBarLabel: t("LEAGUE.TABLE")
                        }}/>
            <Tab.Screen name="TabMore"
                        children={props => <TabMoreScreen {...props} leagueInfo={leagueInfo}/>} options={{
                tabBarIcon: ({focused, color}) => <FontAwesomeIcon icon={faBars} color={colors.text} size={15}/>,
                tabBarLabel: t("LEAGUE.MORE")
            }}/>
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
