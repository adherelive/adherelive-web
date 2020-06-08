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

const PatientDetails = lazy(() =>
  import(
    /* webpackChunkName: "PatientDetails" */ "../../Containers/Patient/details"
  )
);

const Dashboard = lazy(() =>
  import(/* webpackChunkName: "Dashboard" */ "../../Containers/Dashboard")
);

const PatientDetailsComp = props => {
  const { match: { params: { id } = {} } = {} } = props;
  return <PatientDetails id={id} />;
};

export default class Authenticated extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirecting: this.props.authRedirection
    };
  }

  componentDidMount() {
    this.setState((prevState, prevProps) => {
      return {
        redirecting: false
      };
    });
  }

  render() {
      const {authRedirection} = this.props;
    const { redirecting } = this.state;

    return (
      <Fragment>
        <Router>
          <div className="App flex" style={{ overflow: "hidden" }}>
            <SideMenu {...this.props} />
            <div className="container">
              <Switch>
                {redirecting && <Redirect to={authRedirection} />}
                {/*{this.state.redirecting && <Redirect to={this.state.redirecting}/>}*/}
                <Route
                  exact
                  path={PATH.PATIENT.DETAILS}
                  component={PatientDetailsComp}
                />
                <Route path="" component={Dashboard} />
                {/*<Route path="" component={Dashboard} />*/}
              </Switch>
            </div>
          </div>
        </Router>
      </Fragment>
    );
  }
}
