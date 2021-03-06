import React, {useEffect, useState} from "react";
import {loadLeagues} from "../../actions/league/loadLeagues";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../reducers";
import {Button, IconButton, Paper, TextField, Tooltip} from "@mui/material";
import {CreateLeague, League} from "../../interfaces/League";
import {Add} from "@mui/icons-material";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {useFormik} from "formik";
import * as Yup from "yup";
import league from "../../api/league";
import {setLeagues} from "../../actions/league/setLeagues";
import {useHistory} from "react-router";
import {showResErrorSnackbar} from '../../actions/utils/showSnackbar';
import useMobileView from '../../utils/UseMobileView';

const Leagues = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const leagues = useSelector((state: RootState) => state.league.leagues);
    const loading = useSelector((state: RootState) => state.utils.showProgressBar);
    const [newLeagueDialogVisible, setNewLeagueDialogVisible] = useState(false);
    const [isMobile] = useMobileView();

    useEffect(() => {
        if (!leagues.length) {
            dispatch(loadLeagues());
        }
    }, []);

    const formik = useFormik({
        initialValues: {
            name: "",
            logo: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Required"),
            logo: Yup.string().required("Required"),
        }),
        onSubmit: (values) => {
            createLeague(values);
        },
    });

    const createLeague = async (data: CreateLeague) => {
        const res = await league.createLeague(data);
        if (!res.IsError) {
            dispatch(setLeagues(res.Result));
            setNewLeagueDialogVisible(false);
            formik.resetForm();
        } else {
            dispatch(showResErrorSnackbar(res));
        }
    };

    return (
        <>
            <Dialog
                open={newLeagueDialogVisible}
                onClose={() => setNewLeagueDialogVisible(false)}
            >
                <form onSubmit={formik.handleSubmit} className="w-full">
                    <DialogTitle style={{width: "600px"}}>
                        Create new League
                    </DialogTitle>
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
                            />{" "}
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
                            />{" "}
                            {formik.errors.logo && formik.touched.logo ? (
                                <small className="error">{formik.errors.logo}</small>
                            ) : null}
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setNewLeagueDialogVisible(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading || !formik.isValid}>
                            Create
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <div className={"flex flex-wrap flex-col sm:flex-row"}>
                {leagues.map((league: League) => (
                    <Paper
                        onClick={() => history.push(`/leagues/${league.id}`)}
                        key={league.id}
                        className={"flex items-center flex-row sm:flex-col items-center p-3 sm:p-5 sm:mr-5 mb-3 sm:mb-5 cursor-pointer"}
                    >
                        <div
                            style={{height: isMobile ? 60 : 100}}
                            className={
                                "bg-white rounded-full flex items-center justify-center overflow-hidden border-4 border-indigo-600"
                            }
                        >
                            <img
                                src={league.logo}
                                alt={league.name}
                                className={"w-full h-full"}
                            />
                        </div>
                        <div className={"text-xl sm:text-3xl sm:mt-5 ml-3 sm:ml-0"}>{league.name}</div>
                    </Paper>
                ))}
                <Paper className={"p-5 mb-5 flex flex-col justify-center"}>
                    <Tooltip title="New League" aria-label="add">
                        <IconButton onClick={() => setNewLeagueDialogVisible(true)}>
                            <Add/>
                        </IconButton>
                    </Tooltip>
                </Paper>
            </div>
        </>
    );
};

export default Leagues;
