import {Dispatch} from 'redux';

import dashboard from '../../api/dashboard';
import {setDashboardInfo} from './setDashboardInfo';
import {showResErrorSnackbar} from '../utils/showSnackbar';

export const loadDashboardInfo = () => {
    return async (dispatch: Dispatch) => {
        const res = await dashboard.getDashboardInfo();
        if (!res.IsError) {
            return dispatch(setDashboardInfo(res.Result));
        } else {
            dispatch(showResErrorSnackbar(res));
        }
    }
};
