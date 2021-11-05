import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/app/components/auth/LoginScreen";
import DrawerNavigator from "./src/app/components/DrawerNavigator";
import SignupScreen from "./src/app/components/auth/SignupScreen";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./src/app/reducers";
import Toast from 'react-native-toast-message';
import {setCustomText} from 'react-native-global-props';
import auth from "./src/app/api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showApiErrorToast } from "./src/app/actions/utils/showApiErrorToast";
import { setUser } from "./src/app/actions/auth/setUser";


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

  const dispatch = useDispatch();
  const isLogged = useSelector((state: RootState) => state.user.isLoggedIn);
  const [loading, setLoading] = useState(true);

  useEffect(() => { // TRY LOGIN
        async function tryLogin() {
            try {
                const token = await AsyncStorage.getItem('pickem_token');
                if (token) {
                    try {
                        const res = await auth.autoLogin();
                        if (!res.IsError) {
                            dispatch(setUser(res.Result));
                            setLoading(false);
                        } else {
                            setLoading(false);
                            dispatch(showApiErrorToast(res));
                        }
                    } catch (e) {
                        setLoading(false);
                    }
                } else {
                    // NOT LOGGED
                    setLoading(false);
                }
            } catch (e) {
                setLoading(false);
            }
        }

        if (!isLogged) {
            tryLogin();
        } else {
            setLoading(false);
        }
    }, []);

  if (loading) {
    return <></>;
  }

  const toastConfig = {
    apiError: ({text1}: {text1: string}) => (
      <View style={[styles.toastContainer, styles.toastError]}>
        <Text style={styles.toastText}>{text1}</Text>
      </View>
    ),
    serverError: ({text1}: {text1: string}) => (
      <View style={[styles.toastContainer, styles.toastError]}>
          <Text style={styles.toastText}>{text1}</Text>
      </View>
    ),
    success: ({text1}: {text1: string}) => (
      <View style={[styles.toastContainer, styles.toastSuccess]}>
          <Text style={styles.toastText}>{text1}</Text>
      </View>
    ),
  };

  return (
    <>
      <NavigationContainer>
        {
          !isLogged ?
            <LoginStack.Navigator screenOptions={{
              animationTypeForReplace: "pop",
              headerShown: false
            }}>
              <LoginStack.Screen name={"Login"} component={LoginScreen} />
              <LoginStack.Screen name={"Signup"} component={SignupScreen} />
            </LoginStack.Navigator>
            :
            <DrawerNavigator />
        }
      </NavigationContainer>
      <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)}/>
    </>
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
