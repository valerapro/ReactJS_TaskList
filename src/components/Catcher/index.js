//Core
import React, { Component } from 'react';

//Components
import { object } from 'prop-types';
import Styles from './styles.scss';

export default class Catcher extends Component {
    static propTypes = {
        children: object.isRequired,
    };

    state = {
        hasError: false,
    };

    componentDidCatch (hasError, stack) {
        this.setState({
            hasError: true
        });
    }

    render () {
        const { hasError } = this.state;
        const { children } = this.props;

        if(hasError) {
            return  <section className = { Styles.catcher }>
                <span>A mysterious 👽 &nbsp;error 📛 &nbsp;occured.</span>
                <p>
                    Our space 🛰 &nbsp;engineers strike team 👩🏼‍🚀 👨🏼‍🚀
                    &nbsp;is already working 🚀 &nbsp;in order to fix that
                    for you!
                </p>
            </section>;

        }

        return children;
    }
}