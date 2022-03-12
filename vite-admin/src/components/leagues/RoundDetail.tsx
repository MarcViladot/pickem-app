import React, {FC, useState} from 'react';
import { IconButton, Paper, Tooltip } from '@mui/material';
import { CircleEditOutline } from 'mdi-material-ui';
import { AddCircleOutline } from '@mui/icons-material';
import league from '../../api/league';
import {useQuery, useQueryClient} from 'react-query';
import {useSnackbar} from '../../contexts/snackbar.context';
import {useNavigate} from 'react-router-dom';
import CreateMatchDialog from '../rounds/CreateMatchDialog';
import EditRoundDialog from '../rounds/EditRoundDialog';
import MatchList from '../common/MatchList';

const RoundDetail: FC = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { id, roundId } = {id: 1, roundId: 1};
    const { showResErrorSnackbar } = useSnackbar();
    const { isFetching, data } = useQuery([`round`, id, roundId], () => league.getRoundWithMatches(`${roundId}`), {
        onSuccess: (res) => {
            if (res.IsError) {
                showResErrorSnackbar(res);
            }
        },
    });

    const [newMatchDialogVisible, setNewMatchDialogVisible] = useState(false);
    const [editRoundDialogVisible, setEditRoundDialogVisible] = useState(false);

    return (
        <>
            {!!data?.Result && (
                <>
                    <CreateMatchDialog
                        roundDetail={data.Result}
                        open={newMatchDialogVisible}
                        onClose={() => setNewMatchDialogVisible(false)}
                    />
                    <EditRoundDialog
                        roundDetail={data?.Result}
                        open={editRoundDialogVisible}
                        onClose={() => setEditRoundDialogVisible(false)}
                    />
                    <Paper className={`p-5 mb-3 flex justify-between`}>
                        <h1 className={`text-4xl`}>{data.Result.name}</h1>
                        <div className={`flex`}>
                            <Tooltip title={`Edit Round`} placement={`left`}>
                                <IconButton
                                    onClick={() => setEditRoundDialogVisible(true)}
                                    color={`warning`}
                                >
                                    <CircleEditOutline />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={`Add match`} placement={`top`}>
                                <IconButton
                                    onClick={() => setNewMatchDialogVisible(true)}
                                    className={`ml-2`}
                                >
                                    <AddCircleOutline />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </Paper>
                    <Paper className={`p-2 md:p-5 flex-grow flex md:items-center`}>
                        <MatchList
                            disableDeleteMatch={false}
                            matchList={data.Result.matches || []}
                            updateRoundDetail={() => queryClient.invalidateQueries([`round`, id, roundId])}
                            onMatchDeleted={() => queryClient.invalidateQueries([`round`, id, roundId])}
                        />
                    </Paper>
                </>
            )}
        </>
    );
};

export default RoundDetail;
