import {combineReducers} from 'redux'
import user from './user'
import utils from './utils'
import modal from './modal'
import league from './league'
import team from './team'
import dashboard from './dashboard'
import translations from './translations';

const rootReducer =  combineReducers({user, utils, modal, league, team, dashboard, translations});
export type RootState = ReturnType<typeof rootReducer>
export default rootReducer;
