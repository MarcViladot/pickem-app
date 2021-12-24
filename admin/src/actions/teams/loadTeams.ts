import {Dispatch} from 'redux';
import team from '../../api/team';
import {setTeams} from './setTeams';
import {showResErrorSnackbar} from '../utils/showSnackbar';

export const loadTeams = () => {
    return async (dispatch: Dispatch) => {
        const res = await team.getAll();
        if (!res.IsError) {
            return dispatch(setTeams(res.Result));
        } else {
            dispatch(showResErrorSnackbar(res));
        }
    }
};
