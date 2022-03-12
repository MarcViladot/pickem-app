import React, {FC, useMemo} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RoundsStackParamList} from './TabRoundsScreen';
import {RouteProp} from '@react-navigation/native';
import RoundForm from '../../../common/RoundForm';

type ScreenNavigationProps = StackNavigationProp<RoundsStackParamList, "RoundDetail">;
type ScreenRouteProp = RouteProp<RoundsStackParamList, "RoundDetail">;

interface Props {
    navigation: ScreenNavigationProps;
    route: ScreenRouteProp;
}

const RoundDetailScreen: FC<Props> = ({navigation, route}) => {

    const {round} = route.params;
    const isPending = useMemo(() => round.matches.some(match => match.predictions.length === 0), [round]);
    const hasStarted = useMemo(() => new Date() > new Date(round.startingDate), [round]);
    const canEdit = useMemo(() => !isPending && !round.finished && !hasStarted, [isPending, round, hasStarted]);
    const canSubmit = useMemo(() => !hasStarted && isPending && !round.finished, [isPending, round, hasStarted]);

    return (
        <ScrollView>
            <RoundForm onlyView={false} round={round} canEdit={canEdit} canSubmit={canSubmit} hasStarted={hasStarted} onSubmit={() => navigation.goBack()} />
        </ScrollView>
    );
};

export default RoundDetailScreen;
