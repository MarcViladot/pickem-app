import React, { useState } from "react";
import {ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from 'yup';
import {Formik} from 'formik';
import { UserCredentials } from "../../interfaces/user.interface";
import { StyledButton } from "../common/StyledButton";
import auth from "../../api/auth";
import { setUser } from "../../actions/auth/setUser";
import { showApiErrorToast } from "../../actions/utils/showApiErrorToast";


const LoginScreen = () => {


  const {t} = useTranslation();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const loginSchema = Yup.object({
    email: Yup
      .string()
      .email()
      .required(),
    password: Yup
      .string()
      .required(),
  });

  const login = async (credentials: UserCredentials) => {
    setLoading(true);
    const res = await auth.login(credentials);
    console.warn(JSON.stringify(res));
    if (!res.IsError) {
      dispatch(setUser(res.Result));
    } else {
      dispatch(showApiErrorToast(res));
    }
    setLoading(false);
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.form}>
        <View style={{alignItems: 'center'}}>
          <Image source={{ uri: 'https://via.placeholder.com/300x100.png' }} style={styles.logo}/>
        </View>
        <Text style={styles.mainText}>{t('AUTH.SIGN_IN')}</Text>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validateOnMount={true}
          validationSchema={loginSchema}
          onSubmit={values => {
            dispatch(login(values));
          }}
        >
          {({handleChange, handleBlur, handleSubmit, values, isValid}) => (
            <View>
              <TextInput
                style={styles.textField}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                placeholder={t('AUTH.USERNAME')}
                value={values.email}
              />
              <TextInput
                style={styles.textField}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                placeholder={t('AUTH.PASSWORD')}
                value={values.password}
              />
              <StyledButton activeOpacity={.8} onPress={handleSubmit} disabled={loading || !isValid} color="primary">
                {!loading ? <Text style={styles.buttonText}>{t('AUTH.SIGN_IN')}</Text>
                  :
                  <ActivityIndicator size="small" color="#0000ff"/>
                }
              </StyledButton>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // SHEET
  warehouseItem: {
    padding: 10,
    paddingLeft: 15,
    borderBottomWidth: .3,
    borderColor: '#bdbdbd',
  },
  // LOGIN
  logo: {
    width: 250,
    height: 50,
  },
  mainContainer: {
    marginTop: -20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  form: {
    minWidth: 320,
    width: '60%',
  },
  upperLogo: {
    width: '100%',
    height: 70,
  },
  mainText: {
    color: '#004C9C',
    textAlign: 'center',
    fontSize: 40,
    marginBottom: 60,
    marginTop: 60,
  },
  textField: {
    minWidth: '100%',
    maxWidth: '100%',
    marginBottom: 20,
    borderWidth: 1,
    fontSize: 20,
    borderColor: 'gray',
    paddingLeft: 10,
    height: 50,
    borderRadius: 4,
  },
  submitButton: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#005EAD',
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
  },
  errorAlert: {
    marginTop: 30,
    backgroundColor: '#f8d7da',
    borderRadius: 10,
    minWidth: '100%',
    maxWidth: '100%',
    minHeight: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorAlertText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#721c24',
  },
});


export default LoginScreen;
