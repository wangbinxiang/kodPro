import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';

export default function createStore(history, data) {
    const reduxRouterMiddleware = routerMiddleware(history);

    const middleware = [reduxRouterMiddleware];

    let finalCreateStore;

    finalCreateStore = applyMiddleware(...middleware)(_createStore);

    const reducer = require('./reducers/index');

    const store = finalCreateStore(reducer, data);

    return store;
}