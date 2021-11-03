import React, { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import UserImage from "../common/UserImage";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { DrawerHeaderProps } from "@react-navigation/drawer/lib/typescript/src/types";
import { faDotCircle } from "@fortawesome/free-regular-svg-icons";
import { LeagueInfo } from "../../interfaces/league.interface";

const LeagueHeader: FC<DrawerHeaderProps> = ({ scene }) => {

  const user = useSelector((state: RootState) => state.user.currentUser);

  const { leagueInfo } = scene.route.params as { leagueInfo: LeagueInfo };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity activeOpacity={.5} onPress={() => scene.descriptor.navigation.toggleDrawer()}>
          <UserImage user={user} styles={styles.userImage} />
        </TouchableOpacity>
        <Text style={styles.leagueName}>{leagueInfo.leagueInfo.name}</Text>
      </View>
      <View>
        <View style={styles.chip}>
          <FontAwesomeIcon icon={faDotCircle} color={"#ffa600"} size={13} />
          <Text style={styles.chipText}>{leagueInfo.totalPoints}</Text>
        </View>
      </View>
    </View>
  );
};

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
    width: 30,
    height: 30,
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
    fontSize: 15,
    color: "#000",
    marginLeft: 12
  }
});

export default LeagueHeader;
