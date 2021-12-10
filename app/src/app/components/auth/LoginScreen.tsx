import React, {FC, useState} from "react";
import {ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import * as Yup from 'yup';
import {Formik} from 'formik';
import {UserCredentials} from "../../interfaces/user.interface";
import {StyledButton} from "../common/StyledButton";
// import auth from "../../api/auth";
import {setUser} from "../../actions/auth/setUser";
import {showApiErrorToast} from "../../actions/utils/showApiErrorToast";
import {StyledTextField} from "../common/StylesTextField";
import {RouteProp} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import {LoginStackParamList} from "../../../../App";
import firebaseAuth from '@react-native-firebase/auth';
import {ResponseApiError, WebApiErrorCode} from '../../utils/IResponse';

type ScreenNavigationProps = StackNavigationProp<LoginStackParamList, 'Login'>;
type ScreenRouteProp = RouteProp<LoginStackParamList, 'Login'>;

interface Props {
    navigation: ScreenNavigationProps;
    route: ScreenRouteProp;
}

const LoginScreen: FC<Props> = ({navigation, route}) => {


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
        /*setLoading(true);
        const res = await auth.login(credentials);
        if (!res.IsError) {
          try {
            await AsyncStorage.setItem('pickem_token', res.Result.token);
          } catch (e) {
          }
          dispatch(setUser(res.Result));
        } else {
          dispatch(showApiErrorToast(res));
        }
        setLoading(false);*/
        setLoading(true);
        try {
            await firebaseAuth().signInWithEmailAndPassword(credentials.email, credentials.password)
        } catch (e) {
            dispatch(showApiErrorToast(new ResponseApiError(null, WebApiErrorCode.UserIncorrectCredentials)));
        }
        setLoading(false);
    }

    return (
        <View style={styles.mainContainer}>
            <View style={styles.form}>
                {/*<View style={{alignItems: 'center'}}>
          <Image source={{ uri: 'https://via.placeholder.com/300x100.png' }} style={styles.logo}/>
        </View>*/}
                <Text style={styles.mainText}>{t('AUTH.USE_EMAIL')}</Text>
                <Formik
                    initialValues={{
                        email: 'john@mail.com',
                        password: '123456',
                    }}
                    validateOnMount={true}
                    validationSchema={loginSchema}
                    onSubmit={values => {
                        login(values);
                    }}
                >
                    {({handleChange, handleBlur, handleSubmit, values, isValid}) => (
                        <View>
                            <StyledTextField
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                placeholder={t('AUTH.EMAIL')}
                                value={values.email}
                                placeholderTextColor={'#B5B9CA'}
                            />
                            <StyledTextField
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                placeholder={t('AUTH.PASSWORD')}
                                value={values.password}
                                placeholderTextColor={'#B5B9CA'}
                            />
                            <StyledButton activeOpacity={.8} onPress={handleSubmit} disabled={loading || !isValid}
                                          color="primary">
                                {!loading ? <Text style={styles.buttonText}>{t('AUTH.SIGN_IN')}</Text>
                                    :
                                    <ActivityIndicator size="small" color="#000"/>
                                }
                            </StyledButton>
                            <TouchableOpacity disabled={false} activeOpacity={.7} style={{marginTop: 20}}
                                              onPress={() => navigation.navigate('Signup')}>
                                <Text style={styles.bottomText}>{t('AUTH.ACCOUNT_YET')}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Formik>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    // LOGIN
    logo: {
        width: 250,
        height: 50,
    },
    mainContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        backgroundColor: '#FFF'
    },
    form: {
        minWidth: 320,
        width: '70%',
    },
    upperLogo: {
        width: '100%',
        height: 70,
    },
    mainText: {
        color: '#000',
        fontSize: 25,
        textAlign: 'center',
        marginBottom: 40,
        // marginTop: 60,
    },
    bottomText: {
        color: '#3CBC79',
        textAlign: "center",
        fontWeight: "bold"
    },
    buttonText: {
        fontSize: 17,
        color: 'white',
    }
});


export default LoginScreen;
