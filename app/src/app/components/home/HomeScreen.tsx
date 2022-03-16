import React, {FC, useEffect, useState} from "react";
import {Button, RefreshControl, ScrollView, Text, View} from "react-native";
import {ThemeText} from "../common/ThemeText";
import {AppDashboard} from '../../interfaces/dashboard.interface';
import dashboardApi from '../../api/dashboard';
import {useDispatch} from 'react-redux';
import {showApiErrorToast} from '../../actions/utils/showApiErrorToast';
import NextRoundItem from '../common/NextRoundItem';
import {LeagueInfo, Round} from '../../interfaces/league.interface';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {HomeStackParamList} from './HomeStackScreen';

type ScreenNavigationProps = StackNavigationProp<HomeStackParamList, "Home">;
type ScreenRouteProp = RouteProp<HomeStackParamList, "Home">;

interface Props {
    navigation: ScreenNavigationProps;
    route: ScreenRouteProp;
}

const HomeScreen: FC<Props> = ({navigation}) => {

    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(true);
    const [dashboard, setDashboard] = useState<AppDashboard>();

    const refreshDashboard = async () => {
        setRefreshing(true);
        const res = await dashboardApi.getDashboardApp();
        if (!res.IsError) {
            setDashboard(new AppDashboard(res.Result));
        } else {
            dispatch(showApiErrorToast(res));
        }
        setRefreshing(false);
    }

    useEffect(() => {
        refreshDashboard();
    }, []);

    const onSubmit = (round: Round) => {
    }

    const onClickNextRound = (round: Round) => {
        navigation.navigate('RoundDetail', {round, onSubmit});
    }

    const updateNextRound = (round: Round) => {
        // SUBMIT NEXT ROUND
    }

    return (
        <ScrollView style={{padding: 10}}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => refreshDashboard()}
                        />
                    }>
            {dashboard?.nextRounds.map(round => (
                <NextRoundItem round={round} onClick={onClickNextRound} key={round.id}
                               onSubmit={updateNextRound} showLeagueIcon={true}/>
            ))}
        </ScrollView>
    );
};

export default HomeScreen;
