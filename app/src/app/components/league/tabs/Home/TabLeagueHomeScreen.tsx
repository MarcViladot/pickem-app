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
import LeagueHomeScreen from './LeagueHomeScreen';

type ScreenNavigationProps = StackNavigationProp<TabsStackParamList, "TabHome">;
type ScreenRouteProp = RouteProp<TabsStackParamList, "TabHome">;

interface Props {
    navigation: ScreenNavigationProps;
    route: ScreenRouteProp;
    leagueInfo: LeagueInfo;
}

export type LeagueHomeStackParamList = {
    LeagueHome: undefined;
    RoundDetail: {
        round: Round;
        onSubmit: (Round) => void
    }
};
const LeagueHomeStack = createStackNavigator<LeagueHomeStackParamList>();

const TabLeagueHomeScreen: FC<Props> = ({navigation, route, leagueInfo}) => {

    const tabBarHeight = useBottomTabBarHeight();

    return (
        <View style={{marginTop: tabBarHeight, backgroundColor: '#F3F4F9', height: '100%'}}>
            <LeagueHomeStack.Navigator screenOptions={{
                animationTypeForReplace: "pop",
                headerShown: false
            }} initialRouteName={"LeagueHome"}>
                <LeagueHomeStack.Screen name={"LeagueHome"}
                                  children={(props) => <LeagueHomeScreen {...props} leagueInfo={leagueInfo}/>} />
                <LeagueHomeStack.Screen name={"RoundDetail"} component={RoundDetailScreen}/>
            </LeagueHomeStack.Navigator>
        </View>
    );
};

export default TabLeagueHomeScreen;
