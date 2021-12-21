import React, {FC, useState} from "react";
import {ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import {LoginStackParamList} from "../../../../App";
import {RouteProp, useTheme} from "@react-navigation/native";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import * as Yup from "yup";
import {CreateUser, UserCredentials} from "../../interfaces/user.interface";
import auth from "../../api/auth";
import {setUser} from "../../actions/auth/setUser";
import {showApiErrorToast} from "../../actions/utils/showApiErrorToast";
import {Formik} from "formik";
import {StyledTextField} from "../common/StylesTextField";
import {StyledButton} from "../common/StyledButton";
import firebaseAuth from '@react-native-firebase/auth';

type ScreenNavigationProps = StackNavigationProp<LoginStackParamList, 'Signup'>;
type ScreenRouteProp = RouteProp<LoginStackParamList, 'Signup'>;

interface Props {
    navigation: ScreenNavigationProps;
    route: ScreenRouteProp;
}

const SignupScreen: FC<Props> = ({navigation, route}) => {

    const { colors } = useTheme();
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);

    const loginSchema = Yup.object({
        name: Yup
            .string()
            .required(),
        email: Yup
            .string()
            .email()
            .required(),
        password: Yup
            .string()
            .required(),
    });

    const signup = async (data) => {
        setLoading(true);
        try {
            const userCredential = await firebaseAuth().createUserWithEmailAndPassword(data.email, data.password)
            const res = await auth.createUser({
                name: data.name,
                uid: userCredential.user.uid
            });
            if (!res.IsError) {
                await firebaseAuth().signInWithCustomToken(res.Result.token);
                dispatch(setUser(res.Result));
            } else {
                dispatch(showApiErrorToast(res));
            }
        } catch (e) {
            console.error(e)
        }
        setLoading(false);
    }

    return (
        <View style={styles.mainContainer}>
            <View style={styles.form}>
                <Text style={styles.mainText}>{t('AUTH.CREATE_ACCOUNT')}</Text>
                <Formik
                    initialValues={{
                        name: '',
                        email: '',
                        password: '',
                    }}
                    validateOnMount={true}
                    validationSchema={loginSchema}
                    onSubmit={values => {
                        signup(values);
                    }}
                >
                    {({handleChange, handleBlur, handleSubmit, values, isValid}) => (
                        <View>
                            <StyledTextField
                                onChangeText={handleChange('name')}
                                onBlur={handleBlur('name')}
                                placeholder={t('AUTH.USERNAME')}
                                value={values.name}
                                placeholderTextColor={'#B5B9CA'}
                            />
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
                                {!loading ? <Text style={styles.buttonText}>{t('AUTH.SIGN_UP')}</Text>
                                    :
                                    <ActivityIndicator size="small" color="#000"/>
                                }
                            </StyledButton>
                            <TouchableOpacity disabled={loading} activeOpacity={.7} style={{marginTop: 20}}
                                              onPress={() => navigation.navigate("Login")}>
                                <Text style={styles.bottomText}>{t('AUTH.ACCOUNT_ALREADY')}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Formik>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
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
    mainText: {
        textAlign: 'center',
        fontSize: 25,
        marginBottom: 40,
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

export default SignupScreen;
