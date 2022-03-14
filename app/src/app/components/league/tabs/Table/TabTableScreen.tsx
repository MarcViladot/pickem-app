import React, {FC, useEffect} from "react";
import {StyleSheet, Text, View} from "react-native";
import {useBottomTabBarHeight} from "@react-navigation/bottom-tabs";
import ButtonGroup, {IGroupButton} from "../../../common/ButtonGroup";
import {createStackNavigator, StackNavigationProp} from "@react-navigation/stack";
import {TabsStackParamList} from "../../GroupLeagueScreen";
import {RouteProp} from "@react-navigation/native";
import {ILeagueInfo, LeagueInfo, Round} from "../../../../interfaces/league.interface";
import TableScreen from './TableScreen';
import TableRoundDetailScreen from './TableRoundDetailScreen';

type ScreenNavigationProps = StackNavigationProp<TabsStackParamList, "TabTable">;
type ScreenRouteProp = RouteProp<TabsStackParamList, "TabTable">;

interface Props {
    navigation: ScreenNavigationProps;
    route: ScreenRouteProp;
    leagueInfo: LeagueInfo;
}

export type TableStackParamList = {
    Table: undefined
    TableRoundDetail: {
        round: Round;
    };
};
const TableStack = createStackNavigator<TableStackParamList>();

const TabTableScreen: FC<Props> = ({navigation, route, leagueInfo}) => {

    const tabBarHeight = useBottomTabBarHeight();

    return (
        <View style={{marginTop: tabBarHeight, height: '100%'}}>
            <TableStack.Navigator screenOptions={{
                animationTypeForReplace: "pop",
                headerShown: false
            }} initialRouteName={"Table"}>
                <TableStack.Screen name={"Table"}
                                   children={(props) => <TableScreen {...props} leagueInfo={leagueInfo}/>}/>
                <TableStack.Screen name={"TableRoundDetail"} component={TableRoundDetailScreen}/>
            </TableStack.Navigator>
        </View>
    );
};

export default TabTableScreen;
