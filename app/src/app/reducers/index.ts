import {combineReducers} from 'redux';
import user from './user';
import utils from './utils';

const rootReducer = combineReducers({user, utils});
export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;
