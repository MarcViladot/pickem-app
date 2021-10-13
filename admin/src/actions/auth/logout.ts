import {Dispatch} from 'redux';

export const LOGOUT = "LOGOUT";
export const logout = () => {
    return (dispatch: Dispatch) => {
        return dispatch({
            type: LOGOUT
        })
    }
}
