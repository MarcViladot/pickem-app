import React, {Dispatch, FC, SetStateAction, useEffect} from 'react';
import {CreateMatch, Round} from '../../../interfaces/League';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import league from '../../../api/league';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from '@mui/material';
import {Team} from '../../../interfaces/Team';
import DateTimePicker from '@material-ui/lab/DateTimePicker';
import DialogActions from '@mui/material/DialogActions';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../reducers';
import {loadTeams} from '../../../actions/teams/loadTeams';

interface Props {
    roundDetail: Round;
    setRoundDetail: Dispatch<SetStateAction<Round | undefined>>;
    newMatchDialogVisible: boolean;
    setNewMatchDialogVisible: Dispatch<SetStateAction<boolean>>;
}

const CreateMatchForm: FC<Props> = ({roundDetail, setRoundDetail, newMatchDialogVisible, setNewMatchDialogVisible}) => {

    const dispatch = useDispatch();
    const loading = useSelector((state: RootState) => state.utils.showProgressBar);
    const teamList = useSelector((state: RootState) => state.team.all);

    useEffect(() => {
        if (!teamList.length) {
            dispatch(loadTeams());
        }
    }, [])

    const formik = useFormik({
        initialValues: {
            localTeamId: -1,
            awayTeamId: -1,
            date: new Date(roundDetail.startingDate),
            doublePoints: false
        },
        validationSchema: Yup.object({
            localTeamId: Yup.string().required("Required"),
            awayTeamId: Yup.string().required("Required"),
            date: Yup.date().required("Required"),
            doublePoints: Yup.boolean().required("Required"),
        }),
        onSubmit: (values) => {
            createMatch({
                ...values,
                startDate: values.date,
                roundId: roundDetail.id
            })
        },
    });

    const createMatch = async (values: CreateMatch) => {
        const res = await league.createMatch(values);
        if (!res.IsError) {
            closeDialog();
            setRoundDetail(res.Result);
        }
    };

    const closeDialog = () => {
        setNewMatchDialogVisible(false);
        formik.resetForm();
    }

    return (
        <Dialog
            open={newMatchDialogVisible}
            onClose={() => closeDialog()}
        >
            <DialogTitle style={{width: "600px"}}>
                Create new Match
            </DialogTitle>
            <form onSubmit={formik.handleSubmit} className="w-full">
                <DialogContent>
                    <div className={"flex mb-3"}>
                        <FormControl variant="outlined" className="flex-grow" style={{marginRight: 10}}>
                            <InputLabel id="select-local">Local Team</InputLabel>
                            <Select
                                labelId="select-local"
                                id="local"
                                name="localTeamId"
                                value={formik.values.localTeamId}
                                // @ts-ignore
                                onChange={formik.handleChange("localTeamId")}
                                onBlur={formik.handleBlur}
                                label="Local Team"
                                fullWidth
                                sx={{display: 'flex', alignItems: 'center'}}
                                required>
                                {teamList.map((team: Team) => (
                                    <MenuItem value={team.id} key={team.id} className={"flex"}>
                                        <img src={team.crest} alt={team.name} style={{height: 30}}/>
                                        <span className={"ml-2"}>{team.name}</span>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" className="flex-grow" style={{marginLeft: 10}}>
                            <InputLabel id="select-away">Away Team</InputLabel>
                            <Select
                                labelId="select-away"
                                id="away"
                                name="awayTeamId"
                                value={formik.values.awayTeamId}
                                // @ts-ignore
                                onChange={formik.handleChange("awayTeamId")}
                                onBlur={formik.handleBlur}
                                label="Away Team"
                                fullWidth
                                required>
                                {teamList.map((team: Team) => (
                                    <MenuItem value={team.id} key={team.id} style={{display: 'flex'}}>
                                        <img src={team.crest} alt={team.name} style={{height: 30}}/>
                                        <span className={"ml-2"}>{team.name}</span>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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
                    <div className={"mt-3 pl-3"}>
                        <FormGroup>
                            <FormControlLabel label="Double Points" control={
                                <Checkbox name="doublePoints"
                                          onChange={() => formik.setFieldValue('doublePoints', !formik.values.doublePoints)}
                                          onBlur={formik.handleBlur}
                                          value={formik.values.doublePoints}
                                />
                            }
                            />
                        </FormGroup>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button type="submit" disabled={loading || !formik.isValid}>
                        Create
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
};

export default CreateMatchForm;
