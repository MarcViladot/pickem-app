import {AnyAction} from 'redux';
import {SET_LEAGUES} from '../actions/league/setLeagues';
import {Team} from '../interfaces/Team';
import {SET_TEAMS} from '../actions/teams/setTeams';

export interface State {
    all: Team[];
}

const initialState: State = {
    all: [],
};

export default (state = initialState, action: AnyAction) => {
    if (action.type === SET_TEAMS) {
        return {
            ...state,
            all: action.payload,
        };
    }
    return state;
};
