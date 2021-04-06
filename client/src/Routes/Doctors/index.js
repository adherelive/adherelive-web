import React, { lazy, Component, Fragment } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  withRouter
} from "react-router-dom";
import SideMenu from "../../Containers/Sidebar";
import BlankState from "../../Components/Common/BlankState";
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
    /* webpackChunkName: "TwilioVideo" */ "../../Containers/ChatFullScreen/agoraVideo"
  )
);

const TestTwilioVideo = lazy(() =>
  import(
    /* webpackChunkName: "TwilioVideo" */ "../../Containers/ChatFullScreen/testAgoraVideo"
  )
);

const DoctorProfilePage = lazy(() =>
  import(
    /* webpackChunkName: "DoctorProfilePage" */ "../../Containers/Pages/doctorProfilePage"
  )
);

const DoctorSettingsPage = lazy(() =>
  import(
    /* webpackChunkName: "DoctorSettingsPage" */ "../../Containers/Pages/doctorSettingsPage"
  )
);

const TermsOfService = lazy(() =>
  import(
    /* webpackChunkName: "TermsOfServiceAuthPage" */ "../../Containers/Pages/TermsOfService"
  )
);

const PrivacyPolicy = lazy(() =>
  import(
    /* webpackChunkName: "PrivacyPolicyAuthPage" */ "../../Containers/Pages/PrivacyPolicy"
  )
);

const TemplatePage = lazy(() => 
    import (
        /* webpackChunkName: "TemplatePage" */ "../../Containers/Pages/doctorTemplateSettingsPage"
    )
);

const DoctorTransactionPage = lazy(() => 
    import(
      /* webpackChunkName: "DoctorTransactionPage" */ "../../Containers/Pages/doctorTransactionPage"

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
      pathname.includes("privacy-policy") ||
      pathname.includes("video") ||
      pathname.includes("sign-in")
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
      pathname.includes("privacy-policy") ||
      pathname.includes("sign-in")
    );
    const { authRedirection } = this.props;
    return (
      <Fragment>
        <Router>
          <div className="App flex" style={{ overflow: "hidden" }}>
            <SideMenuComp {...this.props} />
            <div
              className={
                isNotChatComponent ? pathname.includes("video") ? "video-page" : `container` : "container-chat-page"
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
                {/* <Route
                  exact
                  path={PATH.PATIENT_CONSULTING}
                  component={ChatFullScreen}
                /> */}
                <Route
                  exact
                  path={PATH.TEST_PATIENT_CONSULTING_VIDEO}
                  component={TestTwilioVideo}
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
                  component={DoctorSettingsPage}
                />

                <Route
                  exact
                  path={PATH.CONSULTATION_FEE}
                  component={DoctorSettingsPage}
                />

                <Route
                  exact
                  path={PATH.BILLING}
                  component={DoctorSettingsPage}
                />

                <Route
                  exact
                  path={PATH.PAYMENT_DETAILS}
                  component={DoctorSettingsPage}
                />

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
                    path={PATH.TEMPLATES}
                    component={TemplatePage}
                />


                <Route
                 exact
                 path={PATH.DOCTOR.TRANSACTION_DETAILS}
                 component={DoctorTransactionPage}
                />

                
                {/* <Route
                  exact
                  path={PATH.DASHBOARD}
                  component={Dashboard}
                /> */}
                <Route exact path="/" component={Dashboard} />
                <Route path="" component={BlankState} />
              </Switch>
            </div>
          </div>
        </Router>
      </Fragment>
    );
  }
}

export default withRouter(Doctors);
