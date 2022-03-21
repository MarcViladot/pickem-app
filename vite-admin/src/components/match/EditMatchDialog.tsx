import React, { FC, useState } from 'react';
import { useQuery } from 'react-query';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  TextField,
} from '@mui/material';
import { DateTimePicker } from '@material-ui/lab';
import {Match, UpdateMatch} from '../../interfaces/League';
import {useSnackbar} from '../../contexts/snackbar.context';
import league from '../../api/league';

interface Props {
  match: Match;
  open: boolean;
  onClose: () => void;
  disableDeleteMatch: boolean;
  onMatchDeleted: (matchId: number) => void;
  onMatchUpdate: () => void;
}

const EditMatchDialog: FC<Props> = ({
  match,
  open,
  onClose,
  disableDeleteMatch,
  onMatchUpdate,
  onMatchDeleted,
}) => {
  const { showResErrorSnackbar, showSuccessSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      date: new Date(match.startDate),
      doublePoints: match.doublePoints,
      finished: match.finished,
      postponed: match.postponed
    },
    validationSchema: Yup.object({
      date: Yup.date().required(`Required`),
      doublePoints: Yup.boolean().required(`Required`),
      finished: Yup.boolean().required(`Required`),
      postponed: Yup.boolean().required(`Required`),
    }),
    onSubmit: (values) => {
      editMatch({
        ...values,
        startDate: values.date,
        id: match.id,
      });
    },
  });

  const closeDialog = () => {
    formik.resetForm();
    onClose();
  };

  const deleteMatch = async () => {
    setLoading(true);
    const res = await league.deleteMatch(match.id);
    if (!res.IsError) {
      onMatchDeleted(match.id);
      closeDialog();
      showSuccessSnackbar(`Match deleted`);
    } else {
      showResErrorSnackbar(res);
    }
    setLoading(false);
  };

  const editMatch = async (values: UpdateMatch) => {
    setLoading(true);
    const res = await league.updateMatch(values);
    if (!res.IsError) {
      onMatchUpdate();
      closeDialog();
    } else {
      showResErrorSnackbar(res);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={() => closeDialog()}>
      <DialogTitle style={{ width: `600px` }}>
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
          <div className={`flex justify-between mt-3 pl-3`}>
            <FormGroup>
              <FormControlLabel
                label="Double Points"
                control={
                  <Checkbox
                    name="doublePoints"
                    onChange={() =>
                      formik.setFieldValue(
                        `doublePoints`,
                        !formik.values.doublePoints,
                      )
                    }
                    onBlur={formik.handleBlur}
                    checked={formik.values.doublePoints}
                    value={formik.values.doublePoints}
                  />
                }
              />
            </FormGroup>
            <FormGroup>
              <FormControlLabel
                  label="Match Postponed"
                  control={
                    <Checkbox
                        name="postponed"
                        color={`error`}
                        onChange={() =>
                            formik.setFieldValue(`postponed`, !formik.values.postponed)
                        }
                        onBlur={formik.handleBlur}
                        checked={formik.values.postponed}
                        value={formik.values.postponed}
                    />
                  }
              />
            </FormGroup>
            <FormGroup>
              <FormControlLabel
                label="Match Finished"
                control={
                  <Checkbox
                    name="finished"
                    color={`warning`}
                    onChange={() =>
                      formik.setFieldValue(`finished`, !formik.values.finished)
                    }
                    onBlur={formik.handleBlur}
                    checked={formik.values.finished}
                    value={formik.values.finished}
                  />
                }
              />
            </FormGroup>
          </div>
        </DialogContent>
        <DialogActions sx={{ justifyContent: `space-between` }}>
          <Button
            disabled={disableDeleteMatch || loading || match.finished}
            color={`error`}
            onClick={() => deleteMatch()}
          >
            Delete
          </Button>
          <Button type="submit" disabled={loading || !formik.isValid}>
            Edit Match
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditMatchDialog;
