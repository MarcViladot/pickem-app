import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router";
import {hideBar} from "../../actions/utils/hideBar";
import league from "../../api/league";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {CreateRound, League, Round} from "../../interfaces/League";
import {useHistory, useRouteMatch} from "react-router-dom";
import {Add} from "@mui/icons-material";
import {Button, IconButton, Switch, TextField, Tooltip} from "@mui/material";
import {useFormik} from "formik";
import * as Yup from "yup";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {RootState} from "../../reducers";
import DateTimePicker from "@material-ui/lab/DateTimePicker";
import {DateTools} from '../../utils/DateTools';

interface ParamsProps {
    id: string;
}

const LeagueDetail = () => {
    const dispatch = useDispatch();
    const match = useRouteMatch();
    const history = useHistory();
    const {id} = useParams<ParamsProps>();
    const [leagueDetail, setLeagueDetail] = useState<League>();
    const [newRoundDialogVisible, setNewRoundDialogVisible] = useState(false);
    const loading = useSelector(
        (state: RootState) => state.utils.showProgressBar
    );

    useEffect(() => {
        if (!leagueDetail) {
            loadLeagueDetail();
        }
    }, []);

    const loadLeagueDetail = async () => {
        const res = await league.getLeagueDetail(id);
        if (!res.IsError) {
            setLeagueDetail(res.Result);
        } else {
            // TODO SHOW ERROR
        }
    };

    const formik = useFormik({
        initialValues: {
            name: "",
            date: null,
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Required"),
            date: Yup.date().required("Required"),
        }),
        onSubmit: ({name, date}) => {
            createRound({
                name,
                // @ts-ignore
                startingDate: date,
                leagueTypeId: parseInt(id, 10),
            });
        },
    });

    const createRound = async (values: CreateRound) => {
        const res = await league.createRound(values);
        if (!res.IsError) {
            setNewRoundDialogVisible(false);
            formik.resetForm();
        } else {
            // TODO SHOW ERROR
        }
    };

    const changeRoundVisibility = async (round: Round, visible: boolean) => {
        const res = await league.changeRoundVisibility(round.id, visible);
        if (!res.IsError) {
            round.visible = res.Result.visible;
        } else {
            // TODO SHOW ERROR
        }
    };

    return (
        <>
            <Dialog
                open={newRoundDialogVisible}
                onClose={() => setNewRoundDialogVisible(false)}
            >
                <form onSubmit={formik.handleSubmit} className="w-full">
                    <DialogTitle style={{width: "600px"}}>Create new round</DialogTitle>
                    <DialogContent>
                        <div>
                            <TextField
                                // @ts-ignore
                                error={formik.errors.name && formik.touched.name}
                                id="name"
                                label="Round Name"
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
                            <DateTimePicker
                                // @ts-ignore
                                error={formik.errors.date && !!formik.touched.date}
                                name="date"
                                id="date"
                                label="Start Date"
                                margin="normal"
                                value={formik.values.date}
                                onChange={(value) => formik.setFieldValue("date", value)}
                                renderInput={(params: any) => (
                                    <TextField className={"w-full"} {...params} />
                                )}
                            />{" "}
                            {formik.errors.date && formik.touched.date ? (
                                <small className="error">{formik.errors.date}</small>
                            ) : null}
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setNewRoundDialogVisible(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading || !formik.isValid}>
                            Create
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <div>
                {!!leagueDetail && (
                    <>
                        <Paper className={"p-5 mb-3 flex justify-between"}>
                            <h1 className={"text-4xl"}>{leagueDetail.name}</h1>
                            <Tooltip title={"Add round"} placement={"left"}>
                                <IconButton onClick={() => setNewRoundDialogVisible(true)}>
                                    <Add/>
                                </IconButton>
                            </Tooltip>
                        </Paper>
                        <TableContainer component={Paper}>
                            <Table sx={{minWidth: 650}} aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Starting Date</TableCell>
                                        <TableCell>Finished</TableCell>
                                        <TableCell>Visible</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {leagueDetail?.rounds?.map((round: Round, i) => (
                                        <TableRow
                                            key={round.id.toString()}
                                            sx={{"&:last-child td, &:last-child th": {border: 0}}}
                                            className={"cursor-pointer"}
                                            onClick={() =>
                                                history.push(`${match.url}/round/${round.id}`)
                                            }
                                        >
                                            <TableCell component="th" scope="row">
                                                {i + 1}
                                            </TableCell>
                                            <TableCell>{round.name}</TableCell>
                                            <TableCell>{DateTools.getCompleteDate(new Date(round.startingDate))}</TableCell>
                                            <TableCell>{round.finished.toString()}</TableCell>
                                            <TableCell>
                                                <Switch checked={round.visible} onChange={(e) => {
                                                    changeRoundVisibility(round, !round.visible);
                                                }} onClick={e => e.stopPropagation()}/>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}
            </div>
        </>
    );
};

export default LeagueDetail;
