import React, {FC, useEffect} from 'react';
import {Button, Dialog, TextField} from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DateTimePicker from '@material-ui/lab/DateTimePicker';
import DialogActions from '@mui/material/DialogActions';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {TranslationGroupDto} from '../../interfaces/League';
import translations from '../../api/translations';
import {useDispatch, useSelector} from 'react-redux';
import {showResErrorSnackbar} from '../../actions/utils/showSnackbar';
import {addTranslation} from '../../actions/translations/addTranslation';
import {RootState} from '../../reducers';
import {loadTranslations} from '../../actions/translations/loadTranslations';

interface Props {
    newDialogVisible: boolean;
    setNewDialogVisible: (visible: boolean) => void;
}

const NewTranslationGroupFrom: FC<Props> = ({newDialogVisible, setNewDialogVisible}) => {

    const dispatch = useDispatch();
    const loading = useSelector((state: RootState) => state.utils.showProgressBar);
    const formik = useFormik({
        initialValues: {
            name: "",
            textEn: "",
            textEs: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Required"),
            textEn: Yup.string().required("Required"),
            textEs: Yup.string().required("Required"),
        }),
        onSubmit: ({name, textEn, textEs}) => {
            createGroup(name, textEn, textEs);
        },
    });

    const createGroup = async (name: string, textEn: string, textEs: string) => {
        const data: TranslationGroupDto = {
            name,
            rounds: [
                {
                    lang: "en",
                    text: textEn
                },
                {
                    lang: "es",
                    text: textEs
                }
            ]
        };
        const res = await translations.newTranslationGroup(data);
        if (!res.IsError) {
            dispatch(addTranslation(res.Result));
            setNewDialogVisible(false);
        } else {
            dispatch(showResErrorSnackbar(res));
        }
    }

    return (
        <Dialog
            open={newDialogVisible}
            onClose={() => setNewDialogVisible(false)}>
            <form onSubmit={formik.handleSubmit} className="w-full">
                <DialogTitle style={{width: "600px"}}>Create translation group</DialogTitle>
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
                        <TextField
                            // @ts-ignore
                            error={formik.errors.textEn && formik.touched.textEn}
                            id="textEn"
                            label="English translation"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.textEn}
                            margin="normal"
                            variant="outlined"
                            name="textEn"
                            fullWidth
                            required
                        />{" "}
                        {formik.errors.textEn && formik.touched.textEn ? (
                            <small className="error">{formik.errors.textEn}</small>
                        ) : null}
                    </div>
                    <div>
                        <TextField
                            // @ts-ignore
                            error={formik.errors.textEs && formik.touched.textEs}
                            id="textEs"
                            label="Spanish translation"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.textEs}
                            margin="normal"
                            variant="outlined"
                            name="textEs"
                            fullWidth
                            required
                        />{" "}
                        {formik.errors.textEs && formik.touched.textEs ? (
                            <small className="error">{formik.errors.textEs}</small>
                        ) : null}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setNewDialogVisible(false)}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading || !formik.isValid}>
                        Create
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default NewTranslationGroupFrom;

