// Core
import React, { Component } from 'react';

// Components
import Scheduler from '../../components/Scheduler';
import { string, number } from 'prop-types';
import { Config } from '../../config';

const options = {
    api:            Config.api,
    token:          Config.token,
    messageLength:  46,
};

export default class App extends Component {

    static childContextTypes = {
        api:            string.isRequired,
        token:          string.isRequired,
        messageLength:  number.isRequired,
    };


    getChildContext () {
        return options;
    }

    render () {
        return (
            <Scheduler />
        );
    }
}
