import React, {FC, useCallback, useMemo} from 'react';
import {Round} from '../../interfaces/league.interface';
import {NavigationProp, useFocusEffect, useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../reducers';
import {intervalToDuration} from 'date-fns';
import league from '../../api/league';
import {showApiErrorToast} from '../../actions/utils/showApiErrorToast';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CommonUtils} from '../../utils/CommonUtils';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEdit} from '@fortawesome/free-regular-svg-icons';
import {faHourglassHalf} from '@fortawesome/free-solid-svg-icons';

interface NextRoundProps {
    round: Round;
    onClick: (round: Round) => void;
    onSubmit: (round: Round) => void;
    showLeagueIcon: boolean;
}

const NextRoundItem: FC<NextRoundProps> = ({round, onClick, onSubmit, showLeagueIcon}) => {

    const {colors} = useTheme();
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const isPending = useMemo(() => round.matches.some(match => match.predictions.length === 0), [round]);
    const [counter, setCounter] = React.useState<number>(null);
    const timeUntilDate = useMemo(() => {
        const duration = intervalToDuration({start: 0, end: counter * 1000});
        return `${duration.days}d ${duration.hours}h ${duration.minutes}m ${duration.seconds}s`
    }, [counter]);

    useFocusEffect(useCallback(() => {
        const newCounter = Math.floor((new Date(round.startingDate).getTime() - new Date().getTime()) / 1000);
        setCounter(newCounter);
        return () => {
            setCounter(null);
        };
    }, []));

    useFocusEffect(useCallback(() => {
        const timer = (counter && counter > 0) && setTimeout(() => {
            setCounter(prevCounter => prevCounter ? prevCounter - 1 : null);
        }, 1000);
        return () => clearTimeout(timer);
    }, [counter]));

    const getRoundDetail = async (id: number) => {
        const res = await league.getRoundDetail(id, currentUser.id);
        if (!res.IsError) {
            onClick(res.Result);
        } else {
            dispatch(showApiErrorToast(res));
        }
    }

    return (
        <TouchableOpacity activeOpacity={.7} style={[styles.round, {backgroundColor: colors.card}]}
                          onPress={() => getRoundDetail(round.id)}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {showLeagueIcon && round.league &&
                    <Image source={{uri: round.league.logo}} style={styles.leagueLogo}/>
                }
                <View>
                    <Text style={styles.roundName}>{CommonUtils.getRoundName(round, i18n.options.lng)}</Text>
                    <Text style={styles.roundTime}>{t('LEAGUE.STARTS_IN')} {timeUntilDate}</Text>
                </View>
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
        paddingHorizontal: 10,
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
    },
    leagueLogo: {
        height: 40,
        width: 40,
        marginRight: 10
    }
})

export default NextRoundItem;
