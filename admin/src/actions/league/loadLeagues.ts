import {Dispatch} from 'redux';
import league from '../../api/league';
import {setLeagues} from './setLeagues';
import {showResErrorSnackbar} from '../utils/showSnackbar';

export const loadLeagues = () => {
    return async (dispatch: Dispatch) => {
        const res = await league.getAllLeagues();
        console.log(res);
        if (!res.IsError) {
            return dispatch(setLeagues(res.Result));
        } else {
            dispatch(showResErrorSnackbar(res));
        }
    }
};
