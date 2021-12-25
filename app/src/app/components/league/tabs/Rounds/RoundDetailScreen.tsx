import React, {FC} from 'react';
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
    const isPending = round.matches.some(match => match.predictions.length === 0);
    const hasStarted = new Date() > new Date(round.startingDate)
    const canEdit = !isPending && !round.finished && !hasStarted;
    const canSubmit = !hasStarted && isPending && !round.finished;

    return (
        <ScrollView>
            <RoundForm onlyView={false} round={round} canEdit={canEdit} canSubmit={canSubmit} hasStarted={hasStarted} onSubmit={() => navigation.goBack()} />
        </ScrollView>
    );
};

export default RoundDetailScreen;
