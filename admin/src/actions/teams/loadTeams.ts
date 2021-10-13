import {Dispatch} from 'redux';
import league from '../../api/league';
import {showBar} from '../utils/showBar';
import {hideBar} from '../utils/hideBar';
import team from '../../api/team';
import {setTeams} from './setTeams';

export const loadTeams = () => {
    return async (dispatch: Dispatch) => {
        dispatch(showBar());
        const res = await team.getAllTeams();
        dispatch(hideBar());
        if (!res.IsError) {
            return dispatch(setTeams(res.Result));
        } else {
            // TODO SHOW ERROR
        }
    }
};
