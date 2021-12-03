import React, {FC} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RoundsStackParamList} from './TabRoundsScreen';
import {RouteProp} from '@react-navigation/native';
import RoundForm from '../../RoundForm';

type ScreenNavigationProps = StackNavigationProp<RoundsStackParamList, "RoundDetail">;
type ScreenRouteProp = RouteProp<RoundsStackParamList, "RoundDetail">;

interface Props {
    navigation: ScreenNavigationProps;
    route: ScreenRouteProp;
}

const RoundDetailScreen: FC<Props> = ({navigation, route}) => {

    const {round, isPending} = route.params;
    const hasStarted = new Date() > new Date(round.startingDate)
    const canEdit = isPending && !round.finished && !hasStarted;
    const canSubmit = !hasStarted && !isPending && !round.finished;

    return (
        <ScrollView>
            <RoundForm round={round} canEdit={canEdit} canSubmit={canSubmit} hasStarted={hasStarted} />
        </ScrollView>
    );
};

export default RoundDetailScreen;
