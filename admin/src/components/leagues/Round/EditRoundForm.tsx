import React, {Dispatch, FC, SetStateAction} from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {Round, UpdateRound} from '../../../interfaces/League';
import league from '../../../api/league';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import {Button, Checkbox, FormControlLabel, FormGroup, TextField} from '@mui/material';
import DateTimePicker from '@material-ui/lab/DateTimePicker';
import DialogActions from '@mui/material/DialogActions';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../reducers';
import {showResErrorSnackbar} from '../../../actions/utils/showSnackbar';

interface Props {
    roundDetail: Round;
    setRoundDetail: Dispatch<SetStateAction<Round | undefined>>;
    editRoundDialogVisible: boolean;
    setEditRoundDialogVisible: Dispatch<SetStateAction<boolean>>;
}

const EditRoundForm: FC<Props> = ({roundDetail, setRoundDetail, editRoundDialogVisible, setEditRoundDialogVisible}) => {

    const dispatch = useDispatch();
    const loading = useSelector((state: RootState) => state.utils.showProgressBar);

    const formik = useFormik({
        initialValues: {
            name: roundDetail.name,
            date: new Date(roundDetail.startingDate),
            finished: roundDetail.finished
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Required"),
            date: Yup.date().required("Required"),
        }),
        onSubmit: ({name, date, finished}) => {
            console.log(date);
            const data: UpdateRound = {
                name,
                startingDate: date,
                id: roundDetail.id,
                finished
            }
            updateRound(data);
        },
    });

    const updateRound = async (data: UpdateRound) => {
        const res = await league.updateRound(data);
        if (!res.IsError) {
            setRoundDetail((prevState: any) => {
                return {
                    ...prevState,
                    name: res.Result.name,
                    startingDate: res.Result.startingDate,
                    finished: res.Result.finished
                }
            })
            setEditRoundDialogVisible(false);
        } else {
            dispatch(showResErrorSnackbar(res));
        }
    }

    return (
        <Dialog open={editRoundDialogVisible}
                onClose={() => {
                    setEditRoundDialogVisible(false);
                    formik.resetForm();
                }}
        >
            <form onSubmit={formik.handleSubmit} className="w-full">
                <DialogTitle style={{width: "600px"}}>Edit round</DialogTitle>
                <DialogContent>
                    <div className={"mb-2"}>
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
                    <div className={"mt-3 pl-3"}>
                        <FormGroup>
                            <FormControlLabel label="Finished" control={
                                <Checkbox name="finished"
                                          onChange={() => formik.setFieldValue('finished', !formik.values.finished)}
                                          onBlur={formik.handleBlur}
                                          checked={formik.values.finished}
                                />
                            }
                            />
                        </FormGroup>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button type="submit" disabled={loading || !formik.isValid}>
                        Edit
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EditRoundForm;
