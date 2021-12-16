import React, {FC} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useSelector} from "react-redux";
import {RootState} from "../../reducers";
import UserImage from "../common/UserImage";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {DrawerHeaderProps} from "@react-navigation/drawer/lib/typescript/src/types";
import {faBell, faDotCircle} from "@fortawesome/free-regular-svg-icons";
import {faBell as faBellSolid, faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import {LeagueInfo} from "../../interfaces/league.interface";
import styled from 'styled-components/native';
import {StackHeaderProps} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';

const LeagueHeader: FC<DrawerHeaderProps> = ({scene}) => {

    const user = useSelector((state: RootState) => state.user.currentUser);

    const {leagueInfo} = scene.route.params as { leagueInfo: LeagueInfo };

    return (
        <View style={styles.container}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <TouchableOpacity activeOpacity={.5} onPress={() => scene.descriptor.navigation.toggleDrawer()}>
                    <UserImage user={user} styles={styles.userImage}/>
                </TouchableOpacity>
                <Text style={styles.leagueName}>{leagueInfo.leagueInfo.name}</Text>
            </View>
            <View>
                <View style={styles.chip}>
                    <FontAwesomeIcon icon={faDotCircle} color={"#ffa600"} size={13}/>
                    <Text style={styles.chipText}>{leagueInfo.totalPoints}</Text>
                </View>
            </View>
        </View>
    );
};

export const HomeHeader: FC<DrawerHeaderProps> = ({scene}) => {

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
        <View style={styles.container}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <TouchableOpacity activeOpacity={.5} onPress={() => scene.descriptor.navigation.toggleDrawer()}>
                    <UserImage user={user} styles={styles.userImage}/>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity activeOpacity={.6}
                                  onPress={() => scene.descriptor.navigation.navigate('Notifications')}>
                    <FontAwesomeIcon icon={user.invitations.length ? faBellSolid : faBell} color={'#000'} size={20}/>
                    {!!user.invitations.length && (
                        <BadgeContainer>
                            <Text style={{color: '#fff', fontSize: 10}}>{user.invitations.length}</Text>
                        </BadgeContainer>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    )
}

export const HomeTitleHeader: FC<DrawerHeaderProps> = ({scene}) => {

    const {t} = useTranslation();

    return (
        <View style={[styles.container, {height: 45}]}>
            <TouchableOpacity activeOpacity={.5} onPress={() => scene.descriptor.navigation.goBack()}
                              style={styles.backButton}>
                <FontAwesomeIcon icon={faChevronLeft} color={"#000"} size={13}/>
            </TouchableOpacity>
            <Text style={styles.title}>{t(scene.route.name)}</Text>
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
        color: "#000",
        marginLeft: 10,
        fontSize: 13,
        fontWeight: "bold"
    },
    leagueName: {
        fontSize: 17,
        color: "#000",
        marginLeft: 12
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

export default LeagueHeader;
