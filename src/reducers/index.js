import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-connect';
import todos from './todos';
import visibilityFilter from './visibilityFilter';

export default combineReducers({
    routing: routerReducer,
    reduxAsyncConnect,
    todos,
    visibilityFilter
});

