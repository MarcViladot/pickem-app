import React, {FC, useEffect} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useSelector} from "react-redux";
import {RootState} from "../../reducers";
import UserImage from "../common/UserImage";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {DrawerHeaderProps} from "@react-navigation/drawer/lib/typescript/src/types";
import {faBell, faDotCircle} from "@fortawesome/free-regular-svg-icons";
import {faBell as faBellSolid, faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import {ILeagueInfo} from "../../interfaces/league.interface";
import styled from 'styled-components/native';
import {StackHeaderProps} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {ThemeText} from '../common/ThemeText';
import { ThemeView } from "../common/ThemeView";

const LeagueHeader: FC<DrawerHeaderProps> = ({scene}) => {

    const { colors } = useTheme();
    const user = useSelector((state: RootState) => state.user.currentUser);

    const {leagueInfo} = scene.route.params as { leagueInfo: ILeagueInfo };

    return (
        <ThemeView style={styles.container}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <TouchableOpacity activeOpacity={.5} onPress={() => scene.descriptor.navigation.toggleDrawer()}>
                    <UserImage user={user} styles={styles.userImage}/>
                </TouchableOpacity>
                <ThemeText style={styles.leagueName}>{leagueInfo.groupInfo.name} - {leagueInfo.leagueInfo.name}</ThemeText>
            </View>
            <View>
                <View style={styles.chip}>
                    <FontAwesomeIcon icon={faDotCircle} color={"#ffa600"} size={13}/>
                    <ThemeText style={styles.chipText}>{leagueInfo.totalPoints}</ThemeText>
                </View>
            </View>
        </ThemeView>
    );
};

export const HomeHeader: FC<DrawerHeaderProps> = ({scene}) => {

    const {colors} = useTheme();
    const user = useSelector((state: RootState) => state.user.currentUser);

    const BadgeContainer = styled.View`
      position: absolute;
      right: -3px;
      top: -5px;
      background-color: #38b174;
      border-radius: 8px;
      padding: 0 4px;
      height: 12px;
      justify-content: center;
      align-items: center;
    `;

    return (
        <ThemeView style={styles.container}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <TouchableOpacity activeOpacity={.5} onPress={() => scene.descriptor.navigation.toggleDrawer()}>
                    <UserImage user={user} styles={styles.userImage}/>
                </TouchableOpacity>
                <Text style={{marginLeft: 10, fontSize: 20}}>Picke'ms</Text>
            </View>
            {/*<View>
                <TouchableOpacity activeOpacity={.6}
                                  onPress={() => scene.descriptor.navigation.navigate('Notifications')}>
                    <FontAwesomeIcon icon={user.invitations.length ? faBellSolid : faBell} color={colors.text} size={20}/>
                    {!!user.invitations.length && (
                        <BadgeContainer>
                            <Text style={{color: '#fff', fontSize: 10}}>{user.invitations.length}</Text>
                        </BadgeContainer>
                    )}
                </TouchableOpacity>
            </View>*/}
        </ThemeView>
    )
}

export const HomeTitleHeader: FC<DrawerHeaderProps> = ({scene}) => {

    const {colors} = useTheme();
    const {t} = useTranslation();

    return (
        <View style={[styles.container, {height: 45, backgroundColor: colors.card}]}>
            <TouchableOpacity activeOpacity={.5} onPress={() => scene.descriptor.navigation.goBack()}
                              style={styles.backButton}>
                <FontAwesomeIcon icon={faChevronLeft} color={colors.text} size={13}/>
            </TouchableOpacity>
            <ThemeText style={styles.title}>{t(`MENU.${scene.route.name}`)}</ThemeText>
            <View style={{width: 30}}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    userImage: {
        width: 35,
        height: 35,
        borderRadius: 50
    },
    chip: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: .5,
        borderColor: "#e0e0e0",
        borderRadius: 50,
        paddingVertical: 4,
        paddingHorizontal: 10
    },
    chipText: {
        marginLeft: 10,
        fontSize: 13,
        fontWeight: "bold"
    },
    leagueName: {
        fontSize: 17,
        marginLeft: 12
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

export default LeagueHeader;
