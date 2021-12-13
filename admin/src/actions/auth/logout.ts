import {Dispatch} from 'redux';
import {firebaseAuth} from '../../firebase';


export const LOGOUT = "LOGOUT";
export const logout = () => {
    return async (dispatch: Dispatch) => {
        await firebaseAuth.signOut();
        return dispatch({
            type: LOGOUT
        })
    }
}
