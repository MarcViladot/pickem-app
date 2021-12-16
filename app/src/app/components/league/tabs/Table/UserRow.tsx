import React, {FC} from 'react';
import {User, UserGroup} from '../../../../interfaces/user.interface';
import UserImage from '../../../common/UserImage';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

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
        <TouchableOpacity activeOpacity={.6} disabled={!clickable} style={styles.userRow}
                          onPress={() => onRowClick(roundId, userId)}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <Text style={styles.tableIndex}>{position}</Text>
                <UserInfo userId={userId} currentUser={isCurrentUser}/>
            </View>
            <Text style={{fontSize: 14}}>{points} <Text style={{fontSize: 10, color: "#AAAEBB"}}>PTS</Text></Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
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
    }
})
