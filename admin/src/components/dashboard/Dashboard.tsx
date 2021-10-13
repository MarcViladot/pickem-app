import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../reducers';
import {loadDashboardInfo} from '../../actions/dashboard/loadDashboardInfo';
import {Paper} from '@mui/material';
import {Person} from '@mui/icons-material';
import MatchList from '../leagues/Match/MatchList';
import {updateMatchDeleted} from '../../actions/dashboard/updateMatchDeleted';

const Dashboard = () => {

    const dispatch = useDispatch();
    const dashboardInfo = useSelector((state: RootState) => state.dashboard.info);

    useEffect(() => {
        if (!dashboardInfo) {
            dispatch(loadDashboardInfo());
        }
    }, []);

    const Card = () => (
        <Paper className={"h-100 w-full border-l-8 border-blue-400 p-3 flex items-center"}>
            <div className={"h-full flex flex-grow justify-between flex-col mr-2"}>
                <h1 className={"text-3xl"}>Users</h1>
                <h1 className={"text-2xl"}>234</h1>
            </div>
            <div>
                <Person sx={{fontSize: 60}}/>
            </div>
        </Paper>
    );

    return (
        <div>
            <div className={"grid gap-3 lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 mb-3"}>
                <Card/>
                <Card/>
                <Card/>
                <Card/>
                <Card/>
                <Card/>
            </div>
            <div>
                <Paper className={"p-5"}>
                    <h1 className={"text-center text-3xl mb-5"}>Live / Pending of result Matches</h1>
                    {dashboardInfo?.liveMatchList.length ? (
                        <MatchList disableDeleteMatch={true} matchList={dashboardInfo ? dashboardInfo.liveMatchList : []}
                                   setRoundDetail={() => null} onMatchDeleted={matchId => dispatch(updateMatchDeleted(matchId))}/>
                    ) : (
                        <h1 className={"mt-8 text-xl text-center"}>There are no matches right now</h1>
                    )
                    }
                </Paper>
            </div>
        </div>
    );
};

export default Dashboard;
