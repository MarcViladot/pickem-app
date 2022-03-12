import React, {FC, useState} from 'react';
import {useAuth} from '../../contexts/auth-user.context';
import {useSnackbar} from '../../contexts/snackbar.context';
import {firebaseAuth} from '../../firebase';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {Alert, Button, CircularProgress, Paper, Snackbar, TextField} from '@mui/material';

interface Credentials {
    email: string;
    password: string;
}

const Login: FC = () => {

    const [serverLoading] = useState(false);
    const { snackBar, closeSnackbar, showErrorSnackbar } = useSnackbar();

    const login = async (values: Credentials) => {
        try {
            await firebaseAuth.signInWithEmailAndPassword(
                values.email,
                values.password,
            );
        } catch (error: any) {
            showErrorSnackbar(error.code);
        }
    };

    const formik = useFormik({
        initialValues: {
            email: `john@mail.com`,
            password: `123456`,
        },
        validationSchema: Yup.object({
            email: Yup.string().email(`Invalid email`).required(`Required`),
            password: Yup.string().required(`Required`),
        }),
        onSubmit: (values) => {
            login(values);
        },
    });

    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <Paper className="w-11/12 md:w-10/12 lg:w-4/12 p-10 rounded-2xl" square>
                <h1 className="text-5xl mb-7 text-center">Sign in</h1>
                <form onSubmit={formik.handleSubmit} className="w-full">
                    <div className={`w-full`}>
                        <TextField
                            // @ts-ignore
                            error={formik.errors.email && formik.touched.email}
                            id="email"
                            label="Email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            margin="normal"
                            variant="outlined"
                            name="email"
                            fullWidth
                            required
                        />
                    </div>
                    <div className={`w-full mb-4`}>
                        <TextField
                            // @ts-ignore
                            error={formik.errors.password && !!formik.touched.password}
                            id="password"
                            label="Password"
                            type="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            margin="normal"
                            variant="outlined"
                            name="password"
                            fullWidth
                            required
                        />
                    </div>
                    <div className="mt-3">
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            className="w-full"
                            disabled={!formik.isValid || serverLoading}
                        >
                            {serverLoading ? (
                                <CircularProgress size={32} />
                            ) : (
                                <span className={`text-2xl`}>Sign in</span>
                            )}
                        </Button>
                    </div>
                </form>
            </Paper>
            <Snackbar open={snackBar.open} autoHideDuration={5000} onClose={() => closeSnackbar()}>
                <Alert variant="filled" onClose={() => closeSnackbar()} severity={snackBar.variant} sx={{ width: `100%` }}>
                    {snackBar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Login;
