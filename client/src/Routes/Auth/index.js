import React, { lazy, Component, Fragment } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import BlankState from "../../Containers/BlankState";
import { PATH } from "../../constant";

const Patients = lazy(() =>
  import(/* webpackChunkName: "Patients" */ "../Patients")
);

const Dashboard = lazy(() =>
  import(/* webpackChunkName: "Dashboard" */ "../../Containers/Dashboard")
);

export default class Authenticated extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirecting: this.props.authRedirection
        };
    }
    render() {
        return (
                <Router>
                    <Switch>
                        <Route path={PATH.PATIENT.ROOT} component={Patients} />
                        <Route path="" component={BlankState} />
                    </Switch>
                </Router>
        );
    }
}
