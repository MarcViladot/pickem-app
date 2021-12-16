import React, {FC} from "react";
import {ScrollView, Text, View} from "react-native";
import {useBottomTabBarHeight} from "@react-navigation/bottom-tabs";
import {StackNavigationProp} from '@react-navigation/stack';
import {TabsStackParamList} from '../GroupLeagueScreen';
import {RouteProp} from '@react-navigation/native';
import RoundForm from '../../common/RoundForm';

type ScreenNavigationProps = StackNavigationProp<TabsStackParamList, "TabHome">;
type ScreenRouteProp = RouteProp<TabsStackParamList, "TabHome">;

interface Props {
    navigation: ScreenNavigationProps;
    route: ScreenRouteProp;
}

const TabHomeScreen: FC<Props> = ({navigation, route}) => {

    const tabBarHeight = useBottomTabBarHeight();

    const {leagueInfo} = route.params;

    return (
        <View style={{marginTop: tabBarHeight, backgroundColor: '#F3F4F9', height: '100%'}}>
            <ScrollView>
                {/*<RoundForm round={leagueInfo.leagueInfo.rounds[0]}/>*/}
            </ScrollView>
        </View>
    );
};

export default TabHomeScreen;
