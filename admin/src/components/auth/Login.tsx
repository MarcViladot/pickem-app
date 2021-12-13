import React from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {Button, CircularProgress, Paper, TextField} from '@mui/material';
import {firebaseAuth} from '../../firebase';
import {useSelector} from 'react-redux';
import {RootState} from '../../reducers';

interface Credentials {
    email: string;
    password: string;
}

const Login = () => {

    const loading = useSelector((state: RootState) => state.utils.showProgressBar);

    const login = async (values: Credentials) => {
        try {
            firebaseAuth.signInWithEmailAndPassword(values.email, values.password);
        } catch (e) {
            // DISPATCH ERROR
        }
    }

    const formik = useFormik({
        initialValues: {
            email: 'john@mail.com',
            password: '123456'
        },
        validationSchema: Yup.object({
            email: Yup
                .string()
                .email('Invalid email')
                .required('Required'),
            password: Yup
                .string()
                .required('Required')
        }),
        onSubmit: values => {
            login(values);
        }
    });


    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <Paper className="flex flex-col items-center sm:w-12/12 md:w-12/12 lg:w-3/12 p-10 rounded-2xl" square>
                <h1 className="text-5xl mb-7">Sign in</h1>
                <form onSubmit={formik.handleSubmit} className="w-full">
                    <div className={"w-full"}>
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
                            required/>
                    </div>
                    <div className={"w-full mb-4"}>
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
                            required/>
                    </div>
                    <div className="mt-3">
                        <Button variant="contained" color="primary" type="submit" className="w-full"
                                disabled={!formik.isValid || loading}>
                            {loading ?
                                <CircularProgress size={32}/>
                                :
                                <span className={"text-2xl"}>Sign in</span>
                            }
                        </Button>
                    </div>
                </form>
            </Paper>
        </div>
    );
};

export default Login;
