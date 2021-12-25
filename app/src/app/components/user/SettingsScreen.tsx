import React, {FC} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {createStackNavigator, StackHeaderProps, StackNavigationProp} from '@react-navigation/stack';
import {DrawerStackParamList} from '../DrawerNavigator';
import {RouteProp, useTheme} from '@react-navigation/native';
import NotificationsScreen from './NotificationsScreen';
import {useTranslation} from 'react-i18next';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import SettingsListScreen from './SettingsListScreen';
import {ThemeText} from '../common/ThemeText';
import { ThemeView } from '../common/ThemeView';

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
        <View style={{height: '100%'}}>
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

    const {colors} = useTheme();
    const {t} = useTranslation();

    return (
        <ThemeView style={styles.container}>
            <TouchableOpacity activeOpacity={.5} onPress={() => navigation.goBack()}
                              style={styles.backButton}>
                <FontAwesomeIcon icon={faChevronLeft} color={colors.text} size={13}/>
            </TouchableOpacity>
            <ThemeText style={styles.title}>{t(`MENU.${route.name}`)}</ThemeText>
            <View style={{width: 30}}/>
        </ThemeView>
    )
}

const styles = StyleSheet.create({
    container: {
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
