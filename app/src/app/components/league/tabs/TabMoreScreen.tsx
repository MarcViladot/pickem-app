import React, { FC } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { StackNavigationProp } from "@react-navigation/stack";
import {RouteProp, useTheme} from "@react-navigation/native";
import { TabsStackParamList } from "../GroupLeagueScreen";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft, faChevronRight, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import {LeagueInfo, Match} from "../../../interfaces/league.interface";
import { useTranslation } from "react-i18next";
import {format} from 'date-fns';
import styled from 'styled-components/native';
import {ThemeText} from '../../common/ThemeText';
import { ThemeView } from "../../common/ThemeView";
import {CommonUtils} from '../../../utils/CommonUtils';

type ScreenNavigationProps = StackNavigationProp<TabsStackParamList, "TabMore">;
type ScreenRouteProp = RouteProp<TabsStackParamList, "TabMore">;

interface Props {
  navigation: ScreenNavigationProps;
  route: ScreenRouteProp;
  leagueInfo: LeagueInfo;
}

const TabMoreScreen: FC<Props> = ({ navigation, route, leagueInfo }) => {

  const {colors} = useTheme();
  const { t, i18n } = useTranslation();
  const tabBarHeight = useBottomTabBarHeight();
  const currentRoundIndex = leagueInfo.leagueInfo.rounds.findIndex(round => new Date() > new Date(round.startingDate) && !round.finished);
  const [showRoundIndex, setShowRoundIndex] = React.useState(currentRoundIndex === -1 ? 0 : currentRoundIndex);

  const incrementRoundIndex = () => {
    setShowRoundIndex(prevState => {
      if (prevState < leagueInfo.leagueInfo.rounds.length - 1) {
        return prevState + 1;
      }
      return prevState;
    });
  };

  const decrementRoundIndex = () => {
    setShowRoundIndex(prevState => {
      if (prevState > 0) {
        return prevState - 1;
      }
      return prevState;
    });
  };

  const MatchComponent: FC<{ match: Match }> = ({ match }) => (
    <ThemeView style={styles.match}>
      <Image source={{ uri: match.teams[0].team.crest }} style={styles.teamCrest} />
      {match.finished ? (
        <ThemeText style={styles.matchResult}>{match.teams[0].finalResult} · {match.teams[1].finalResult}</ThemeText>
      ) : (
        <ThemeText style={styles.matchDate}>{format(new Date(match.startDate), 'dd/MM HH:mm')}</ThemeText>
      )}
      <Image source={{ uri: match.teams[1].team.crest }} style={styles.teamCrest} />
    </ThemeView>
  );

  const IconButton = styled.TouchableOpacity<{disabled: boolean}>`
      opacity: ${props => props.disabled ? '0.5' : '1'};
      border: 1px solid #C7C8CA;
      width: 30px;
      height: 30px;
      justify-content: center;
      align-items: center;
      border-radius: 50px;
    `;

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
    <View style={{ marginTop: tabBarHeight, flex: 1 }}>
      <View style={{ padding: 10, paddingTop: 20, flex: 1, justifyContent: "space-between" }}>
        {leagueInfo.leagueInfo.rounds.map((round, i) => (
          showRoundIndex === i && (
            <View key={i}>
              <View style={styles.roundHeader}>
                <IconButton activeOpacity={.5} disabled={i === 0} onPress={() => decrementRoundIndex()}>
                  <FontAwesomeIcon icon={faChevronLeft} color={colors.text} size={16} />
                </IconButton>
                <ThemeText style={{fontSize: 17}}>{CommonUtils.getRoundName(round, i18n.options.lng)}</ThemeText>
                <IconButton activeOpacity={.5} disabled={i === leagueInfo.leagueInfo.rounds.length - 1}
                                  onPress={() => incrementRoundIndex()}>
                  <FontAwesomeIcon icon={faChevronRight} color={colors.text} size={16} />
                </IconButton>
              </View>
              <View style={styles.matchesContainer}>
                {round.matches.map((match, j) => <MatchComponent match={match} key={j} />)}
              </View>
            </View>
          )
        ))}
        <View>
          <TextContainer>
            <TouchableOpacity activeOpacity={.5}>
              <FontAwesomeIcon icon={faPlusCircle} color={"#96A6B6"} style={{ marginRight: 10 }} size={35} />
            </TouchableOpacity>
            <View style={{ flexDirection: "column" }}>
              <ThemeText style={{fontSize: 17}}>{t("LEAGUE.INVITE_FRIENDS")}</ThemeText>
              <ThemeText
                style={{ fontSize: 13}}>{t("LEAGUE.INVITATION_CODE", { code: leagueInfo.groupInfo.invitationCode })}</ThemeText>
            </View>
          </TextContainer>
          <TextContainer>
            <Text style={{ color: "#4544CB", fontSize: 15 }}>{t("LEAGUE.REMOVE_ADS")}</Text>
          </TextContainer>
          <TextContainer>
            <Text style={{ color: "#BE2560", fontSize: 15 }}>{t("LEAGUE.LEAVE_GROUP")}</Text>
          </TextContainer>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  roundHeader: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center"
  },
  matchesContainer: {
    paddingTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between"
  },
  match: {
    width: "49%",
    marginBottom: 10,
    height: 45,
    borderRadius: 50,
    paddingVertical: 5,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  teamCrest: {
    height: 20,
    width: 20,
    resizeMode: "stretch"
  },
  matchResult: {
    fontSize: 12
  },
  matchDate: {
    fontSize: 10
  },
});

export default TabMoreScreen;
