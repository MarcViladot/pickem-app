import {Team} from '../../interfaces/Team';

export const SET_TEAMS = "SET_TEAMS";
export const setTeams = (teams: Team[]) => {
    return {
        type: SET_TEAMS,
        payload: teams
    }
};
