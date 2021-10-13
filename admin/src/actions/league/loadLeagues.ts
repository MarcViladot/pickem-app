import {Dispatch} from 'redux';
import league from '../../api/league';
import {setLeagues} from './setLeagues';
import {showBar} from '../utils/showBar';
import {hideBar} from '../utils/hideBar';

export const loadLeagues = () => {
    return async (dispatch: Dispatch) => {
        dispatch(showBar());
        const res = await league.getAllLeagues();
        console.log(res);
        dispatch(hideBar());
        if (!res.IsError) {
            return dispatch(setLeagues(res.Result));
        } else {
            // TODO SHOW ERROR
        }
    }
};
