import {League} from '../../interfaces/League';

export const SET_LEAGUES = "SET_LEAGUES";
export const setLeagues = (leagues: League[]) => {
    return {
        type: SET_LEAGUES,
        payload: leagues
    }
};
