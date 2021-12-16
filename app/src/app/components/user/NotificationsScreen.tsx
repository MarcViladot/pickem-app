import React, {FC} from 'react';
import {View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RoundsStackParamList} from '../league/tabs/Rounds/TabRoundsScreen';
import {RouteProp} from '@react-navigation/native';
import {SettingsStackParamList} from './SettingsScreen';

type ScreenNavigationProps = StackNavigationProp<SettingsStackParamList, "Notifications">;
type ScreenRouteProp = RouteProp<SettingsStackParamList, "Notifications">;

interface Props {
    navigation: ScreenNavigationProps;
    route: ScreenRouteProp;
}

const NotificationsScreen: FC<Props> = ({route, navigation}) => {
    return (
        <View>
        </View>
    );
};

export default NotificationsScreen;
