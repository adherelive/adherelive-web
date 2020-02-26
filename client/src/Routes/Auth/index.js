import React, { lazy, Component, Fragment } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import SideMenu from "../../Components/Sidebar";
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
      <Fragment>
        <div className="App flex" style={{ overflow: "hidden" }}>
          <SideMenu {...this.props} />
          <div className="container">
            <Router>
              <Switch>
                <Route path={PATH.PATIENT.PA} component={Patients} />

                <Route path={PATH.LANDING_PAGE} component={Dashboard} />
                <Route path="" component={BlankState} />
              </Switch>
            </Router>
          </div>
        </div>
      </Fragment>
    );
  }
}
