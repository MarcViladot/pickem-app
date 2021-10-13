import {Dispatch} from 'redux';
import {showBar} from '../utils/showBar';
import {hideBar} from '../utils/hideBar';

import dashboard from '../../api/dashboard';
import {setDashboardInfo} from './setDashboardInfo';

export const loadDashboardInfo = () => {
    return async (dispatch: Dispatch) => {
        dispatch(showBar());
        const res = await dashboard.getDashboardInfo();
        dispatch(hideBar());
        if (!res.IsError) {
            return dispatch(setDashboardInfo(res.Result));
        } else {
            // TODO SHOW ERROR
        }
    }
};
