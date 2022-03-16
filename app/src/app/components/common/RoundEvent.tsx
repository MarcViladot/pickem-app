import React, {FC, useMemo} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {RoundLeagueEvent, UserLeagueEvent} from '../../interfaces/event.interface';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {CommonUtils} from '../../utils/CommonUtils';
import {format} from 'date-fns';
import {LeagueInfo} from '../../interfaces/league.interface';
import {TableUserRow} from '../league/tabs/Table/TableUserRow';
import {useSelector} from 'react-redux';
import {RootState} from '../../reducers';

interface Props {
    event: RoundLeagueEvent;
    leagueInfo: LeagueInfo;
    onRowClick: (roundId: number, userId: number) => void;
    showLeagueIcon: boolean;
}

const RoundEvent: FC<Props> = ({event, leagueInfo, onRowClick, showLeagueIcon}) => {
    const {t, i18n} = useTranslation();
    const {colors} = useTheme();
    const formattedDate = useMemo(() => format(new Date(event.date), 'dd/MM HH:mm'), [event.date]);
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    return (
        <View style={[styles.container, {backgroundColor: colors.card}]}>
            <View style={styles.roundHeader}>
                <View>
                    <Text>{t('EVENTS.ROUND_FINISH')} {CommonUtils.getRoundName(event.event, i18n.options.lng)}</Text>
                    <Text style={{marginTop: 3, color: 'gray', fontSize: 12}}>{formattedDate}</Text>
                </View>
                {showLeagueIcon && (
                    <Image source={{uri: leagueInfo.leagueInfo.logo}} style={{width: 32, height: 32}} />
                )}
            </View>
            <View style={styles.divider}/>
            <View>
                {event.event.results.map((result, i) => <TableUserRow points={result.points}
                                                                      userId={result.userId} position={i + 1}
                                                                      isCurrentUser={currentUser.id === result.userId}
                                                                      userGroups={leagueInfo.groupInfo.userGroups}
                                                                      roundId={result.roundId}
                                                                      clickable={true} onRowClick={onRowClick} key={i} />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        paddingBottom: 0,
        borderRadius: 10,
        marginBottom: 15
    },
    roundHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 7
    },
    divider: {
        borderBottomWidth: .5,
        borderColor: '#e1e1e1',
        marginHorizontal: -10,
        marginBottom: 10
    }
})

export default RoundEvent;
