import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dispatch } from "redux";
import firebaseAuth from '@react-native-firebase/auth';

export const LOGOUT = "LOGOUT";
export const logout = () => {
    return async (dispatch: Dispatch) => {
        try {
            await firebaseAuth().signOut()
            dispatch({
                type: LOGOUT
            });
        } catch (e) {
        }
    };
};
