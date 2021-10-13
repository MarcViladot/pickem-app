import {DashboardInfo} from '../../interfaces/Dashboard';

export const SET_DASHBOARD_INFO = "SET_DASHBOARD_INFO";
export const setDashboardInfo = (payload: DashboardInfo) => {
    return {
        type: SET_DASHBOARD_INFO,
        payload
    }
};
