import React, {FC, useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RefreshControl, ScrollView, Text, View} from 'react-native';
import {LeagueHomeStackParamList} from './TabLeagueHomeScreen';
import {LeagueInfo, Round} from '../../../../interfaces/league.interface';
import league from '../../../../api/league';
import {showApiErrorToast} from '../../../../actions/utils/showApiErrorToast';
import {useDispatch} from 'react-redux';
import NextRoundItem from '../../../common/NextRoundItem';
import {EventType, RoundLeagueEvent, UserLeagueEvent} from '../../../../interfaces/event.interface';
import UserEvent from '../../../common/UserEvent';
import RoundEvent from '../../../common/RoundEvent';

type ScreenNavigationProps = StackNavigationProp<LeagueHomeStackParamList, "LeagueHome">;
type ScreenRouteProp = RouteProp<LeagueHomeStackParamList, "LeagueHome">;

interface Props {
    navigation: ScreenNavigationProps;
    route: ScreenRouteProp;
    leagueInfo: LeagueInfo;
}

const LeagueHomeScreen: FC<Props> = ({route, navigation, leagueInfo}) => {

    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);

    const refreshLeagueInfo = async () => {
        setRefreshing(true);
        const res = await league.getGroupLeague(leagueInfo.groupInfo.id, leagueInfo.leagueInfo.id);
        if (!res.IsError) {
            leagueInfo.setState(res.Result);
        } else {
            dispatch(showApiErrorToast(res));
        }
        setRefreshing(false)
    }

    const updateNextRound = (round: Round) => {
        leagueInfo.updateNextRound(round);
    }

    const onClick = (round: Round) => {
        navigation.navigate('RoundDetail', {round, onSubmit});
    }

    const getRoundDetail = async (roundId: number, userId: number) => {
        const res = await league.getRoundDetail(roundId, userId);
        if (!res.IsError) {
            navigation.navigate('RoundDetail', {round: res.Result, onSubmit: null});
        } else {
            dispatch(showApiErrorToast(res));
        }
    }

    const onSubmit = (round: Round) => {
        updateNextRound(round);
    }

    return (
        <ScrollView style={{padding: 10}}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => refreshLeagueInfo()}
                        />
                    }>
            {leagueInfo.homeInfo.nextRound &&
                <>
                    <NextRoundItem round={leagueInfo.homeInfo.nextRound} onClick={onClick}
                                   onSubmit={onSubmit} showLeagueIcon={false}/>
                </>
            }
            <View>
                {leagueInfo.homeInfo.events.map((event, i) => (
                    <View key={i}>
                        {event.type === EventType.UserEvent && <UserEvent event={event as UserLeagueEvent}/>}
                        {event.type === EventType.RoundEvent && <RoundEvent event={event as RoundLeagueEvent} leagueInfo={leagueInfo} onRowClick={getRoundDetail} showLeagueIcon={false}/>}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};


export default LeagueHomeScreen;
