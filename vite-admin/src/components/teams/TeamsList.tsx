import React, {useState} from 'react';
import CreateTeamDialog from './CreateTeamDialog';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { IconButton, Paper, Tooltip } from '@mui/material';
import { AddCircleOutline, Loop } from '@mui/icons-material';
import {useQuery, useQueryClient} from 'react-query';
import {useSnackbar} from '../../contexts/snackbar.context';
import team from '../../api/team';

const TeamsList = () => {

    const queryClient = useQueryClient();
    const { showResErrorSnackbar } = useSnackbar();
    const { isFetching, data } = useQuery(`teams`, team.getAll, {
        onSuccess: (res) => {
            if (res.IsError) {
                showResErrorSnackbar(res);
            }
        },
    });
    const [newTeamDialogVisible, setNewTeamDialogVisible] = useState(false);

    const columns: GridColDef[] = [
        {
            field: `id`,
            headerName: `ID`,
            width: 110,
            cellClassName: `text-white`,
            headerClassName: `text-white`,
        },
        {
            field: `crest`,
            headerName: `Crest`,
            width: 120,
            filterable: false,
            sortable: false,
            cellClassName: `text-white`,
            headerClassName: `text-white`,
            renderCell: (params: GridRenderCellParams) => (
                <span
                    style={{ width: 50 }}
                    className={`h-full flex justify-center items-center`}
                >
          <img
              src={params.value as string}
              alt={params.value as string}
              style={{ height: 40 }}
          />
        </span>
            ),
        },
        {
            field: `name`,
            headerName: `Name`,
            width: 200,
            editable: true,
            cellClassName: `text-white`,
            headerClassName: `text-white`,
        },
    ];

    return (
        <>
            <CreateTeamDialog onClose={() => setNewTeamDialogVisible(false)} open={newTeamDialogVisible} />
            {!!data && (
                <>
                    <Paper className={`p-5 mb-3 flex justify-between`}>
                        <h1 className={`text-4xl`}>Teams List</h1>
                        <div>
                            <Tooltip title={`Add team`} placement={`left`}>
                                <IconButton onClick={() => setNewTeamDialogVisible(true)}>
                                    <AddCircleOutline />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={`Reload Team list`} placement={`top`}>
                                <IconButton onClick={() => queryClient.invalidateQueries(`teams`)}>
                                    <Loop />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </Paper>
                    <Paper style={{ minHeight: 500, flex: 1, width: `100%` }}>
                        <DataGrid
                            rows={data.Result}
                            columns={columns}
                            pageSize={50}
                            rowsPerPageOptions={[50]}
                            disableSelectionOnClick
                        />
                    </Paper>
                </>
            )}
        </>
    );
};

export default TeamsList;
