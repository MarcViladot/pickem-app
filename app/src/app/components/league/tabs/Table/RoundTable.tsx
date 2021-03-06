import React, {FC, useEffect} from 'react';
import {GroupedTableByUser, LeagueInfo} from '../../../../interfaces/league.interface';
import {StyleSheet, View} from 'react-native';
import DropDownPicker, {ItemType} from "react-native-dropdown-picker";
import {User} from '../../../../interfaces/user.interface';
import {UserRow} from './UserRow';
import {CommonUtils} from '../../../../utils/CommonUtils';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';

interface Props {
    leagueInfo: LeagueInfo;
    currentUser: User;
    onRowClick: (roundId: number, userId: number) => void;
}

const RoundTable: FC<Props> = ({leagueInfo, currentUser, onRowClick}) => {

    const {t, i18n} = useTranslation();
    const {colors} = useTheme();
    const currentRoundIndex = leagueInfo.leagueInfo.rounds.findIndex(round => new Date() > new Date(round.startingDate) && !round.finished);
    const [open, setOpen] = React.useState(false);
    const [selectedRound, setSelectedRound] = React.useState(leagueInfo.leagueInfo.rounds[currentRoundIndex === -1 ? 0 : currentRoundIndex].id);
    const [classification, setClassification] = React.useState<any>();
    const [clickable, setClickable] = React.useState(false);

    const items: ItemType[] = leagueInfo.leagueInfo.rounds.filter(round => new Date() > new Date(round.startingDate) || round.finished).map(round => {
        return {
            label: CommonUtils.getRoundName(round, i18n.options.lng),
            value: round.id
        };
    });

    const getTableFromRoundId = (roundId: number) => {
        const classification = leagueInfo.table.byRounds ? leagueInfo.table.byRounds[`${roundId}`] : null;
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
        const round = leagueInfo.leagueInfo.rounds.find(round => round.id === selectedRound);
        const hasStarted = round && new Date() > new Date(round.startingDate);
        setClickable(hasStarted);
        getTableFromRoundId(selectedRound);
    }, [selectedRound]);

    return (
        <>
            <DropDownPicker
                open={open}
                value={selectedRound}
                items={items}
                disabled={!items.length}
                placeholder={items.length ? t('TABLE.SELECT_ROUND') : t('TABLE.NO_ROUNDS')}
                setOpen={setOpen}
                setValue={setSelectedRound}
                style={styles.dropDown}
                textStyle={styles.dropDownText}
                dropDownContainerStyle={{
                    backgroundColor: "#F3F4F9",
                    borderColor: "#a4a8b4"
                }}/>
            <View style={styles.table}>
                {classification ?
                    classification.map((roundResult, i) => <UserRow key={i} userId={roundResult.userId}
                                                                    points={roundResult.points}
                                                                    clickable={clickable}
                                                                    position={i + 1}
                                                                    roundId={selectedRound}
                                                                    onRowClick={onRowClick}
                                                                    isCurrentUser={currentUser.id === roundResult.userId}
                                                                    userGroups={leagueInfo.groupInfo.userGroups}/>)
                    : <></>}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
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

export default RoundTable;
