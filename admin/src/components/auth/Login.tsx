import React from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';
import {login} from '../../actions/auth/login';
import {Button, TextField} from '@mui/material';

const Login = () => {

    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            email: 'john@email.com',
            password: 'changeme'
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
            dispatch(login(values))
        }
    });


    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div className="flex flex-col items-center">
                <img src="https://via.placeholder.com/350x60" alt={"logo"}/>
                <h1 className="text-5xl mt-10 mb-7">Sign in</h1>
                <form onSubmit={formik.handleSubmit} className="w-full">
                    <div>
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
                            required/> {formik.errors.email && formik.touched.email
                        ? (
                            <small className="error">{formik.errors.email}</small>
                        )
                        : null}
                    </div>
                    <div>
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
                            required/> {formik.errors.password && formik.touched.password
                        ? (
                            <small className="error">{formik.errors.password}</small>
                        )
                        : null}
                    </div>
                    <div className="mt-3">
                        <Button variant="contained" color="primary" type="submit" className="w-full"
                                disabled={!formik.isValid}>Sign in</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
