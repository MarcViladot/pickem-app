import React, {FC, useEffect} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useBottomTabBarHeight} from "@react-navigation/bottom-tabs";
import ButtonGroup, {IGroupButton} from "../../../common/ButtonGroup";
import {createStackNavigator, StackNavigationProp} from "@react-navigation/stack";
import {TabsStackParamList} from "../../GroupLeagueScreen";
import {RouteProp} from "@react-navigation/native";
import UserImage from "../../../common/UserImage";
import {User, UserGroup} from "../../../../interfaces/user.interface";
import {useSelector} from "react-redux";
import {RootState} from "../../../../reducers";
import DropDownPicker, {ItemType} from "react-native-dropdown-picker";
import {LeagueInfo, Round} from "../../../../interfaces/league.interface";
import user from "../../../../reducers/user";
import RoundListScreen from '../Rounds/RoundListScreen';
import RoundDetailScreen from '../Rounds/RoundDetailScreen';
import RoundTable from './RoundTable';
import {TableStackParamList} from './TabTableScreen';
import league from '../../../../api/league';

type ScreenNavigationProps = StackNavigationProp<TableStackParamList, "Table">;
type ScreenRouteProp = RouteProp<TableStackParamList, "Table">;

interface Props {
    navigation: ScreenNavigationProps;
    route: ScreenRouteProp;
}

interface RowProps {
    points: number;
    userId: number;
    position: number;
    isCurrentUser: boolean;
    userGroups: UserGroup[];
    clickable: boolean;
    onRowClick?: (roundId: number, userId: number) => void;
    roundId?: number
}

const TableScreen: FC<Props> = ({navigation, route}) => {

    const tabBarHeight = useBottomTabBarHeight();
    const [showGlobal, setShowGlobal] = React.useState(true);
    const {leagueInfo} = route.params;
    const currentUser = useSelector((state: RootState) => state.user.currentUser);

    const buttonGroup: IGroupButton[] = [
        {value: true, viewValue: "Global"},
        {value: false, viewValue: "Round"}
    ];

    const getRoundDetail = async (roundId: number, userId: number) => {
        const res = await league.getRoundDetail(roundId, userId)
        if (!res.IsError) {
            navigation.navigate("TableRoundDetail", {round: res.Result});
        }
    }

    return (
        <View style={{marginTop: tabBarHeight, backgroundColor: "#F3F4F9", height: "100%"}}>
            <View style={styles.tableContainer}>
                <ButtonGroup initialValue={showGlobal} arrayOptions={buttonGroup}
                             onSelect={value => setShowGlobal(value)}/>
                {showGlobal ?
                    <View style={styles.table}>
                        {leagueInfo.table.global.map((user, i) => <UserRow key={i} userId={user.userId}
                                                                           points={user.totalPoints}
                                                                           clickable={false}
                                                                           position={i + 1}
                                                                           isCurrentUser={user.userId === currentUser.id}
                                                                           userGroups={leagueInfo.groupInfo.userGroups}/>)}
                    </View>
                    :
                    <View style={styles.table}>
                        <RoundTable currentUser={currentUser} leagueInfo={leagueInfo} onRowClick={getRoundDetail}/>
                    </View>
                }

            </View>
        </View>
    );
};

export const UserRow: FC<RowProps> = ({
                                          userId,
                                          points,
                                          position,
                                          isCurrentUser,
                                          userGroups,
                                          clickable,
                                          onRowClick,
                                          roundId
                                      }) => {

    const UserInfo: FC<{ userId: number, currentUser: boolean }> = ({userId}) => {
        const user: User = userGroups.find((userGroup: UserGroup) => userGroup.userId === userId).user;
        return (
            <>
                <UserImage user={user} styles={styles.userPhoto}/>
                <Text style={{color: isCurrentUser ? "#53BB8B" : "#000", fontSize: 15}}>{user.name}</Text>
            </>
        );
    };

    return (
        <TouchableOpacity activeOpacity={.6} disabled={!clickable} style={styles.userRow} onPress={() => onRowClick(roundId, userId)}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <Text style={styles.tableIndex}>{position}</Text>
                <UserInfo userId={userId} currentUser={isCurrentUser}/>
            </View>
            <Text style={{fontSize: 14}}>{points} <Text style={{fontSize: 10, color: "#AAAEBB"}}>PTS</Text></Text>
        </TouchableOpacity>
    );
}

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

export default TableScreen;
