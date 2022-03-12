import React, { FC, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
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
} from "@mui/material";
import DateTimePicker from "@material-ui/lab/DateTimePicker";
import { useQuery } from "react-query";
import {CreateMatch, Round} from '../../interfaces/League';
import league from '../../api/league';
import {useSnackbar} from '../../contexts/snackbar.context';
import team from '../../api/team';
import {Team} from '../../interfaces/Team';

interface Props {
  roundDetail: Round;
  open: boolean;
  onClose: () => void;
}

const CreateMatchDialog: FC<Props> = ({ roundDetail, open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { showResErrorSnackbar, showSuccessSnackbar } = useSnackbar();
  const { isFetching, data } = useQuery(`teams`, team.getAll, {
    onSuccess: (res) => {
      if (res.IsError) {
        showResErrorSnackbar(res);
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      localTeamId: -1,
      awayTeamId: -1,
      date: new Date(roundDetail.startingDate),
      doublePoints: false,
    },
    validationSchema: Yup.object({
      localTeamId: Yup.string().required(`Required`),
      awayTeamId: Yup.string().required(`Required`),
      date: Yup.date().required(`Required`),
      doublePoints: Yup.boolean().required(`Required`),
    }),
    onSubmit: (values) => {
      createMatch({
        ...values,
        startDate: values.date,
        roundId: roundDetail.id,
      });
    },
  });

  const closeDialog = () => {
    formik.resetForm();
    onClose();
  };

  const createMatch = async (values: CreateMatch) => {
    setLoading(true);
    const res = await league.createMatch(values);
    if (!res.IsError) {
      showSuccessSnackbar(`Match created`);
      closeDialog();
    } else {
      showResErrorSnackbar(res);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={() => closeDialog()}>
      <DialogTitle style={{ width: `600px` }}>Create new Match</DialogTitle>
      <form onSubmit={formik.handleSubmit} className="w-full">
        <DialogContent>
          <div className={`flex mb-3`}>
            <FormControl variant="outlined" className="flex-grow" style={{ marginRight: 10 }}>
              <InputLabel id="select-local">Local Team</InputLabel>
              <Select
                labelId="select-local"
                id="local"
                name="localTeamId"
                value={formik.values.localTeamId}
                // @ts-ignore
                onChange={formik.handleChange(`localTeamId`)}
                onBlur={formik.handleBlur}
                label="Local Team"
                fullWidth
                sx={{ display: `flex`, alignItems: `center` }}
                required
              >
                {data?.Result?.map((team: Team) => (
                  <MenuItem value={team.id} key={team.id} className={`flex`}>
                    <img src={team.crest} alt={team.name} style={{ height: 30 }} />
                    <span className={`ml-2`}>{team.name}</span>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined" className="flex-grow" style={{ marginLeft: 10 }}>
              <InputLabel id="select-away">Away Team</InputLabel>
              <Select
                labelId="select-away"
                id="away"
                name="awayTeamId"
                value={formik.values.awayTeamId}
                // @ts-ignore
                onChange={formik.handleChange(`awayTeamId`)}
                onBlur={formik.handleBlur}
                label="Away Team"
                fullWidth
                required
              >
                {data?.Result?.map((team: Team) => (
                  <MenuItem value={team.id} key={team.id} style={{ display: `flex` }}>
                    <img src={team.crest} alt={team.name} style={{ height: 30 }} />
                    <span className={`ml-2`}>{team.name}</span>
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
              onChange={(value) => formik.setFieldValue(`date`, value)}
              renderInput={(params: any) => <TextField className={`w-full`} {...params} />}
            />
            {` `}
            {formik.errors.date && formik.touched.date ? <small className="error">{formik.errors.date}</small> : null}
          </div>
          <div className={`mt-3 pl-3`}>
            <FormGroup>
              <FormControlLabel
                label="Double Points"
                control={
                  <Checkbox
                    name="doublePoints"
                    onChange={() => formik.setFieldValue(`doublePoints`, !formik.values.doublePoints)}
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
  );
};

export default CreateMatchDialog;
