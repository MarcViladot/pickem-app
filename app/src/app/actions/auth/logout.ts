import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dispatch } from "redux";

export const LOGOUT = "LOGOUT";
export const logout = () => {
    return async (dispatch: Dispatch) => {
        try {
            await AsyncStorage.removeItem('pickem_token');
            dispatch({
                type: LOGOUT
            });
        } catch (e) {
        }
    };
};
