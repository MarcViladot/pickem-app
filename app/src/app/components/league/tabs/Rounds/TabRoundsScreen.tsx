import React, {FC} from "react";
import {StyleSheet, View} from "react-native";
import {useBottomTabBarHeight} from "@react-navigation/bottom-tabs";
import {createStackNavigator, StackNavigationProp} from '@react-navigation/stack';
import {TabsStackParamList} from '../../GroupLeagueScreen';
import {RouteProp} from '@react-navigation/native';
import {LeagueInfo, Round} from '../../../../interfaces/league.interface';
import RoundListScreen from './RoundListScreen';
import RoundDetailScreen from './RoundDetailScreen';

type ScreenNavigationProps = StackNavigationProp<TabsStackParamList, "TabRounds">;
type ScreenRouteProp = RouteProp<TabsStackParamList, "TabRounds">;

interface Props {
    navigation: ScreenNavigationProps;
    route: ScreenRouteProp;
}

export type RoundsStackParamList = {
    RoundList: {
        leagueInfo: LeagueInfo
    };
    RoundDetail: {
        round: Round;
        isPending: boolean;
    };
};
const RoundsStack = createStackNavigator<RoundsStackParamList>();

const TabRoundsScreen: FC<Props> = ({navigation, route}) => {

    const tabBarHeight = useBottomTabBarHeight();
    const {leagueInfo} = route.params;

    return (
        <View style={{marginTop: tabBarHeight, backgroundColor: '#F3F4F9', height: '100%'}}>
            <RoundsStack.Navigator screenOptions={{
                animationTypeForReplace: "pop",
                headerShown: false
            }} initialRouteName={"RoundList"}>
                <RoundsStack.Screen name={"RoundList"} component={RoundListScreen} initialParams={{leagueInfo}}/>
                <RoundsStack.Screen name={"RoundDetail"} component={RoundDetailScreen}/>
            </RoundsStack.Navigator>
        </View>
    );
};

export default TabRoundsScreen;
