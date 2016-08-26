import React from 'react';
import { IndexRoute, Route } from 'react-router';
import App from './components/App';

export default (store) => {

    return (
        <Route path="/router" component={App}>


        </Route>
    )
}