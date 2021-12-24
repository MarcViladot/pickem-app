import React, {FC, useEffect, useState} from "react";
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
import {CreateRound, League, Round, RoundName, TranslationGroup} from "../../interfaces/League";
import {useHistory, useRouteMatch} from "react-router-dom";
import {Add, KeyboardArrowDown, KeyboardArrowUp} from "@mui/icons-material";
import {
    Box,
    Button,
    Collapse, FormControl,
    IconButton,
    InputLabel, MenuItem,
    Select,
    Switch,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {useFormik} from "formik";
import * as Yup from "yup";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {RootState} from "../../reducers";
import DateTimePicker from "@material-ui/lab/DateTimePicker";
import {DateTools} from '../../utils/DateTools';
import {showResErrorSnackbar} from '../../actions/utils/showSnackbar';
import {UserGroup, UserGroupRole} from '../../interfaces/User';
import {Team} from '../../interfaces/Team';
import translations from '../../api/translations';
import {loadTranslations} from '../../actions/translations/loadTranslations';

interface ParamsProps {
    id: string;
}

const LeagueDetail: FC = () => {
    const dispatch = useDispatch();
    const match = useRouteMatch();
    const history = useHistory();
    const {id} = useParams<ParamsProps>();
    const [leagueDetail, setLeagueDetail] = useState<League>();
    const [newRoundDialogVisible, setNewRoundDialogVisible] = useState(false);
    const loading = useSelector((state: RootState) => state.utils.showProgressBar);
    const translations = useSelector((state: RootState) => state.translations.translations);


    useEffect(() => {
        if (!translations.length) {
            dispatch(loadTranslations());
        }
    }, [])

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
            dispatch(showResErrorSnackbar(res));
        }
    };

    const formik = useFormik({
        initialValues: {
            name: "",
            date: null,
            translationGroupId: -1,
            translationNameExtra: ""
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Required"),
            date: Yup.date().required("Required"),
            translationGroupId: Yup.number().required("Required"),
            translationNameExtra: Yup.string()
        }),
        onSubmit: ({name, date, translationGroupId, translationNameExtra}) => {
            createRound({
                name,
                // @ts-ignore
                startingDate: date,
                leagueTypeId: parseInt(id, 10),
                translationGroupId,
                translationNameExtra,
            });
        },
    });

    const createRound = async (values: CreateRound) => {
        const res = await league.createRound(values);
        if (!res.IsError) {
            setNewRoundDialogVisible(false);
            formik.resetForm();
        } else {
            dispatch(showResErrorSnackbar(res));
        }
    };

    const changeRoundVisibility = async (round: Round, visible: boolean) => {
        const res = await league.changeRoundVisibility(round.id, visible);
        if (!res.IsError) {
            round.visible = res.Result.visible;
        } else {
            dispatch(showResErrorSnackbar(res));
        }
    };

    const Row: FC<{ round: Round, index: number }> = ({round, index}) => {

        const [open, setOpen] = React.useState(false);

        return (
            <React.Fragment>
                <TableRow
                    key={round.id.toString()}
                    sx={{"&:last-child td, &:last-child th": {border: 0}}}
                    className={"cursor-pointer"}
                    onClick={() =>
                        history.push(`${match.url}/round/${round.id}`)
                    }
                >
                    <TableCell>
                        <IconButton aria-label="expand row" size="small" onClick={(e) => {
                            e.stopPropagation();
                            setOpen(!open);
                        }}>
                            {open ? <KeyboardArrowUp/> : <KeyboardArrowDown/>}
                        </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {index + 1}
                    </TableCell>
                    <TableCell>{round.name}</TableCell>
                    <TableCell>{round.translationGroup.groupName}</TableCell>
                    <TableCell>{round.translationNameExtra}</TableCell>
                    <TableCell>{DateTools.getCompleteDate(new Date(round.startingDate))}</TableCell>
                    <TableCell>{round.finished.toString()}</TableCell>
                    <TableCell>
                        <Switch checked={round.visible} color={"warning"} onChange={(e) => {
                            changeRoundVisibility(round, !round.visible);
                        }} onClick={e => e.stopPropagation()}/>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{paddingBottom: 0, paddingTop: 0, border: 0}} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit className={"mb-5"}>
                            <Box margin={1}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Translations
                                </Typography>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>#</TableCell>
                                            <TableCell>Text</TableCell>
                                            <TableCell>Lang</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {round.translationGroup.roundNames.map((roundName: RoundName, i) => (
                                            <TableRow key={roundName.id}>
                                                <TableCell className="MuiTableCell-sizeSmall">{i + 1}</TableCell>
                                                <TableCell
                                                    className="MuiTableCell-sizeSmall">{roundName.text}</TableCell>
                                                <TableCell
                                                    className="MuiTableCell-sizeSmall">{roundName.lang}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment>
        )
    }

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
                                label="Admin Round Name"
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
                        <div>
                            <FormControl variant="outlined" style={{marginTop: 20, width: '100%'}}>
                                <InputLabel id="translationGroupId">Translation group</InputLabel>
                                <Select
                                    labelId="translationGroupId"
                                    id="translationGroupId"
                                    name="translationGroupId"
                                    value={formik.values.translationGroupId}
                                    // @ts-ignore
                                    onChange={formik.handleChange("translationGroupId")}
                                    onBlur={formik.handleBlur}
                                    label="Translation group"
                                    fullWidth
                                    required>
                                    {translations.map((group: TranslationGroup) => (
                                        <MenuItem value={group.id} key={group.id} style={{display: 'flex'}}>
                                            <span className={"ml-2"}>{group.groupName}</span>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div>
                            <TextField
                                // @ts-ignore
                                error={formik.errors.translationNameExtra && formik.touched.translationNameExtra}
                                id="translationNameExtra"
                                label="Extra translate param"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.translationNameExtra}
                                margin="normal"
                                variant="outlined"
                                name="translationNameExtra"
                                fullWidth
                            />{" "}
                            {formik.errors.translationNameExtra && formik.touched.translationNameExtra ? (
                                <small className="error">{formik.errors.translationNameExtra}</small>
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
            <div className={"flex flex-grow flex-col"}>
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
                        <TableContainer component={Paper} className={"flex-grow"}>
                            <Table sx={{minWidth: 650}} aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{width: 50}}/>
                                        <TableCell>#</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Translation Group</TableCell>
                                        <TableCell>Translation Name Extra</TableCell>
                                        <TableCell>Starting Date</TableCell>
                                        <TableCell>Finished</TableCell>
                                        <TableCell>Visible</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {leagueDetail?.rounds?.map((round: Round, i) => (
                                        <Row round={round} key={i} index={i}/>
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
