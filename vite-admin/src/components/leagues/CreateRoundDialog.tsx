import React, { FC } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useQuery, useQueryClient } from 'react-query';
import DateTimePicker from '@material-ui/lab/DateTimePicker';
import translations from '../../api/translations';
import {useSnackbar} from '../../contexts/snackbar.context';
import league from '../../api/league';
import {CreateRound, TranslationGroup} from '../../interfaces/League';

interface Props {
  onClose: () => void;
  open: boolean;
  id: string;
}

const CreateRoundDialog: FC<Props> = ({ onClose, open, id }) => {
  const { showResErrorSnackbar, showSuccessSnackbar } = useSnackbar();
  const { isFetching, data } = useQuery(`translations`, translations.getAll, {
    onSuccess: (res) => {
      if (res.IsError) {
        showResErrorSnackbar(res);
      }
    },
  });

  const loading = false;
  const queryClient = useQueryClient();

  const formik = useFormik({
    initialValues: {
      name: ``,
      date: null,
      translationGroupId: -1,
      translationNameExtra: ``,
    },
    validationSchema: Yup.object({
      name: Yup.string().required(`Required`),
      date: Yup.date().required(`Required`),
      translationGroupId: Yup.number().required(`Required`),
      translationNameExtra: Yup.string(),
    }),
    onSubmit: ({ name, date, translationGroupId, translationNameExtra }) => {
      createRound({
        name,
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
      showSuccessSnackbar(`Round created`);
      formik.resetForm();
      queryClient.invalidateQueries([`league`, id]);
      onClose();
    } else {
      showResErrorSnackbar(res);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose()}>
      <form onSubmit={formik.handleSubmit} className="w-full">
        <DialogTitle style={{ width: `600px` }}>Create new round</DialogTitle>
        <DialogContent>
          <div>
            <TextField
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
          <div>
            <FormControl
              variant="outlined"
              style={{ marginTop: 20, width: `100%` }}
            >
              <InputLabel id="translationGroupId">Translation group</InputLabel>
              <Select
                labelId="translationGroupId"
                id="translationGroupId"
                name="translationGroupId"
                value={formik.values.translationGroupId}
                // @ts-ignore
                onChange={formik.handleChange(`translationGroupId`)}
                onBlur={formik.handleBlur}
                label="Translation group"
                fullWidth
                required
              >
                {data?.Result?.map((group: TranslationGroup) => (
                  <MenuItem
                    value={group.id}
                    key={group.id}
                    style={{ display: `flex` }}
                  >
                    <span className={`ml-2`}>{group.groupName}</span>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
            <TextField
              error={
                formik.errors.translationNameExtra &&
                formik.touched.translationNameExtra
              }
              id="translationNameExtra"
              label="Extra translate param"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.translationNameExtra}
              margin="normal"
              variant="outlined"
              name="translationNameExtra"
              fullWidth
            />
            {` `}
            {formik.errors.translationNameExtra &&
            formik.touched.translationNameExtra ? (
              <small className="error">
                {formik.errors.translationNameExtra}
              </small>
            ) : null}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose()}>Cancel</Button>
          <Button type="submit" disabled={loading || !formik.isValid}>
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateRoundDialog;
