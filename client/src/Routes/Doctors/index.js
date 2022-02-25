import React, { lazy, Component, Fragment } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  withRouter,
} from "react-router-dom";
import SideMenu from "../../Containers/Sidebar";
import BlankState from "../../Components/Common/BlankState";
import { PATH } from "../../constant";
import NotificationDrawer from "../../Containers/Drawer/notificationDrawer";

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

const TermsOfPayment = lazy(() =>
  import(
    /* webpackChunkName: "TermsOfPayment" */ "../../Containers/Pages/termsOfPayment"
  )
);

const PrivacyPolicy = lazy(() =>
  import(
    /* webpackChunkName: "PrivacyPolicyAuthPage" */ "../../Containers/Pages/PrivacyPolicy"
  )
);

const TemplatePage = lazy(() =>
  import(
    /* webpackChunkName: "TemplatePage" */ "../../Containers/Pages/doctorTemplateSettingsPage"
  )
);

const DoctorTransactionPage = lazy(() =>
  import(
    /* webpackChunkName: "DoctorTransactionPage" */ "../../Containers/Pages/doctorTransactionPage"
  )
);
// AKSHAY NEW CODE IMPLEMENTATION
const DoctorCalenderPage = lazy(() =>
  import(
    /* webpackChunkName: "DoctorCalenderPage" */ "../../Containers/Pages/providerDoctorCalender"
  )
);

const PatientDetailsComp = (props) => {
  const { match: { params: { patient_id } = {} } = {} } = props;
  return <PatientDetails patient_id={patient_id} />;
};

const RegisterProfileComp = (props) => {
  return <RegisterProfile {...props} />;
};

const ChatFullScreenComp = (props) => {
  return <ChatFullScreen {...props} />;
};

const TestTwilioVideoComp = (props) => {
  return <TestTwilioVideo {...props} />;
};

const TwilioVideoComp = (props) => {
  return <TwilioVideo {...props} />;
};

const RegisterQualificationsComp = (props) => {
  return <RegisterQualifications {...props} />;
};

const RegisterClinicsComp = (props) => {
  return <RegisterClinics {...props} />;
};

const DoctorProfilePageComp = (props) => {
  return <DoctorProfilePage {...props} />;
};

const DoctorSettingsPageComp = (props) => {
  return <DoctorSettingsPage {...props} />;
};

const TermsOfServiceComp = (props) => {
  return <TermsOfService {...props} />;
};

const TermsOfPaymentComp = (props) => {
  return <TermsOfPayment {...props} />;
};

const PrivacyPolicyComp = (props) => {
  return <PrivacyPolicy {...props} />;
};

const TemplatePageComp = (props) => {
  return <TemplatePage {...props} />;
};

const DoctorTransactionPageComp = (props) => {
  return <DoctorTransactionPage {...props} />;
};

const DashboardComp = (props) => {
  return <Dashboard {...props} />;
};

const SideMenuComp = (props) => {
  const { location: { pathname = "" } = {} } = props;
  // console.log("102938138932 sidemenu component --> ", {props});
  if (
    !(
      pathname.includes("patient-consulting") ||
      pathname.includes("terms-of-service") ||
      pathname.includes("privacy-policy") ||
      pathname.includes("video") ||
      pathname.includes("sign-in") ||
      pathname.includes("terms-of-payment")
    )
  ) {
    return <SideMenu {...props} />;
  } else {
    return null;
  }
};

const NotificationDrawerComponent = (props) => {
  return <NotificationDrawer {...props} />;
};

class Doctors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirecting: this.props.authRedirection,
    };
  }

  componentDidMount() {
    this.setState((prevState, prevProps) => {
      return {
        redirecting: false,
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
      pathname.includes("sign-in") ||
      pathname.includes("terms-of-payment")
    );
    const { authRedirection } = this.props;
    return (
      <Fragment>
        <Router>
          <div className="App flex" style={{ overflow: "hidden" }}>
            <SideMenuComp {...this.props} />
            <div
              className={
                isNotChatComponent
                  ? pathname.includes("video")
                    ? "video-page"
                    : `container`
                  : "container-chat-page"
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
                  component={RegisterProfileComp}
                />
                <Route
                  exact
                  path={PATH.PATIENT_CONSULTING}
                  component={ChatFullScreenComp}
                />
                {/* <Route
                  exact
                  path={PATH.PATIENT_CONSULTING}
                  component={ChatFullScreen}
                /> */}
                <Route
                  exact
                  path={PATH.TEST_PATIENT_CONSULTING_VIDEO}
                  component={TestTwilioVideoComp}
                />
                <Route
                  exact
                  path={PATH.PATIENT_CONSULTING_VIDEO}
                  component={TwilioVideoComp}
                />
                <Route
                  exact
                  path={PATH.REGISTER_QUALIFICATIONS}
                  component={RegisterQualificationsComp}
                />

                <Route
                  exact
                  path={`${PATH.REGISTER_FROM_MY_PROFILE}${PATH.REGISTER_QUALIFICATIONS}`}
                  component={RegisterQualificationsComp}
                />

                <Route
                  exact
                  path={PATH.REGISTER_CLINICS}
                  component={RegisterClinicsComp}
                />

                <Route
                  exact
                  path={`${PATH.REGISTER_FROM_MY_PROFILE}${PATH.REGISTER_CLINICS}`}
                  component={RegisterClinicsComp}
                />

                <Route
                  exact
                  path={PATH.PROFILE}
                  component={DoctorProfilePageComp}
                />

                <Route
                  exact
                  path={PATH.SETTINGS}
                  component={DoctorSettingsPageComp}
                />

                <Route
                  exact
                  path={PATH.CONSULTATION_FEE}
                  component={DoctorSettingsPageComp}
                />

                <Route
                  exact
                  path={PATH.BILLING}
                  component={DoctorSettingsPageComp}
                />

                <Route
                  exact
                  path={PATH.PAYMENT_DETAILS}
                  component={DoctorSettingsPageComp}
                />

                <Route
                  exact
                  path={PATH.TERMS_OF_SERVICE}
                  component={TermsOfServiceComp}
                />

                <Route
                  exact
                  path={PATH.TERMS_OF_PAYMENT}
                  component={TermsOfPaymentComp}
                />
                <Route
                  exact
                  path={PATH.PRIVACY_POLICY}
                  component={PrivacyPolicyComp}
                />

                <Route
                  exact
                  path={PATH.TEMPLATES}
                  component={TemplatePageComp}
                />

                <Route
                  exact
                  path={PATH.DOCTOR.TRANSACTION_DETAILS}
                  component={DoctorTransactionPageComp}
                />
                {/* AKSHAY NEW CODE IMPLEMENTATION */}
                <Route
                  exact
                  path={PATH.PROVIDER.CALENDER}
                  component={DoctorCalenderPage}
                />

                {/* <Route
                  exact
                  path={PATH.DASHBOARD}
                  component={Dashboard}
                /> */}
                <Route exact path="/" component={DashboardComp} />
                <Route path="" component={BlankState} />
              </Switch>
            </div>
            <NotificationDrawerComponent {...this.props} />
          </div>
        </Router>
      </Fragment>
    );
  }
}

export default withRouter(Doctors);
