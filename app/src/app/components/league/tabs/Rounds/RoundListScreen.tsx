import React, {FC, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View, Animated} from "react-native";
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faBroadcastTower, faFlagCheckered, faHourglassHalf} from '@fortawesome/free-solid-svg-icons';
import {faEdit} from '@fortawesome/free-regular-svg-icons';
import {LeagueInfo, Round} from '../../../../interfaces/league.interface';
import {StackNavigationProp} from '@react-navigation/stack';
import {TabsStackParamList} from '../../GroupLeagueScreen';
import {RouteProp, useTheme} from '@react-navigation/native';
import {RoundsStackParamList} from './TabRoundsScreen';
import {useDispatch, useSelector} from 'react-redux';
import {showApiErrorToast} from '../../../../actions/utils/showApiErrorToast';
import league from '../../../../api/league';
import {RootState} from '../../../../reducers';
import {ThemeText} from '../../../common/ThemeText';
import {useTranslation} from 'react-i18next';
import {CommonUtils} from '../../../../utils/CommonUtils';

interface RoundProps {
    round: Round;
}

type ScreenNavigationProps = StackNavigationProp<RoundsStackParamList, "RoundList">;
type ScreenRouteProp = RouteProp<RoundsStackParamList, "RoundList">;

interface Props {
    navigation: ScreenNavigationProps;
    route: ScreenRouteProp;
    leagueInfo: LeagueInfo;
}

const RoundListScreen: FC<Props> = ({navigation, route, leagueInfo}) => {

    const {t, i18n} = useTranslation();
    const {colors} = useTheme();
    const dispatch = useDispatch();
    const currentUser = useSelector((state: RootState) => state.user.currentUser);

    const RoundItem: FC<RoundProps> = ({round}) => {

        const isPending = round.matches.some(match => match.predictions.length === 0);
        const isLive = !round.finished && new Date() > new Date(round.startingDate);

        const [fadeAnim] = useState(new Animated.Value(0.3));

        React.useEffect(() => {
            if (isLive) {
                runAnimation();
            }
        }, []);

        const runAnimation = () => {
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    useNativeDriver: true,
                    toValue: 1.5,
                    duration: 700,
                }),
                Animated.timing(fadeAnim, {
                    useNativeDriver: true,
                    toValue: 0.3,
                    duration: 700
                })
            ]).start(() => {
                runAnimation();
            });
        };

        const getRoundDetail = async (id: number) => {
            const res = await league.getRoundDetail(id, currentUser.id);
            if (!res.IsError) {
                navigation.navigate('RoundDetail', {round: res.Result});
            } else {
                dispatch(showApiErrorToast(res));
            }
        }

        return (
            <TouchableOpacity activeOpacity={.7} style={[styles.round, {backgroundColor: colors.card}]} onPress={() => getRoundDetail(round.id)}>
                <ThemeText style={styles.roundName}>{CommonUtils.getRoundName(round, i18n.options.lng)}</ThemeText>
                <Animated.View style={{opacity: isLive ? fadeAnim : 1}}>
                    <FontAwesomeIcon
                        icon={isLive ? faBroadcastTower : round.finished ? faFlagCheckered : isPending ? faEdit : faHourglassHalf}
                        size={20}
                        color={isPending ? round.finished ? '#a1a1a1' : '#ffa807' : '#38b174'}/>
                </Animated.View>
            </TouchableOpacity>
        )
    }

    return (
        <ScrollView style={styles.container}>
            {leagueInfo.leagueInfo.rounds.map((round, i) => <RoundItem round={round} key={i}/>)}
        </ScrollView>
    );

}
const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    round: {
        padding: 15,
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: 10,
        borderRadius: 10
    },
    roundName: {
        fontSize: 20,
    }
})

export default RoundListScreen;
