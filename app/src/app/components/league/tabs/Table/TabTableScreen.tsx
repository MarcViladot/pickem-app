import React, {FC, useEffect} from "react";
import {StyleSheet, Text, View} from "react-native";
import {useBottomTabBarHeight} from "@react-navigation/bottom-tabs";
import ButtonGroup, {IGroupButton} from "../../../common/ButtonGroup";
import {createStackNavigator, StackNavigationProp} from "@react-navigation/stack";
import {TabsStackParamList} from "../../GroupLeagueScreen";
import {RouteProp} from "@react-navigation/native";
import UserImage from "../../../common/UserImage";
import {User, UserGroup} from "../../../../interfaces/user.interface";
import {useSelector} from "react-redux";
import {RootState} from "../../../../reducers";
import DropDownPicker, {ItemType} from "react-native-dropdown-picker";
import {LeagueInfo, Round} from "../../../../interfaces/league.interface";
import user from "../../../../reducers/user";
import RoundListScreen from '../Rounds/RoundListScreen';
import RoundDetailScreen from '../Rounds/RoundDetailScreen';
import TableScreen from './TableScreen';
import TableRoundDetailScreen from './TableRoundDetailScreen';

type ScreenNavigationProps = StackNavigationProp<TabsStackParamList, "TabTable">;
type ScreenRouteProp = RouteProp<TabsStackParamList, "TabTable">;

interface Props {
    navigation: ScreenNavigationProps;
    route: ScreenRouteProp;
}

export type TableStackParamList = {
    Table: {
        leagueInfo: LeagueInfo
    };
    TableRoundDetail: {
        round: Round;
    };
};
const TableStack = createStackNavigator<TableStackParamList>();

const TabTableScreen: FC<Props> = ({navigation, route}) => {

    const tabBarHeight = useBottomTabBarHeight();
    const {leagueInfo} = route.params;

    return (
        <View style={{marginTop: tabBarHeight, backgroundColor: '#F3F4F9', height: '100%'}}>
            <TableStack.Navigator screenOptions={{
                animationTypeForReplace: "pop",
                headerShown: false
            }} initialRouteName={"Table"}>
                <TableStack.Screen name={"Table"} component={TableScreen} initialParams={{leagueInfo}}/>
                <TableStack.Screen name={"TableRoundDetail"} component={TableRoundDetailScreen}/>
            </TableStack.Navigator>
        </View>
    );
};

export default TabTableScreen;
