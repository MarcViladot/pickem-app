import React, {FC} from 'react';
import {LeagueInfo, Round} from '../../interfaces/league.interface';
import {createStackNavigator, StackNavigationProp} from '@react-navigation/stack';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {View} from 'react-native';
import LeagueHomeScreen from '../league/tabs/Home/LeagueHomeScreen';
import RoundDetailScreen from '../league/tabs/Rounds/RoundDetailScreen';
import {TabsStackParamList} from '../league/GroupLeagueScreen';
import {RouteProp} from '@react-navigation/native';
import HomeScreen from './HomeScreen';
import {DrawerStackParamList} from '../DrawerNavigator';

type ScreenNavigationProps = StackNavigationProp<DrawerStackParamList, "HomeStack">;
type ScreenRouteProp = RouteProp<DrawerStackParamList, "HomeStack">;

interface Props {
    navigation: ScreenNavigationProps;
    route: ScreenRouteProp;
}

export type HomeStackParamList = {
    Home: undefined;
    RoundDetail: {
        round: Round;
        onSubmit: (Round) => void
    }
};
const HomeStack = createStackNavigator<HomeStackParamList>();

const HomeStackScreen: FC<Props> = ({navigation, route}) => {

    return (
        <View style={{backgroundColor: '#F3F4F9', height: '100%'}}>
            <HomeStack.Navigator screenOptions={{
                animationTypeForReplace: "pop",
                headerShown: false
            }} initialRouteName={"Home"}>
                <HomeStack.Screen name={"Home"}
                                  children={(props) => <HomeScreen {...props} />} />
                <HomeStack.Screen name={"RoundDetail"} component={RoundDetailScreen}/>
            </HomeStack.Navigator>
        </View>
    );
};


export default HomeStackScreen;
