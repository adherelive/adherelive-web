import React, { lazy, Component, Fragment } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  withRouter
} from "react-router-dom";
import SideMenu from "../../Components/Sidebar";
// import BlankState from "../../Containers/BlankState";
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

const ChatFullScreen = lazy(() =>
  import(/* webpackChunkName: "ChatFullScreen" */ "../../Containers/ChatFullScreen")
);

const TwilioVideo = lazy(() =>
  import(/* webpackChunkName: "ChatFullScreen" */ "../../Containers/ChatFullScreen/twilioVideo")
);

const PatientDetailsComp = props => {
  const { match: { params: { patient_id } = {} } = {} } = props;
  return <PatientDetails patient_id={patient_id} />;
};

class Doctors extends Component {
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
    // const {authRedirection} = this.props;
    const { redirecting = false } = this.state;
    let { location: { pathname = '' } = {} } = this.props;
    let isNotChatComponent = pathname.includes('patient-consulting') ? false : true;
    console.log('78324687234687326487326', isNotChatComponent, this.props.location, this.props.location.pathname);
    const { authRedirection } = this.props;
    return (
      <Fragment>
        <Router>
          <div className="App flex" style={{ overflow: "hidden" }}>
            {isNotChatComponent && (<SideMenu {...this.props} />)}
            <div className={isNotChatComponent ? `container` : 'container-chat-page '}>
              <Switch>
                {redirecting && redirecting.length > 0 && (<Redirect to={authRedirection} />)}
                {/* {!onboarded &&category=="doctor" && <Redirect to={PATH.REGISTER_PROFILE} />} */}
                {/*{this.state.redirecting && <Redirect to={this.state.redirecting}/>}*/}

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
                  path={PATH.PATIENT_CONSULTING}
                  component={ChatFullScreen}
                />
                <Route
                  exact
                  path={PATH.PATIENT_CONSULTING}
                  component={ChatFullScreen}
                />
                <Route
                  exact
                  path={PATH.PATIENT_CONSULTING_VIDEO}
                  component={TwilioVideo}
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
                <Route exact path="/" component={Dashboard} />
                <Route path="" component={Dashboard} />
              </Switch>
            </div>
          </div>
        </Router>
      </Fragment>
    );
  }
}

export default withRouter(Doctors);