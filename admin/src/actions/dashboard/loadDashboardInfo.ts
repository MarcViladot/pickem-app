import {Dispatch} from 'redux';

import dashboard from '../../api/dashboard';
import {setDashboardInfo} from './setDashboardInfo';

export const loadDashboardInfo = () => {
    return async (dispatch: Dispatch) => {
        const res = await dashboard.getDashboardInfo();
        if (!res.IsError) {
            return dispatch(setDashboardInfo(res.Result));
        } else {
            // TODO SHOW ERROR
        }
    }
};
