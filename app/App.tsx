import React, {createContext, useEffect, useState} from "react";
import {LogBox, SafeAreaView, StyleSheet, Text, useColorScheme, View} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import LoginScreen from "./src/app/components/auth/LoginScreen";
import DrawerNavigator from "./src/app/components/DrawerNavigator";
import SignupScreen from "./src/app/components/auth/SignupScreen";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "./src/app/reducers";
import Toast from 'react-native-toast-message';
import {setCustomText} from 'react-native-global-props';
import firebaseAuth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import auth from "./src/app/api/auth";
import {showApiErrorToast} from './src/app/actions/utils/showApiErrorToast';
import {ResponseApi} from './src/app/utils/IResponse';
import {User} from './src/app/interfaces/user.interface';
import {setUser} from './src/app/actions/auth/setUser';
import {DarkTheme, LightTheme, ThemeContext} from './themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ThemeProvider} from 'styled-components';
import {setLanguage} from './src/app/actions/utils/setLanguage';
import i18n from './i18n';

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
    'Require cycle: node_modules/axios/lib/defaults.js -> node_modules/axios/lib/adapters/xhr.js -> node_modules/axios/lib/defaults.js'
]);

setCustomText({
    style: {
        fontFamily: 'ProximaNova-Bold',
        color: '#000'
    },
});

export type LoginStackParamList = {
    Login: undefined;
    Signup: undefined;
};
const LoginStack = createStackNavigator<LoginStackParamList>();

const App = () => {

    const scheme = useColorScheme()
    const dispatch = useDispatch();
    const isLogged = useSelector((state: RootState) => state.user.isLoggedIn);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState('dark');
    const themeData = {theme, setTheme};
    const currentLang = useSelector((state: RootState) => state.utils.currentLang);

    const setStoredTheme = async () => {
        const storedTheme = await AsyncStorage.getItem('pickem_theme');
        if (storedTheme) {
            setTheme(storedTheme);
        } else {
            setTheme(scheme);
        }
    }

    const setCurrentLang = async (lang: string) => {
        const changeLanguage = async (lang: string) => {
            await i18n.changeLanguage(lang);
            dispatch(setLanguage(lang));
        }
        if (!lang) {
            const storedLang = await AsyncStorage.getItem('pickem_lang');
            if (!storedLang) {
                changeLanguage('en')
            } else {
                changeLanguage(storedLang);
            }
        } else {
            changeLanguage(lang);
        }
    }

    useEffect(() => {
        setStoredTheme();
        setCurrentLang(currentLang)
    }, []);

    useEffect(() => {
        const isNewUser = (user) => user.metadata.lastSignInTime === user.metadata.creationTime;
        const subscriber = firebaseAuth().onAuthStateChanged((user) => {
            // console.warn(`login state change: ${!!user ? 'logged' : 'not logged'}`);
            if (user && !isLogged) {
                if (!isNewUser(user)) {
                    getCurrentUser();
                }
            } else {
                setLoading(false);
            }
        });
        return subscriber; // unsubscribe on unmount
    }, []);

    const getCurrentUser = async () => {
        const res = await auth.autoLogin() as ResponseApi<User>;
        if (!res.IsError) {
            if (!!res.Result) {
                await firebaseAuth().signInWithCustomToken(res.Result.token);
                dispatch(setUser(res.Result));
            }
            setLoading(false);
        } else {
            firebaseAuth().signOut();
            setLoading(false);
            dispatch(showApiErrorToast(res));
        }
    };

    if (loading) {
        return <></>;
    }

    const toastConfig = {
        apiError: ({text1}: { text1: string }) => (
            <View style={[styles.toastContainer, styles.toastError]}>
                <Text style={styles.toastText}>{text1}</Text>
            </View>
        ),
        serverError: ({text1}: { text1: string }) => (
            <View style={[styles.toastContainer, styles.toastError]}>
                <Text style={styles.toastText}>{text1}</Text>
            </View>
        ),
        success: ({text1}: { text1: string }) => (
            <View style={[styles.toastContainer, styles.toastSuccess]}>
                <Text style={styles.toastText}>{text1}</Text>
            </View>
        ),
    };

    return (
        <ThemeContext.Provider value={themeData}>
            <ThemeProvider theme={theme === 'dark' ? DarkTheme : LightTheme}>
                <NavigationContainer theme={theme === 'dark' ? DarkTheme : LightTheme}>
                    {
                        !isLogged ?
                            <LoginStack.Navigator screenOptions={{
                                animationTypeForReplace: "pop",
                                headerShown: false
                            }}>
                                <LoginStack.Screen name={"Login"} component={LoginScreen}/>
                                <LoginStack.Screen name={"Signup"} component={SignupScreen}/>
                            </LoginStack.Navigator>
                            :
                            <DrawerNavigator/>
                    }
                </NavigationContainer>
                <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)}/>
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

const styles = StyleSheet.create({
    toastContainer: {
        width: '90%',
        backgroundColor: '#FFF',
        elevation: 2,
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    toastText: {
        flex: 1,
        marginRight: 10,
        color: '#FFF',
        fontSize: 14,
    },
    toastError: {
        backgroundColor: '#FF1E44'
    },
    toastSuccess: {
        backgroundColor: '#38b174'
    }
});

export default App;
