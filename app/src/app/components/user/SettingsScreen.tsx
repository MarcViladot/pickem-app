import React, {FC} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {createStackNavigator, StackHeaderProps, StackNavigationProp} from '@react-navigation/stack';
import {DrawerStackParamList} from '../DrawerNavigator';
import {RouteProp} from '@react-navigation/native';
import NotificationsScreen from './NotificationsScreen';
import {useTranslation} from 'react-i18next';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import SettingsListScreen from './SettingsListScreen';

type ScreenNavigationProps = StackNavigationProp<DrawerStackParamList, "Settings">;
type ScreenRouteProp = RouteProp<DrawerStackParamList, "Settings">;

interface Props {
    navigation: ScreenNavigationProps;
    route: ScreenRouteProp;
}

export type SettingsStackParamList = {
    Notifications: undefined;
    SettingsList: undefined;
};
const SettingsStack = createStackNavigator<SettingsStackParamList>();

const SettingsScreen: FC<Props> = ({navigation, route}) => {

    return (
        <View style={{backgroundColor: '#F3F4F9', height: '100%'}}>
            <SettingsStack.Navigator screenOptions={{
                animationTypeForReplace: "pop",
                headerShown: true,
                header: (props) => <TitleHeader {...props} />
            }} initialRouteName={"SettingsList"}>
                <SettingsStack.Screen name={"SettingsList"} component={SettingsListScreen}/>
                <SettingsStack.Screen name={"Notifications"} component={NotificationsScreen}/>
            </SettingsStack.Navigator>
        </View>
    );
};

export const TitleHeader: FC<StackHeaderProps> = ({route, navigation}) => {

    const {t} = useTranslation();

    return (
        <View style={styles.container}>
            <TouchableOpacity activeOpacity={.5} onPress={() => navigation.goBack()}
                              style={styles.backButton}>
                <FontAwesomeIcon icon={faChevronLeft} color={"#000"} size={13}/>
            </TouchableOpacity>
            <Text style={styles.title}>{t(route.name)}</Text>
            <View style={{width: 30}}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFF",
        paddingVertical: 5,
        paddingHorizontal: 10,
        flexDirection: "row",
        height: 45,
        justifyContent: "space-between",
        alignItems: "center"
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
    },
    backButton: {
        borderWidth: 1,
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        borderColor: "#C7C8CA"
    }
});

export default SettingsScreen;
