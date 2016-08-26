import React, { Component, PropTypes } from 'react';
import { asyncConnect } from 'redux-connect';


@asyncConnect([{
    key: 'lunch',
    promise: (params, helpers) => {
        console.log(params);
        console.log(123);
        console.log(helpers);
        return Promise.resolve({ id: 1, name: 'Borsch' });
    }
}])
export default class Connect extends Component {
    render() {
        const lunch = this.props.lunch
        console.log(lunch);
        return (
            <div></div>
        );    
    }
}