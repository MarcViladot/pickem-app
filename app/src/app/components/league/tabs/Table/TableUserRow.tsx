import React, {FC, useMemo} from 'react';
import {User, UserGroup} from '../../../../interfaces/user.interface';
import UserImage from '../../../common/UserImage';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {ThemeText} from '../../../common/ThemeText';
import {Use} from 'react-native-svg/lib/typescript';

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

export const TableUserRow: FC<RowProps> = ({
                                               userId,
                                               points,
                                               position,
                                               isCurrentUser,
                                               userGroups,
                                               clickable,
                                               onRowClick,
                                               roundId
                                           }) => {
    return (
        <TouchableOpacity activeOpacity={.6} disabled={!clickable} style={styles.userRow}
                          onPress={() => onRowClick(roundId, userId)}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <Text style={styles.tableIndex}>{position}</Text>
                <UserInfo userId={userId} currentUser={isCurrentUser} userGroups={userGroups}/>
            </View>
            <ThemeText style={{fontSize: 14}}>{points} <Text
                style={{fontSize: 10, color: "#AAAEBB"}}>PTS</Text></ThemeText>
        </TouchableOpacity>
    );
}

interface UserInfoProps {
    userId: number;
    currentUser: boolean;
    userGroups: UserGroup[];
}

export const UserInfo: FC<UserInfoProps> = ({userId, currentUser, userGroups}) => {
    const {colors} = useTheme();
    const user: User = useMemo(() => userGroups.find((userGroup: UserGroup) => userGroup.userId === userId).user, [userGroups, userId]);
    return (
        <>
            <UserImage user={user} styles={styles.userPhoto}/>
            <Text style={{color: currentUser ? "#53BB8B" : colors.text, fontSize: 15}}>{user.name}</Text>
        </>
    );
};

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
