import React, {FC, useState} from 'react';
import { IconButton, Paper, Tooltip } from '@mui/material';
import { Add } from '@mui/icons-material';
import useMobileView from '../../hooks/useMobileView';
import {useSnackbar} from '../../contexts/snackbar.context';
import {useQuery} from 'react-query';
import league from '../../api/league';
import CreateLeagueDialog from './CreateLeagueDialog';
import {useNavigate} from 'react-router-dom';
import {League} from '../../interfaces/League';

const LeaguesList: FC = () => {

    const navigate = useNavigate();
    const [mobileView] = useMobileView();
    const [newLeagueDialogVisible, setNewLeagueDialogVisible] = useState(false);
    const { showResErrorSnackbar } = useSnackbar();
    const { isFetching, data } = useQuery(`leagues`, league.getAllLeagues, {
        onSuccess: (res) => {
            if (res.IsError) {
                showResErrorSnackbar(res);
            }
        },
    });


    return (
        <>
            <CreateLeagueDialog
                onClose={() => setNewLeagueDialogVisible(false)}
                open={newLeagueDialogVisible}
            />
            <div className={`flex flex-wrap flex-col sm:flex-row`}>
                {data?.Result?.map((league: League) => (
                    <Paper
                        onClick={() => navigate(`/leagues/${league.id}`)}
                        key={league.id}
                        className={`flex items-center flex-row sm:flex-col items-center p-3 sm:p-5 sm:mr-5 mb-3 sm:mb-5 cursor-pointer`}
                    >
                        <div
                            style={{ height: mobileView ? 60 : 100 }}
                            className={`bg-white rounded-full flex items-center justify-center overflow-hidden border-4 border-indigo-600`}
                        >
                            <img
                                src={league.logo}
                                alt={league.name}
                                className={`w-full h-full`}
                            />
                        </div>
                        <div className={`text-xl sm:text-3xl sm:mt-5 ml-3 sm:ml-0`}>
                            {league.name}
                        </div>
                    </Paper>
                ))}
                <Paper className={`p-5 mb-5 flex flex-col justify-center`}>
                    <Tooltip title="New League" aria-label="add">
                        <IconButton onClick={() => setNewLeagueDialogVisible(true)}>
                            <Add />
                        </IconButton>
                    </Tooltip>
                </Paper>
            </div>
        </>
    );
};

export default LeaguesList;
