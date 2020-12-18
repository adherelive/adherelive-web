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
  import(
    /* webpackChunkName: "RegisterProfile" */ "../../Containers/DoctorOnBoarding/profileRegister"
  )
);

const RegisterQualifications = lazy(() =>
  import(
    /* webpackChunkName: "RegisterQualifications" */ "../../Containers/DoctorOnBoarding/qualificationRegister"
  )
);

const RegisterClinics = lazy(() =>
  import(
    /* webpackChunkName: "RegisterClinics" */ "../../Containers/DoctorOnBoarding/clinicRegister"
  )
);

const ChatFullScreen = lazy(() =>
  import(
    /* webpackChunkName: "ChatFullScreen" */ "../../Containers/ChatFullScreen"
  )
);

const TwilioVideo = lazy(() =>
  import(
    /* webpackChunkName: "TwilioVideo" */ "../../Containers/ChatFullScreen/twilioVideo"
  )
);

const DoctorProfilePage = lazy(() =>
  import(
    /* webpackChunkName: "DoctorProfilePage" */ "../../Containers/Pages/doctorProfilePage"
  )
);

const DoctorSettingsePage = lazy(() =>
  import(
    /* webpackChunkName: "DoctorSettingsePage" */ "../../Containers/Pages/doctorSettingsPage"
  )
);

const TermsOfService = lazy(() =>
  import(
    /* webpackChunkName: "TermsOfServicePage" */ "../../Containers/Pages/TermsOfService"
  )
);

const PrivacyPolicy = lazy(() =>
  import(
    /* webpackChunkName: "PrivacyPolicyPage" */ "../../Containers/Pages/PrivacyPolicy"
  )
);

const PatientDetailsComp = props => {
  const { match: { params: { patient_id } = {} } = {} } = props;
  return <PatientDetails patient_id={patient_id} />;
};

const SideMenuComp = props => {
  const { location: { pathname = "" } = {} } = props;
  // console.log("102938138932 sidemenu component --> ", {props});
  if (
    !(
      pathname.includes("patient-consulting") ||
      pathname.includes("terms-of-service") ||
      pathname.includes("privacy-policy")
    )
  ) {
    return <SideMenu {...props} />;
  } else {
    return null;
  }
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
    let { location: { pathname = "" } = {} } = this.props;
    let isNotChatComponent = !(
      pathname.includes("patient-consulting") ||
      pathname.includes("terms-of-service") ||
      pathname.includes("privacy-policy")
    );
    const { authRedirection } = this.props;
    return (
      <Fragment>
        <Router>
          <div className="App flex" style={{ overflow: "hidden" }}>
            <SideMenuComp {...this.props} />
            <div
              className={
                isNotChatComponent ? `container` : "container-chat-page "
              }
            >
              <Switch>
                {redirecting && redirecting.length > 0 && (
                  <Redirect to={authRedirection} />
                )}
                {/* {!onboarded &&category=="doctor" && <Redirect to={PATH.REGISTER_PROFILE} />} */}
                {/*{this.state.redirecting && <Redirect to={this.state.redirecting}/>}*/}
                <Route
                  exact
                  path={PATH.TERMS_OF_SERVICE}
                  component={TermsOfService}
                />
                <Route
                  exact
                  path={PATH.PRIVACY_POLICY}
                  component={PrivacyPolicy}
                />
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
                path={`${PATH.REGISTER_FROM_MY_PROFILE}${PATH.REGISTER_QUALIFICATIONS}`}
                component={RegisterQualifications}
                />

                <Route
                  exact
                  path={PATH.REGISTER_CLINICS}
                  component={RegisterClinics}
                />

                <Route
                  exact
                  path={`${PATH.REGISTER_FROM_MY_PROFILE}${PATH.REGISTER_CLINICS}`}
                  component={RegisterClinics}
                />

                <Route
                  exact
                  path={PATH.PROFILE}
                  component={DoctorProfilePage}
                />

                <Route
                  exact
                  path={PATH.SETTINGS}
                  component={DoctorSettingsePage}
                />

                <Route
                  exact
                  path={PATH.CONSULTATION_FEE}
                  component={DoctorSettingsePage}
                />

                <Route
                  exact
                  path={PATH.BILLING}
                  component={DoctorSettingsePage}
                />

                <Route
                  exact
                  path={PATH.PAYMENT_DETAILS}
                  component={DoctorSettingsePage}
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
