import React, { FC } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { TabsStackParamList } from "../GroupLeagueScreen";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft, faChevronRight, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { Match } from "../../../interfaces/league.interface";
import { useTranslation } from "react-i18next";
import {format} from 'date-fns';

type ScreenNavigationProps = StackNavigationProp<TabsStackParamList, "TabMoreScreen">;
type ScreenRouteProp = RouteProp<TabsStackParamList, "TabMoreScreen">;

interface Props {
  navigation: ScreenNavigationProps;
  route: ScreenRouteProp;
}

const TabMoreScreen: FC<Props> = ({ navigation, route }) => {

  const { t } = useTranslation();
  const tabBarHeight = useBottomTabBarHeight();
  const { leagueInfo } = route.params;
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
    <View style={styles.match}>
      <Image source={{ uri: match.teams[0].team.crest }} style={styles.teamCrest} />
      {match.finished ? (
        <Text style={styles.matchResult}>{match.teams[0].finalResult} · {match.teams[1].finalResult}</Text>
      ) : (
        <Text style={styles.matchDate}>{format(new Date(match.startDate), 'dd/MM hh:mm')}</Text>
      )}
      <Image source={{ uri: match.teams[0].team.crest }} style={styles.teamCrest} />
    </View>
  );

  return (
    <View style={{ marginTop: tabBarHeight, backgroundColor: "#F3F4F9", flex: 1 }}>
      <View style={{ padding: 10, paddingTop: 20, flex: 1, justifyContent: "space-between" }}>
        {leagueInfo.leagueInfo.rounds.map((round, i) => (
          showRoundIndex === i && (
            <View key={i}>
              <View style={styles.roundHeader}>
                <TouchableOpacity activeOpacity={.5} disabled={i === 0} onPress={() => decrementRoundIndex()}
                                  style={styles.chevronButton}>
                  <FontAwesomeIcon icon={faChevronLeft} color={"#252525"} size={16} />
                </TouchableOpacity>
                <Text style={{fontSize: 17}}>{round.name}</Text>
                <TouchableOpacity activeOpacity={.5} disabled={i === leagueInfo.leagueInfo.rounds.length - 1}
                                  onPress={() => incrementRoundIndex()} style={styles.chevronButton}>
                  <FontAwesomeIcon icon={faChevronRight} color={"#252525"} size={16} />
                </TouchableOpacity>
              </View>
              <View style={styles.matchesContainer}>
                {round.matches.map((match, j) => <MatchComponent match={match} key={j} />)}
              </View>
            </View>
          )
        ))}
        <View>
          <View style={styles.textContainer}>
            <TouchableOpacity activeOpacity={.5}>
              <FontAwesomeIcon icon={faPlusCircle} color={"#96A6B6"} style={{ marginRight: 10 }} size={35} />
            </TouchableOpacity>
            <View style={{ flexDirection: "column" }}>
              <Text style={{fontSize: 17}}>{t("LEAGUE.INVITE_FRIENDS")}</Text>
              <Text
                style={{ fontSize: 13 }}>{t("LEAGUE.INVITATION_CODE", { code: leagueInfo.groupInfo.invitationCode })}</Text>
            </View>
          </View>
          <View style={styles.textContainer}>
            <Text style={{ color: "#4544CB", fontSize: 15 }}>{t("LEAGUE.REMOVE_ADS")}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={{ color: "#BE2560", fontSize: 15 }}>{t("LEAGUE.LEAVE_GROUP")}</Text>
          </View>
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
  chevronButton: {
    borderWidth: 1,
    borderColor: "#C7C8CA",
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50
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
    backgroundColor: "#FFF",
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
  textContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#FFF",
    width: "100%",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center"
  }
});

export default TabMoreScreen;
