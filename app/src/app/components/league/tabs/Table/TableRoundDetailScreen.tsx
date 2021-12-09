import React, {FC} from 'react';
import {ScrollView, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {TableStackParamList} from './TabTableScreen';
import {RouteProp} from '@react-navigation/native';
import RoundForm from '../../RoundForm';

type ScreenNavigationProps = StackNavigationProp<TableStackParamList, "TableRoundDetail">;
type ScreenRouteProp = RouteProp<TableStackParamList, "TableRoundDetail">;

interface Props {
    navigation: ScreenNavigationProps;
    route: ScreenRouteProp;
}

const TableRoundDetailScreen: FC<Props> = ({navigation, route}) => {

    const {round} = route.params;

    return (
        <ScrollView>
            <RoundForm onlyView={true} round={round} canEdit={false} canSubmit={false} hasStarted={true}
                       onSubmit={() => null} />
        </ScrollView>
    );
};

export default TableRoundDetailScreen;
