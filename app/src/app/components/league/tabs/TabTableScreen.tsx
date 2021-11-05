import React, { FC, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import ButtonGroup, { IGroupButton } from "../../common/ButtonGroup";
import { StackNavigationProp } from "@react-navigation/stack";
import { TabsStackParamList } from "../GroupLeagueScreen";
import { RouteProp } from "@react-navigation/native";
import UserImage from "../../common/UserImage";
import { User, UserGroup } from "../../../interfaces/user.interface";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers";
import DropDownPicker, { ItemType } from "react-native-dropdown-picker";
import { Round } from "../../../interfaces/league.interface";
import user from "../../../reducers/user";

type ScreenNavigationProps = StackNavigationProp<TabsStackParamList, "TabTableScreen">;
type ScreenRouteProp = RouteProp<TabsStackParamList, "TabTableScreen">;

interface Props {
  navigation: ScreenNavigationProps;
  route: ScreenRouteProp;
}

interface RowProps {
  points: number;
  userId: number;
  position: number;
}

const TabTableScreen: FC<Props> = ({ navigation, route }) => {

  const tabBarHeight = useBottomTabBarHeight();
  const [showGlobal, setShowGlobal] = React.useState(true);
  const { leagueInfo } = route.params;
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const buttonGroup: IGroupButton[] = [
    { value: true, viewValue: "Global" },
    { value: false, viewValue: "Round" }
  ];

  const UserInfo: FC<{ userId: number }> = ({ userId }) => {
    const user: User = leagueInfo.groupInfo.userGroups.find((userGroup: UserGroup) => userGroup.userId === userId).user;
    return (
      <>
        <UserImage user={user} styles={styles.userPhoto} />
        <Text style={{ color: currentUser.id === userId ? "#53BB8B" : "#000", fontSize: 15 }}>{user.name}</Text>
      </>
    );
  };

  const UserRow: FC<RowProps> = ({ userId, points, position }) => {
    return (
      <View style={styles.userRow}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.tableIndex}>{position}</Text>
          <UserInfo userId={userId} />
        </View>
        <Text style={{fontSize: 14}}>{points} <Text style={{ fontSize: 10, color: "#AAAEBB" }}>PTS</Text></Text>
      </View>
    );
  };

  const RoundTable: FC = () => {

    const currentRoundIndex = leagueInfo.leagueInfo.rounds.findIndex(round => new Date() > new Date(round.startingDate) && !round.finished);
    const [open, setOpen] = React.useState(false);
    const [selectedRound, setSelectedRound] = React.useState(leagueInfo.leagueInfo.rounds[currentRoundIndex === -1 ? 0 : currentRoundIndex].id);
    const [classification, setClassification] = React.useState();

    const items: ItemType[] = leagueInfo.leagueInfo.rounds.filter(round => new Date() > new Date(round.startingDate) || round.finished).map(round => {
      return {
        label: round.name,
        value: round.id
      };
    });

    const getTableFromRoundId = (roundId: number) => {
      const classification = leagueInfo.table.byRounds[`${roundId}`];
      if (classification) {
        setClassification(classification);
      } else {

        const userList = leagueInfo.groupInfo.userGroups.map(userGroup => {
          return {
            userId: userGroup.userId,
            points: 0
          }
        })
        // @ts-ignore
        setClassification(userList);
      }
    }

    useEffect(() => {
      getTableFromRoundId(selectedRound);
    }, [selectedRound]);

    return (
      <>
        <DropDownPicker
          open={open}
          value={selectedRound}
          items={items}
          setOpen={setOpen}
          setValue={setSelectedRound}
          style={styles.dropDown}
          textStyle={styles.dropDownText}
          dropDownContainerStyle={{
            backgroundColor: "#F3F4F9",
            borderColor: "#a4a8b4"
          }} />
        <View style={styles.table}>
          {classification ?
            classification.map((roundResult, i) => <UserRow key={i} userId={roundResult.userId} points={roundResult.points}
                                                             position={i + 1} />)
          : <></>}
        </View>
      </>
    );
  };

  return (
    <View style={{ marginTop: tabBarHeight, backgroundColor: "#F3F4F9", height: "100%" }}>
      <View style={styles.tableContainer}>
        <ButtonGroup initialValue={showGlobal} arrayOptions={buttonGroup} onSelect={value => setShowGlobal(value)} />
        {showGlobal ?
          <View style={styles.table}>
            {leagueInfo.table.global.map((user, i) => <UserRow key={i} userId={user.userId} points={user.totalPoints}
                                                               position={i + 1} />)}
          </View>
          :
          <View style={styles.table}>
            <RoundTable />
          </View>
        }

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    padding: 15,
    paddingTop: 20
  },
  table: {
    marginTop: 20
  },
  userRow: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15
  },
  userPhoto: {
    width: 35,
    height: 35,
    borderRadius: 50,
    marginRight: 10
  },
  tableIndex: {
    width: 20,
    fontSize: 13,
    color: "#a4a8b4"
  },
  dropDown: {
    borderRadius: 50,
    borderColor: "#a4a8b4",
    backgroundColor: "transparent",
    paddingHorizontal: 20,
    height: 35
  },
  dropDownText: {
    fontSize: 14,
    color: "#a4a8b4"
  }
});

export default TabTableScreen;
