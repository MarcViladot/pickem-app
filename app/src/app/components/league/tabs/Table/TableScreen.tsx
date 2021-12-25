import React, {FC, useEffect} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useBottomTabBarHeight} from "@react-navigation/bottom-tabs";
import ButtonGroup, {IGroupButton} from "../../../common/ButtonGroup";
import {StackNavigationProp} from "@react-navigation/stack";
import {RouteProp} from "@react-navigation/native";
import UserImage from "../../../common/UserImage";
import {User, UserGroup} from "../../../../interfaces/user.interface";
import {useSelector} from "react-redux";
import {RootState} from "../../../../reducers";
import {LeagueInfo, Round} from "../../../../interfaces/league.interface";
import RoundTable from './RoundTable';
import {TableStackParamList} from './TabTableScreen';
import league from '../../../../api/league';
import {UserRow} from './UserRow';

type ScreenNavigationProps = StackNavigationProp<TableStackParamList, "Table">;
type ScreenRouteProp = RouteProp<TableStackParamList, "Table">;

interface Props {
    navigation: ScreenNavigationProps;
    route: ScreenRouteProp;
    leagueInfo: LeagueInfo;
}

const TableScreen: FC<Props> = ({navigation, route, leagueInfo}) => {

    const tabBarHeight = useBottomTabBarHeight();
    const [showGlobal, setShowGlobal] = React.useState(true);
    const currentUser = useSelector((state: RootState) => state.user.currentUser);

    const buttonGroup: IGroupButton[] = [
        {value: true, viewValue: 'TABLE.GLOBAL'},
        {value: false, viewValue: 'TABLE.ROUND'}
    ];

    const getRoundDetail = async (roundId: number, userId: number) => {
        const res = await league.getRoundDetail(roundId, userId)
        if (!res.IsError) {
            navigation.navigate("TableRoundDetail", {round: res.Result});
        }
    }

    return (
        <View style={{marginTop: tabBarHeight, height: "100%"}}>
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


const styles = StyleSheet.create({
    tableContainer: {
        padding: 15,
        paddingTop: 20
    },
    table: {
        marginTop: 20
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
