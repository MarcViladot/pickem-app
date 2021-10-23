import {applyMiddleware, createStore} from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './src/app/reducers'


const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
