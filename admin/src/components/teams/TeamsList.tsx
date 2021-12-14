import React, {useEffect, useState} from 'react';
import Paper from '@mui/material/Paper';
import {Button, IconButton, TextField, Tooltip} from '@mui/material';
import {AddCircleOutline, Loop} from '@mui/icons-material';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../reducers';
import {loadTeams} from '../../actions/teams/loadTeams';
import {CreateTeam} from '../../interfaces/Team';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import team from '../../api/team';
import {setTeams} from '../../actions/teams/setTeams';
import {DataGrid, GridColDef, GridRenderCellParams} from '@mui/x-data-grid';
import {showResErrorSnackbar} from '../../actions/utils/showSnackbar';

const TeamsList = () => {

    const dispatch = useDispatch();
    const teamList = useSelector((state: RootState) => state.team.all);
    const loading = useSelector((state: RootState) => state.utils.showProgressBar);
    const [newTeamDialogVisible, setNewTeamDialogVisible] = useState(false);

    const columns: GridColDef[] = [
        {field: 'id', headerName: 'ID', width: 110, cellClassName: "text-white", headerClassName: "text-white"},
        {
            field: 'crest',
            headerName: 'Crest',
            width: 120,
            filterable: false,
            sortable: false,
            cellClassName: "text-white",
            headerClassName: "text-white",
            renderCell: (params: GridRenderCellParams) => (
                <span style={{width: 50}} className={"h-full flex justify-center items-center"}>
                    <img src={params.value as string} alt={params.value as string} style={{height: 40}}/>
                </span>
            )
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 200,
            editable: true,
            cellClassName: "text-white",
            headerClassName: "text-white",
        }
    ];

    useEffect(() => {
        if (!teamList.length) {
            dispatch(loadTeams());
        }
    }, [])

    const formik = useFormik({
        initialValues: {
            name: "",
            crest: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Required"),
            crest: Yup.string().required("Required"),
        }),
        onSubmit: (values) => {
            createTeam(values);
        },
    });

    const createTeam = async (data: CreateTeam) => {
        const res = await team.createTeam(data);
        if (!res.IsError) {
            dispatch(setTeams([...teamList, res.Result]));
            setNewTeamDialogVisible(false);
            formik.resetForm();
        } else {
            dispatch(showResErrorSnackbar(res));
        }
    }

    return (
        <div className="flex-grow flex flex-col">
            <Dialog
                open={newTeamDialogVisible}
                onClose={() => setNewTeamDialogVisible(false)}>
                <form onSubmit={formik.handleSubmit} className="w-full">
                    <DialogTitle style={{width: "600px"}}>
                        Create new Team
                    </DialogTitle>
                    <DialogContent>
                        <div>
                            <TextField
                                // @ts-ignore
                                error={formik.errors.name && formik.touched.name}
                                id="name"
                                label="Team Name"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.name}
                                margin="normal"
                                variant="outlined"
                                name="name"
                                fullWidth
                                required
                            />{" "}
                            {formik.errors.name && formik.touched.name ? (
                                <small className="error">{formik.errors.name}</small>
                            ) : null}
                        </div>
                        <div>
                            <TextField
                                // @ts-ignore
                                error={formik.errors.crest && !!formik.touched.crest}
                                id="crest"
                                label="Team crest"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.crest}
                                margin="normal"
                                variant="outlined"
                                name="crest"
                                fullWidth
                                required
                            />{" "}
                            {formik.errors.crest && formik.touched.crest ? (
                                <small className="error">{formik.errors.crest}</small>
                            ) : null}
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit" disabled={loading || !formik.isValid}>
                            Create
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Paper className={"p-5 mb-3 flex justify-between"}>
                <h1 className={"text-4xl"}>Teams List</h1>
                <div>
                    <Tooltip title={"Add team"} placement={"left"}>
                        <IconButton onClick={() => setNewTeamDialogVisible(true)}>
                            <AddCircleOutline/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={"Reload Team list"} placement={"top"}>
                        <IconButton onClick={() => dispatch(loadTeams())}>
                            <Loop/>
                        </IconButton>
                    </Tooltip>
                </div>
            </Paper>
            <Paper style={{minHeight: 500, flex: 1, width: '100%'}}>
                <DataGrid
                    rows={teamList}
                    columns={columns}
                    pageSize={50}
                    rowsPerPageOptions={[50]}
                    disableSelectionOnClick
                />
            </Paper>
        </div>
    );
};

export default TeamsList;
