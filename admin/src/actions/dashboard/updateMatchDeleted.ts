import {DashboardInfo} from '../../interfaces/Dashboard';

export const UPDATE_MATCH_DELETED = "UPDATE_MATCH_DELETED";
export const updateMatchDeleted = (matchId: number) => {
    return {
        type: UPDATE_MATCH_DELETED,
        payload: matchId
    }
};
