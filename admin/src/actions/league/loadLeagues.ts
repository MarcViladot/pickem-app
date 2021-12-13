import {Dispatch} from 'redux';
import league from '../../api/league';
import {setLeagues} from './setLeagues';

export const loadLeagues = () => {
    return async (dispatch: Dispatch) => {
        const res = await league.getAllLeagues();
        console.log(res);
        if (!res.IsError) {
            return dispatch(setLeagues(res.Result));
        } else {
            // TODO SHOW ERROR
        }
    }
};
