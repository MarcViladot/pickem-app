import React, { FC, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useQueryClient } from "react-query";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import {useSnackbar} from '../../contexts/snackbar.context';
import {TranslationGroupDto} from '../../interfaces/League';
import translations from '../../api/translations';

interface Props {
  open: boolean;
  onClose: () => void;
}

const NewTranslationDialog: FC<Props> = ({ open, onClose }) => {

  const queryClient = useQueryClient();
  const { showResErrorSnackbar, showSuccessSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: ``,
      textEn: ``,
      textEs: ``,
    },
    validationSchema: Yup.object({
      name: Yup.string().required(`Required`),
      textEn: Yup.string().required(`Required`),
      textEs: Yup.string().required(`Required`),
    }),
    onSubmit: ({ name, textEn, textEs }) => {
      createGroup(name, textEn, textEs);
    },
  });

  const closeDialog = () => {
    formik.resetForm();
    onClose();
  };

  const createGroup = async (name: string, textEn: string, textEs: string) => {
    const data: TranslationGroupDto = {
      name,
      rounds: [
        {
          lang: `en`,
          text: textEn,
        },
        {
          lang: `es`,
          text: textEs,
        },
      ],
    };
    setLoading(true);
    const res = await translations.newTranslationGroup(data);
    if (!res.IsError) {
      showSuccessSnackbar(`Translation group created`);
      queryClient.invalidateQueries(`translations`);
      closeDialog();
    } else {
      showResErrorSnackbar(res);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={() => closeDialog()}>
      <form onSubmit={formik.handleSubmit} className="w-full">
        <DialogTitle style={{ width: `600px` }}>Create translation group</DialogTitle>
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
            />
            {` `}
            {formik.errors.name && formik.touched.name ? <small className="error">{formik.errors.name}</small> : null}
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
            />
            {` `}
            {formik.errors.textEn && formik.touched.textEn ? <small className="error">{formik.errors.textEn}</small> : null}
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
            />
            {` `}
            {formik.errors.textEs && formik.touched.textEs ? <small className="error">{formik.errors.textEs}</small> : null}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => closeDialog()}>Cancel</Button>
          <Button type="submit" disabled={loading || !formik.isValid}>
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NewTranslationDialog;
