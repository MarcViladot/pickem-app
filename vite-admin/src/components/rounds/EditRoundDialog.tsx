import React, {FC, useState} from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormGroup,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import DateTimePicker from '@material-ui/lab/DateTimePicker';
import {useSnackbar} from '../../contexts/snackbar.context';
import {Round, UpdateRound} from '../../interfaces/League';
import league from '../../api/league';

interface Props {
    roundDetail: Round;
    open: boolean;
    onClose: () => void;
}

const EditRoundDialog: FC<Props> = ({roundDetail, open, onClose}) => {

    const {showSuccessSnackbar, showResErrorSnackbar} = useSnackbar();
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: roundDetail.name,
            date: new Date(roundDetail.startingDate),
            finished: roundDetail.finished,
        },
        validationSchema: Yup.object({
            name: Yup.string().required(`Required`),
            date: Yup.date().required(`Required`),
        }),
        onSubmit: ({name, date, finished}) => {
            const data: UpdateRound = {
                name,
                startingDate: date,
                id: roundDetail.id,
                finished,
            };
            updateRound(data);
        },
    });

    const closeDialog = () => {
        formik.resetForm();
        onClose();
    };

    const updateRound = async (data: UpdateRound) => {
        setLoading(true);
        const res = await league.updateRound(data);
        if (!res.IsError) {
            showSuccessSnackbar(`Round updated`);
            closeDialog();
        } else {
            showResErrorSnackbar(res);
        }
        setLoading(false);
    };

    return (
        <Dialog open={open} onClose={() => closeDialog()}>
            <form onSubmit={formik.handleSubmit} className="w-full">
                <DialogTitle style={{width: `600px`}}>Edit round</DialogTitle>
                <DialogContent>
                    <div className={`mb-2`}>
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
                        />
                        {` `}
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
                            onChange={(value) => formik.setFieldValue(`date`, value)}
                            renderInput={(params: any) => (
                                <TextField className={`w-full`} {...params} />
                            )}
                        />
                        {` `}
                        {formik.errors.date && formik.touched.date ? (
                            <small className="error">{formik.errors.date}</small>
                        ) : null}
                    </div>
                    <div className={`mt-3 pl-3`}>
                        <FormGroup>
                            <FormControlLabel
                                label="Finished"
                                control={
                                    <Checkbox
                                        name="finished"
                                        onChange={() =>
                                            formik.setFieldValue(`finished`, !formik.values.finished)
                                        }
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

export default EditRoundDialog;
