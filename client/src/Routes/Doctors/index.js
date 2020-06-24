import React, { lazy, Component, Fragment } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  useLocation,
  withRouter
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

const RegisterProfile = lazy(() =>
  import(/* webpackChunkName: "RegisterProfile" */ "../../Containers/DoctorOnBoarding/profileRegister")
);

const RegisterQualifications = lazy(() =>
  import(/* webpackChunkName: "RegisterQualifications" */ "../../Containers/DoctorOnBoarding/qualificationRegister")
);

const RegisterClinics = lazy(() =>
  import(/* webpackChunkName: "RegisterClinics" */ "../../Containers/DoctorOnBoarding/clinicRegister")
);

const PatientDetailsComp = props => {
  const { match: { params: { patient_id } = {} } = {} } = props;
  return <PatientDetails patient_id={patient_id} />;
};

class Doctors extends Component {
  constructor(props) {
    super(props);
    console.log("PPROPSSS IN DOCTORRRRR ROUTERRR ---->  ", this.props);
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
    // const {authRedirection} = this.props;
    const { redirecting = false } = this.state;
    const { authRedirection, authenticated_user, users } = this.props;
    console.log("Render Props DOCTORRRRR ROUTERRR ====>    ", this.props);
    console.log('STATE OF DOCTORRRRR ROUTERRR', this.state, "     ", authRedirection);
    return (
      <Fragment>
        <Router>
          {/* <div className="App flex" style={{ overflow: "hidden" }}>
            <SideMenu {...this.props} />
            <div className="container"> */}
              <Switch>
                {redirecting && <Redirect to={authRedirection} />}
                {/* {!onboarded &&category=="doctor" && <Redirect to={PATH.REGISTER_PROFILE} />} */}
                {/*{this.state.redirecting && <Redirect to={this.state.redirecting}/>}*/}
                <Route exact path="/" component={Dashboard} />
                <Route
                  exact
                  path={PATH.PATIENT.DETAILS}
                  component={PatientDetailsComp}
                />
                <Route
                  exact
                  path={PATH.REGISTER_PROFILE}
                  component={RegisterProfile}
                />
                <Route
                  exact
                  path={PATH.REGISTER_QUALIFICATIONS}
                  component={RegisterQualifications}
                />
                <Route
                  exact
                  path={PATH.REGISTER_CLINICS}
                  component={RegisterClinics}
                />
                {/* <Route
                  exact
                  path={PATH.DASHBOARD}
                  component={Dashboard}
                /> */}

                <Route component={Dashboard} />
              </Switch>
            {/* </div>
          </div> */}
        </Router>
      </Fragment>
    );
  }
}

export default withRouter(Doctors);