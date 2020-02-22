import React, { lazy, Component, Fragment } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import BlankState from "../../Containers/BlankState";
import {PATH} from "../../constant";

const Patients = lazy(() => import(/* webpackChunkName: "Patients" */"../Patients"));

export default class Authenticated extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirecting: this.props.authRedirection
        };
    }
    render() {
        return (
            <Fragment>
                {/*<MedicationReminder />*/}
                <Router>
                    <Switch>
                        {/*{this.state.redirecting && this.state.redirecting.length > 0 && (*/}
                        {/*    <Redirect to={this.state.redirecting} />*/}
                        {/*)}*/}
                        {/*{this.props.unauthorizedError && (*/}
                        {/*    <Route path="" component={BlankState} />*/}
                        {/*)}*/}
                        <Route path={PATH.PATIENT.ROOT} component={Patients} />


                        <Route path="" component={BlankState} />
                    </Switch>
                </Router>
            </Fragment>
        );
    }
}