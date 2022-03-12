import React, {FC} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {ScrollView, View, Text} from 'react-native';
import {HomeStackParamList} from './TabHomeScreen';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

type ScreenNavigationProps = StackNavigationProp<HomeStackParamList, "LeagueHome">;
type ScreenRouteProp = RouteProp<HomeStackParamList, "LeagueHome">;

interface Props {
    navigation: ScreenNavigationProps;
    route: ScreenRouteProp;
}

const LeagueHomeScreen: FC<Props> = ({route, navigation}) => {

    const {leagueInfo} = route.params;
    const tabBarHeight = useBottomTabBarHeight();
    return (
        <View style={{marginTop: tabBarHeight, height: '100%'}}>
            <ScrollView>
                <Text>{JSON.stringify(leagueInfo.homeInfo)}</Text>
            </ScrollView>
        </View>
    );
};

export default LeagueHomeScreen;
