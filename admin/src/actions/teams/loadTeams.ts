import {Dispatch} from 'redux';
import team from '../../api/team';
import {setTeams} from './setTeams';

export const loadTeams = () => {
    return async (dispatch: Dispatch) => {
        const res = await team.getAllTeams();
        if (!res.IsError) {
            return dispatch(setTeams(res.Result));
        } else {
            // TODO SHOW ERROR
        }
    }
};
