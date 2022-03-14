import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp, useFocusEffect, useTheme} from '@react-navigation/native';
import {ScrollView, View, Text, StyleSheet, TouchableOpacity, Animated, RefreshControl} from 'react-native';
import {HomeStackParamList} from './TabHomeScreen';
import {ILeagueInfo, LeagueInfo, Round} from '../../../../interfaces/league.interface';
import {useTranslation} from 'react-i18next';
import {  intervalToDuration } from 'date-fns'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faBroadcastTower, faFlagCheckered, faHourglassHalf} from '@fortawesome/free-solid-svg-icons';
import {faEdit} from '@fortawesome/free-regular-svg-icons';
import league from '../../../../api/league';
import {showApiErrorToast} from '../../../../actions/utils/showApiErrorToast';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../../reducers';
import {CommonUtils} from '../../../../utils/CommonUtils';
import {ResponseApi} from '../../../../utils/IResponse';

type ScreenNavigationProps = StackNavigationProp<HomeStackParamList, "LeagueHome">;
type ScreenRouteProp = RouteProp<HomeStackParamList, "LeagueHome">;

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

    return (
        <ScrollView style={{padding: 10}}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => refreshLeagueInfo()}
                        />
                    }>
            {leagueInfo.homeInfo.nextRound &&
                <NextRoundItem round={leagueInfo.homeInfo.nextRound} navigation={navigation}
                               onSubmit={round => updateNextRound(round)}/>}
        </ScrollView>
    );
};

interface NextRoundProps {
    round: Round;
    navigation: ScreenNavigationProps;
    onSubmit: (round: Round) => void;
}

const NextRoundItem: FC<NextRoundProps> = ({round, navigation, onSubmit}) => {

    const { colors } = useTheme();
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const isPending = useMemo(() => round.matches.some(match => match.predictions.length === 0), [round]);
    const [counter, setCounter] = React.useState<number>(null);
    const timeUntilDate = useMemo(() => {
        const duration = intervalToDuration({ start: 0, end: counter * 1000 });
        return `${duration.days}d ${duration.hours}h ${duration.minutes}m ${duration.seconds}s`
    }, [counter]);

    useFocusEffect(useCallback(() => {
        const newCounter = Math.floor((new Date(round.startingDate).getTime() - new Date().getTime())  / 1000);
        setCounter(newCounter);
        return () => {
            setCounter(null);
        };
    }, []));

    useFocusEffect(useCallback(() => {
        if (counter && counter > 0) {
            setTimeout(() => setCounter(prevCounter => prevCounter ? prevCounter - 1 : null), 1000);
        }
        return () => null;
    }, [counter]));

    const getRoundDetail = async (id: number) => {
        const res = await league.getRoundDetail(id, currentUser.id);
        if (!res.IsError) {
            navigation.navigate('RoundDetail', {round: res.Result, onSubmit});
        } else {
            dispatch(showApiErrorToast(res));
        }
    }

    return (
        <TouchableOpacity activeOpacity={.7} style={[styles.round, {backgroundColor: colors.card}]} onPress={() => getRoundDetail(round.id)}>
            <View>
                <Text style={styles.roundName}>{CommonUtils.getRoundName(round, i18n.options.lng)}</Text>
                <Text style={styles.roundTime}>{t('LEAGUE.STARTS_IN')} {timeUntilDate}</Text>
            </View>
            <View>
                <FontAwesomeIcon
                    icon={isPending ? faEdit : faHourglassHalf}
                    size={20}
                    color={isPending ? round.finished ? '#a1a1a1' : '#ffa807' : '#38b174'}/>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    round: {
        padding: 15,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 10
    },
    roundName: {
        fontSize: 18,
        marginBottom: 5
    },
    roundTime: {
        fontSize: 13,
        color: '#828282'
    }
})


export default LeagueHomeScreen;
