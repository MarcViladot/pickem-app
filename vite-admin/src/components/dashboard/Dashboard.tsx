import React, {FC} from 'react';

import { Icon, Paper } from "@mui/material";
import {useQuery, useQueryClient} from 'react-query';
import {useSnackbar} from '../../contexts/snackbar.context';
import {useAuth} from '../../contexts/auth-user.context';
import {useNavigate} from 'react-router-dom';
import dashboard from '../../api/dashboard';
import UsersChart from './UsersChart';
import MatchList from '../common/MatchList';


interface CardProps {
    title: string;
    icon: string;
    value: number | string;
}

const Dashboard: FC = () => {

    const queryClient = useQueryClient();
    const { showResErrorSnackbar } = useSnackbar();
    const { isFetching, data } = useQuery(`dashboard`, dashboard.getDashboardInfo, {
        onSuccess: (res) => {
            if (res.IsError) {
                showResErrorSnackbar(res);
            }
        },
    });


    const Card: FC<CardProps> = ({ icon, value, title }) => (
        <Paper className={`h-100 w-full border-l-8 border-blue-400 p-3 flex items-center`}>
            <div className={`h-full flex flex-grow justify-between flex-col mr-2`}>
                <h1 className={`text-3xl`}>{title}</h1>
                <h1 className={`text-2xl font-bold`}>{value}</h1>
            </div>
            <div>
                <Icon style={{ fontSize: 60 }}>{icon}</Icon>
            </div>
        </Paper>
    );

    return (
        <>
            {data?.Result && (
                <>
                    <div className={`grid gap-3 lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 mb-3`}>
                        <Card title={`Users`} icon={`person`} value={data.Result.usersCount} />
                        <Card title={`Groups`} icon={`people`} value={data.Result.groupsCount} />
                        <Card title={`Teams`} icon={`gavel`} value={data.Result.teamsCount} />
                        <Card title={`Leagues`} icon={`list`} value={data.Result.leaguesCount} />
                        <Card title={`Predictions`} icon={`colorize`} value={data.Result.predictionsCount} />
                        <Card title={`Users`} icon={`person`} value={data.Result.usersCount} />
                    </div>
                    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-3`}>
                        <Paper className={`p-5 flex flex-col`}>
                            <h1 className={`text-center text-3xl mb-5`}>Users evolution</h1>
                            <div style={{ width: `100%`, minHeight: 400 }} className={`flex-grow`}>
                                <UsersChart />
                            </div>
                        </Paper>
                        <Paper className={`p-5`}>
                            <h1 className={`text-center text-3xl mb-5`}>Live / Pending of result Matches</h1>
                            {data.Result.liveMatchList.length ? (
                                <MatchList
                                    disableDeleteMatch={true}
                                    matchList={data ? data.Result.liveMatchList : []}
                                    updateRoundDetail={() => queryClient.invalidateQueries(`dashboard`)}
                                    onMatchDeleted={() => null}
                                />
                            ) : (
                                <h1 className={`mt-8 text-xl text-center`}>There are no live matches right now</h1>
                            )}
                        </Paper>
                    </div>
                </>
            )}
        </>
    );
};

export default Dashboard;
