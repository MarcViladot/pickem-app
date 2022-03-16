import React, {FC} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import {useBottomTabBarHeight} from "@react-navigation/bottom-tabs";
import {StackNavigationProp} from "@react-navigation/stack";
import {RouteProp, useTheme} from "@react-navigation/native";
import {TabsStackParamList} from "../../GroupLeagueScreen";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faPlusCircle, faUsersCog} from "@fortawesome/free-solid-svg-icons";
import {ILeagueInfo, LeagueInfo} from "../../../../interfaces/league.interface";
import {useTranslation} from "react-i18next";
import styled from 'styled-components/native';
import {ThemeText} from '../../../common/ThemeText';
import RoundList from './RoundList';

type ScreenNavigationProps = StackNavigationProp<TabsStackParamList, "TabMore">;
type ScreenRouteProp = RouteProp<TabsStackParamList, "TabMore">;

interface Props {
    navigation: ScreenNavigationProps;
    route: ScreenRouteProp;
    leagueInfo: LeagueInfo;
}

const TabMoreScreen: FC<Props> = ({navigation, route, leagueInfo}) => {

    const {colors} = useTheme();
    const {t, i18n} = useTranslation();
    const tabBarHeight = useBottomTabBarHeight();
    const defaultRoundIndex = leagueInfo.leagueInfo.rounds.findIndex(round => new Date() > new Date(round.startingDate) && !round.finished);

    const TextContainer = styled.View`
      margin-bottom: 10px;
      padding: 10px;
      background-color: ${colors.card};
      width: 100%;
      border-radius: 10px;
      flex-direction: row;
      align-items: center;
    `
    return (
        <View style={{marginTop: tabBarHeight, flex: 1}}>
            <View style={{padding: 10, paddingTop: 20, flex: 1, justifyContent: "space-between"}}>
                <View style={{flex: 1}}>
                    {leagueInfo.leagueInfo.rounds.length > 0 ?
                        <RoundList rounds={leagueInfo.leagueInfo.rounds} defaultRoundIndex={defaultRoundIndex}/>
                        :
                        <View style={{alignItems: 'center', marginTop: 30}}>
                            <Text style={{fontSize: 20}}>{t('TABLE.NO_ROUNDS')}</Text>
                        </View>
                    }
                </View>
                <View>
                    <TextContainer>
                        <TouchableOpacity activeOpacity={.5}>
                            <FontAwesomeIcon icon={faPlusCircle} color={"#96A6B6"} style={{marginRight: 10}} size={35}/>
                        </TouchableOpacity>
                        <View style={{flexDirection: "column"}}>
                            <ThemeText style={{fontSize: 17}}>{t("LEAGUE.INVITE_FRIENDS")}</ThemeText>
                            <ThemeText
                                style={{fontSize: 13}}>{t("LEAGUE.INVITATION_CODE", {code: leagueInfo.groupInfo.invitationCode})}</ThemeText>
                        </View>
                    </TextContainer>
                    <TextContainer>
                        <TouchableOpacity activeOpacity={.5} style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%'
                        }}>
                            <ThemeText style={{fontSize: 15}}>{t("LEAGUE.GROUP_CONFIG")}</ThemeText>
                            <FontAwesomeIcon icon={faUsersCog} color={"#96A6B6"} style={{marginRight: 10}} size={20}/>
                        </TouchableOpacity>
                    </TextContainer>
                    <TextContainer>
                        <Text style={{color: "#4544CB", fontSize: 15}}>{t("LEAGUE.REMOVE_ADS")}</Text>
                    </TextContainer>
                    <TextContainer>
                        <Text style={{color: "#BE2560", fontSize: 15}}>{t("LEAGUE.LEAVE_GROUP")}</Text>
                    </TextContainer>
                </View>
            </View>
        </View>
    );
};


export default TabMoreScreen;
