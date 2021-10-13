import {AnyAction} from 'redux';
import {SET_LEAGUES} from '../actions/league/setLeagues';
import {League} from '../interfaces/League';

export interface State {
    leagues: League[];
}

const initialState: State = {
    leagues: [],
};

export default (state = initialState, action: AnyAction) => {
    if (action.type === SET_LEAGUES) {
        return {
            ...state,
            leagues: action.payload,
        };
    }
    return state;
};
