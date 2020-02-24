import React, {Component, Fragment} from 'react';
import {BrowserRouter as Router} from "react-router-dom";
import { injectIntl } from "react-intl";
import Routes from "./Containers/Routes";

class AppWrapper extends Component {
    render() {
        return (
            <Router>
                    <Routes/>
            </Router>
        );
    }
}

export default injectIntl(AppWrapper);
