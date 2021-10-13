import React, {Dispatch, FC, SetStateAction, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../reducers';
import {loadTeams} from '../../../actions/teams/loadTeams';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {Match, UpdateMatch} from '../../../interfaces/League';
import {showBar} from '../../../actions/utils/showBar';
import league from '../../../api/league';
import {hideBar} from '../../../actions/utils/hideBar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import {Button, Checkbox, FormControlLabel, FormGroup, TextField} from '@mui/material';
import DateTimePicker from '@material-ui/lab/DateTimePicker';
import DialogActions from '@mui/material/DialogActions';

interface Props {
    match: Match;
    editMatchDialogVisible: boolean;
    setEditMatchDialogVisible: Dispatch<SetStateAction<boolean>>;
    disableDeleteMatch: boolean;
    onMatchDeleted: (matchId: number) => void;
    onMatchUpdate: (match: Match) => void;
}

const EditMatchForm: FC<Props> = ({match, editMatchDialogVisible, setEditMatchDialogVisible, disableDeleteMatch, onMatchDeleted, onMatchUpdate}) => {

    const dispatch = useDispatch();
    const loading = useSelector((state: RootState) => state.utils.showProgressBar);
    const teamList = useSelector((state: RootState) => state.team.all);

    useEffect(() => {
        if (!teamList.length) {
            dispatch(loadTeams());
        }
    }, [])

    const deleteMatch = async () => {
        dispatch(showBar());
        const res = await league.deleteMatch(match.id);
        if (!res.IsError) {
            onMatchDeleted(match.id);
            closeDialog();
        }
        dispatch(hideBar());
    };

    const formik = useFormik({
        initialValues: {
            date: new Date(match.startDate),
            doublePoints: match.doublePoints,
            finished: match.finished
        },
        validationSchema: Yup.object({
            date: Yup.date().required("Required"),
            doublePoints: Yup.boolean().required("Required"),
            finished: Yup.boolean().required("Required"),
        }),
        onSubmit: (values) => {
            editMatch({
                ...values,
                startDate: values.date,
                id: match.id
            })
        },
    });

    const editMatch = async (values: UpdateMatch) => {
        dispatch(showBar());
        const res = await league.updateMatch(values);
        if (!res.IsError) {
            /*const newMatch = res.Result;
            onMatchUpdate({
                ...match,
                startDate: newMatch.startDate,
                finished: newMatch.finished,
                doublePoints: newMatch.doublePoints
            });*/
            closeDialog();
        }
        dispatch(hideBar());
    };

    const closeDialog = () => {
        setEditMatchDialogVisible(false);
        formik.resetForm();
    }

    return (
        <Dialog
            open={editMatchDialogVisible}
            onClose={() => closeDialog()}
        >
            <DialogTitle style={{width: "600px"}}>
                Edit Match {match.id}
            </DialogTitle>
            <form onSubmit={formik.handleSubmit} className="w-full">
                <DialogContent>
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
                    <div className={"flex justify-between mt-3 pl-3"}>
                        <FormGroup>
                            <FormControlLabel label="Double Points" control={
                                <Checkbox name="doublePoints"
                                          onChange={() => formik.setFieldValue('doublePoints', !formik.values.doublePoints)}
                                          onBlur={formik.handleBlur}
                                          checked={formik.values.doublePoints}
                                          value={formik.values.doublePoints}
                                />
                            }
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormControlLabel label="Match Finished" control={
                                <Checkbox name="finished" color={"warning"}
                                          onChange={() => formik.setFieldValue('finished', !formik.values.finished)}
                                          onBlur={formik.handleBlur}
                                          checked={formik.values.finished}
                                          value={formik.values.finished}
                                />
                            }
                            />
                        </FormGroup>
                    </div>
                </DialogContent>
                <DialogActions sx={{justifyContent: 'space-between'}}>
                    <Button disabled={disableDeleteMatch || loading || match.finished} color={"error"} onClick={() => deleteMatch()}>
                        Delete
                    </Button>
                    <Button type="submit" disabled={loading || !formik.isValid}>
                        Edit Match
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
};

export default EditMatchForm;
