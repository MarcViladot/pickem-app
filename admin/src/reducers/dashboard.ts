import {AnyAction} from 'redux';
import {DashboardInfo} from '../interfaces/Dashboard';
import {SET_DASHBOARD_INFO} from '../actions/dashboard/setDashboardInfo';
import {UPDATE_MATCH_DELETED} from '../actions/dashboard/updateMatchDeleted';
import {Match} from '../interfaces/League';

export interface State {
    info: DashboardInfo | null;
}

const initialState: State = {
    info: null
};

export default (state = initialState, action: AnyAction) => {
    if (action.type === SET_DASHBOARD_INFO) {
        return {
            ...state,
            info: action.payload,
        };
    } else if (action.type === UPDATE_MATCH_DELETED) {
        return {
            ...state,
            info: {
                ...state.info,
                liveMatchList: state.info?.liveMatchList.filter((m: Match) => m.id !== action.payload)
            },
        };
    }
    return state;
};
