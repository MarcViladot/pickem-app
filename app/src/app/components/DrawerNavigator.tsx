import React, {FC, useEffect, useState} from "react";
import {createDrawerNavigator} from "@react-navigation/drawer";
import HomeScreen from "./HomeScreen";
import Foo from "./league/GroupLeagueScreen";
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {DrawerContentComponentProps} from "@react-navigation/drawer/src/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../reducers";
import {faCog} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import AccordionList from "./common/AccordionList";
import {UserGroup} from "../interfaces/user.interface";
import league from "../api/league";
import {showApiErrorToast} from "../actions/utils/showApiErrorToast";
import GroupLeagueScreen from "./league/GroupLeagueScreen";
import UserImage from "./common/UserImage";
import LeagueHeader, {HomeHeader, HomeTitleHeader} from "./league/LeagueHeader";
import {LeagueInfo} from "../interfaces/league.interface";
import NotificationsScreen from './NotificationsScreen';
import SettingsScreen from './user/SettingsScreen';
import {useTheme} from '@react-navigation/native';
import {ThemeText} from './common/ThemeText';
import {ThemeView} from "./common/ThemeView";
import {StyledButton} from './common/StyledButton';
import {useTranslation} from 'react-i18next';
import AddScreen from './add/AddScreen';
import {CommonActions} from '@react-navigation/native';


export type DrawerStackParamList = {
    Home: undefined;
    GroupLeague: {
        leagueInfo: LeagueInfo
    };
    Notifications: undefined;
    Settings: undefined;
    Add: undefined;
};
const Drawer = createDrawerNavigator<DrawerStackParamList>();

const DrawerNavigator = () => {

    return (
        <Drawer.Navigator initialRouteName="Home" drawerType={"slide"}
                          drawerContent={(props) => <CustomDrawerContent {...props} />}
                          drawerStyle={{
                              backgroundColor: "#c6cbef",
                              width: 230
                          }}>
            <Drawer.Screen name="Home" component={HomeScreen} options={{
                header: (props) => <HomeHeader {...props} />,
                headerShown: true
            }}/>
            <Drawer.Screen name="Notifications" component={NotificationsScreen} options={{
                header: (props) => <HomeTitleHeader {...props} />,
                headerShown: true
            }}/>
            <Drawer.Screen name="GroupLeague" component={GroupLeagueScreen} options={{
                header: (props) => <LeagueHeader {...props} />,
                headerShown: true
            }}/>
            <Drawer.Screen name="Settings" component={SettingsScreen} options={{
                headerShown: false
            }}/>
            <Drawer.Screen name="Add" component={AddScreen} options={{
                headerShown: false
            }}/>
        </Drawer.Navigator>
    );
};


const CustomDrawerContent: FC<DrawerContentComponentProps> = ({navigation}) => {

    const {t} = useTranslation();
    const {colors, dark} = useTheme();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.currentUser);
    const [loading, setLoading] = useState(false);

    const loadLeague = async (groupId: number, leagueId: number) => {
        const res = await league.getGroupLeague(groupId, leagueId);
        if (!res.IsError) {
            navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [
                        {
                            name: 'GroupLeague'
                        },
                    ],
                })
            );
            navigation.navigate('GroupLeague', {leagueInfo: res.Result});
        } else {
            dispatch(showApiErrorToast(res));
        }
    }

    return (
        <View style={[styles.drawerContainer, {backgroundColor: colors.background}]}>
            <ThemeView style={[styles.drawerHeader, {
                borderColor: dark ? '#313e46' : '#EEEEF3'
            }]}>
                <View style={styles.userInfo}>
                    <UserImage user={user} styles={styles.userPhoto}/>
                    <ThemeText style={styles.userName}>{user.name}</ThemeText>
                </View>
                <TouchableOpacity activeOpacity={.8} onPress={() => navigation.navigate('Settings')}>
                    <FontAwesomeIcon icon={faCog} color={colors.text} size={17}/>
                </TouchableOpacity>
            </ThemeView>
            <ScrollView style={{flex: 1}}>
                {user.groups.map((userGroup: UserGroup, i) => (
                    <AccordionList key={userGroup.id} openByDefault={user.groups.length === 1 && i === 0}
                                   name={userGroup.group.name} listItems={userGroup.group.leagues.map((league) => (
                        <TouchableOpacity activeOpacity={.4} disabled={loading}
                                          onPress={() => loadLeague(userGroup.group.id, league.id)}
                                          style={styles.leagueButton}
                                          key={league.id}>
                            <Image source={{uri: league.logo}} style={styles.leagueLogo}/>
                            <ThemeText style={{fontSize: 13}}>{league.name}</ThemeText>
                        </TouchableOpacity>
                    ))}/>
                ))}
            </ScrollView>
            <ThemeView style={styles.footer}>
                <StyledButton disabled={false} color={'primary'} onPress={() => navigation.navigate('Add')}>
                    <Text style={{color: 'white'}}>{t('ADD.ADD_LEAGUE_OR_GROUP')}</Text>
                </StyledButton>
            </ThemeView>
        </View>
    );
};

const styles = StyleSheet.create({
    drawerContainer: {
        height: "100%"
    },
    drawerHeader: {
        paddingVertical: 7,
        paddingHorizontal: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        // borderColor: "#EEEEF3",
        marginBottom: 10
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        maxWidth: "80%"
    },
    userName: {
        fontSize: 16,
        flex: 1,
        flexWrap: "wrap"
    },
    userPhoto: {
        width: 37,
        height: 37,
        borderRadius: 50,
        marginRight: 10
    },
    leagueButton: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10
    },
    leagueLogo: {
        width: 25,
        height: 25,
        marginRight: 10,
    },
    footer: {
        padding: 10
    }
});

export default DrawerNavigator;
