import React, { FC } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useQueryClient } from 'react-query';
import {useSnackbar} from '../../contexts/snackbar.context';
import league from '../../api/league';
import {CreateLeague} from '../../interfaces/League';

interface Props {
  onClose: () => void;
  open: boolean;
}

const CreateLeagueDialog: FC<Props> = ({ open, onClose }) => {
  const { showSuccessSnackbar, showResErrorSnackbar } = useSnackbar();
  const loading = false;
  const queryClient = useQueryClient();

  const formik = useFormik({
    initialValues: {
      name: ``,
      logo: ``,
    },
    validationSchema: Yup.object({
      name: Yup.string().required(`Required`),
      logo: Yup.string().required(`Required`),
    }),
    onSubmit: (values) => {
      createLeague(values);
    },
  });

  const createLeague = async (data: CreateLeague) => {
    const res = await league.createLeague(data);
    if (!res.IsError) {
      showSuccessSnackbar(`League created`);
      formik.resetForm();
      queryClient.invalidateQueries(`leagues`);
      onClose();
    } else {
      showResErrorSnackbar(res);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose()}>
      <form onSubmit={formik.handleSubmit} className="w-full">
        <DialogTitle style={{ width: `600px` }}>Create new League</DialogTitle>
        <DialogContent>
          <div>
            <TextField
              // @ts-ignore
              error={formik.errors.name && formik.touched.name}
              id="name"
              label="League Name"
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
            <TextField
              // @ts-ignore
              error={formik.errors.logo && !!formik.touched.logo}
              id="logo"
              label="League Logo"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.logo}
              margin="normal"
              variant="outlined"
              name="logo"
              fullWidth
              required
            />
            {` `}
            {formik.errors.logo && formik.touched.logo ? (
              <small className="error">{formik.errors.logo}</small>
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

export default CreateLeagueDialog;
