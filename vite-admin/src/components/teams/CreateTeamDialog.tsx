import React, { FC, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import {useSnackbar} from '../../contexts/snackbar.context';
import {CreateTeam} from '../../interfaces/Team';
import team from '../../api/team';

interface Props {
  onClose: () => void;
  open: boolean;
}

const CreateTeamDialog: FC<Props> = ({ open, onClose }) => {

  const { showResErrorSnackbar, showSuccessSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: ``,
      crest: ``,
    },
    validationSchema: Yup.object({
      name: Yup.string().required(`Required`),
      crest: Yup.string().required(`Required`),
    }),
    onSubmit: (values) => {
      createTeam(values);
    },
  });

  const closeDialog = () => {
    formik.resetForm();
    onClose();
  };

  const createTeam = async (data: CreateTeam) => {
    setLoading(true);
    const res = await team.createTeam(data);
    if (!res.IsError) {
      showSuccessSnackbar(`Team created`);
      closeDialog();
    } else {
      showResErrorSnackbar(res);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={() => closeDialog()}>
      <form onSubmit={formik.handleSubmit} className="w-full">
        <DialogTitle style={{ width: `600px` }}>Create new Team</DialogTitle>
        <DialogContent>
          <div>
            <TextField
              // @ts-ignore
              error={formik.errors.name && formik.touched.name}
              id="name"
              label="Team Name"
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
              error={formik.errors.crest && !!formik.touched.crest}
              id="crest"
              label="Team crest"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.crest}
              margin="normal"
              variant="outlined"
              name="crest"
              fullWidth
              required
            />
            {` `}
            {formik.errors.crest && formik.touched.crest ? (
              <small className="error">{formik.errors.crest}</small>
            ) : null}
          </div>
        </DialogContent>
        <DialogActions>
          <Button type="submit" disabled={loading || !formik.isValid}>
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateTeamDialog;
