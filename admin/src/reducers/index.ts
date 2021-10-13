import {combineReducers} from 'redux'
import user from './user'
import utils from './utils'
import modal from './modal'
import league from './league'
import team from './team'
import dashboard from './dashboard'

const rootReducer =  combineReducers({user, utils, modal, league, team, dashboard});
export type RootState = ReturnType<typeof rootReducer>
export default rootReducer;
