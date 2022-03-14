import React, {FC} from "react";
import {ScrollView, Text, View} from "react-native";
import {useBottomTabBarHeight} from "@react-navigation/bottom-tabs";
import {createStackNavigator, StackNavigationProp} from '@react-navigation/stack';
import {TabsStackParamList} from '../../GroupLeagueScreen';
import {RouteProp} from '@react-navigation/native';
import RoundForm from '../../../common/RoundForm';
import {LeagueHomeInfo, ILeagueInfo, LeagueInfo, Round} from '../../../../interfaces/league.interface';
import RoundListScreen from '../Rounds/RoundListScreen';
import RoundDetailScreen from '../Rounds/RoundDetailScreen';
import LeagueHomeScreen from './HomeScreen';

type ScreenNavigationProps = StackNavigationProp<TabsStackParamList, "TabHome">;
type ScreenRouteProp = RouteProp<TabsStackParamList, "TabHome">;

interface Props {
    navigation: ScreenNavigationProps;
    route: ScreenRouteProp;
    leagueInfo: LeagueInfo;
}

export type HomeStackParamList = {
    LeagueHome: undefined;
    RoundDetail: {
        round: Round;
        onSubmit: (Round) => void
    }
};
const HomeStack = createStackNavigator<HomeStackParamList>();

const TabHomeScreen: FC<Props> = ({navigation, route, leagueInfo}) => {

    const tabBarHeight = useBottomTabBarHeight();

    return (
        <View style={{marginTop: tabBarHeight, backgroundColor: '#F3F4F9', height: '100%'}}>
            <HomeStack.Navigator screenOptions={{
                animationTypeForReplace: "pop",
                headerShown: false
            }} initialRouteName={"LeagueHome"}>
                <HomeStack.Screen name={"LeagueHome"}
                                  children={(props) => <LeagueHomeScreen {...props} leagueInfo={leagueInfo}/>} />
                <HomeStack.Screen name={"RoundDetail"} component={RoundDetailScreen}/>
            </HomeStack.Navigator>
        </View>
    );
};

export default TabHomeScreen;
