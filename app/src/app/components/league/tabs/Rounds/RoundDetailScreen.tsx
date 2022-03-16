import React, {FC, useMemo} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RoundsStackParamList} from './TabRoundsScreen';
import {RouteProp} from '@react-navigation/native';
import RoundForm from '../../../common/RoundForm';
import {LeagueHomeStackParamList} from '../Home/TabLeagueHomeScreen';
import {Round} from '../../../../interfaces/league.interface';

type ScreenNavigationProps = StackNavigationProp<RoundsStackParamList, "RoundDetail"> | StackNavigationProp<LeagueHomeStackParamList, "RoundDetail">;
type ScreenRouteProp = RouteProp<RoundsStackParamList, "RoundDetail"> | RouteProp<LeagueHomeStackParamList, "RoundDetail">;

interface Props {
    navigation: ScreenNavigationProps;
    route: ScreenRouteProp;
}

const RoundDetailScreen: FC<Props> = ({navigation, route}) => {

    const {round, onSubmit} = route.params;
    const isPending = useMemo(() => round.matches.some(match => match.predictions.length === 0), [round]);
    const hasStarted = useMemo(() => new Date() > new Date(round.startingDate), [round]);
    const canEdit = useMemo(() => !isPending && !round.finished && !hasStarted, [isPending, round, hasStarted]);
    const canSubmit = useMemo(() => !hasStarted && isPending && !round.finished, [isPending, round, hasStarted]);

    const goBack = (data: Round) => {
        if (typeof onSubmit === 'function') {
            onSubmit(data);
        }
        navigation.goBack();
    };

    return (
        <ScrollView>
            <RoundForm onlyView={false} round={round} canEdit={canEdit} canSubmit={canSubmit} hasStarted={hasStarted} onSubmit={goBack} />
        </ScrollView>
    );
};

export default RoundDetailScreen;
