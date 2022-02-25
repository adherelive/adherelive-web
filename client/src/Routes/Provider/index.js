import React, { lazy, Component, Fragment } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  useLocation,
  withRouter,
} from "react-router-dom";
import BlankState from "../../Components/Common/BlankState";
import { PATH } from "../../constant";
// import SideMenu from "../../Components/Sidebar";
import SideMenu from "../../Containers/Sidebar";

// FOR DOCTOR TODO: can be in separate doctors folder for easy management
const ProviderDoctorPage = lazy(() =>
  import(
    /* webpackChunkName: "ProviderDoctorTable" */ "../../Containers/Pages/providerDashboard"
  )
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

const ProviderDoctorDetailsPage = lazy(() =>
  import(
    /* webpackChunkName: "ProviderDoctorDetailsPage" */ "../../Containers/Pages/providerDoctorDetails"
  )
);

const ProviderDoctorPaymentPage = lazy(() =>
  import(
    /* webpackChunkName: "ProviderDoctorPaymentProductPage" */ "../../Containers/Pages/providerDoctorPaymentProduct"
  )
);

const DoctorCalenderPage = lazy(() =>
  import(
    /* webpackChunkName: "DoctorCalenderPage" */ "../../Containers/Pages/providerDoctorCalender"
  )
);

const TermsOfService = lazy(() =>
  import(
    /* webpackChunkName: "TermsOfServicePage" */ "../../Containers/Pages/TermsOfService"
  )
);

const TermsOfPayment = lazy(() =>
  import(
    /* webpackChunkName: "TermsOfPayment" */ "../../Containers/Pages/termsOfPayment"
  )
);

const PrivacyPolicy = lazy(() =>
  import(
    /* webpackChunkName: "PrivacyPolicyPage" */ "../../Containers/Pages/PrivacyPolicy"
  )
);

const ProviderTransactionPage = lazy(() =>
  import(
    /* webpackChunkName: "ProviderTransactionPage" */ "../../Containers/Pages/providerTransactionPage"
  )
);

const PaymentDetailsPage = lazy(() =>
  import(
    /* webpackChunkName: "ProviderPaymentDetailsPage" */ "../../Containers/ProviderAccountDetails"
  )
);

const ProviderDoctorDetailsComp = (props) => {
  const { match: { params: { id } = {} } = {} } = props;
  return <ProviderDoctorDetailsPage id={id} />;
};

class ProviderDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirecting: this.props.authRedirection,
    };
  }

  render() {
    const { redirecting = false } = this.state;
    const { location: { pathname = "" } = {}, authRedirection } = this.props;

    const showSidebar = !(
      pathname.includes("patient-consulting") ||
      pathname.includes("terms-of-service") ||
      pathname.includes("privacy-policy") ||
      pathname.includes("terms-of-payment")
    );

    return (
      <Fragment>
        <Router>
          <div className="App flex" style={{ overflow: "hidden" }}>
            {showSidebar && <SideMenu {...this.props} />}
            <div className={showSidebar ? `container` : ""}>
              <Switch>
                <Route
                  exact
                  path={PATH.TERMS_OF_SERVICE}
                  component={TermsOfService}
                />

                <Route
                  exact
                  path={PATH.TERMS_OF_PAYMENT}
                  component={TermsOfPayment}
                />

                <Route
                  exact
                  path={PATH.PRIVACY_POLICY}
                  component={PrivacyPolicy}
                />
                <Route
                  exact
                  path={PATH.PROVIDER.DOCTORS.DETAILS}
                  component={ProviderDoctorDetailsComp}
                />

                <Route
                  exact
                  path={PATH.PROVIDER.DOCTORS.PAYMENT_PRODUCTS}
                  component={ProviderDoctorPaymentPage}
                />

                <Route
                  exact
                  path={PATH.PROVIDER}
                  component={ProviderDoctorPage}
                />

                <Route
                  exact
                  path={PATH.PROVIDER_REGISTER_PROFILE}
                  component={RegisterProfile}
                />

                <Route
                  exact
                  path={PATH.REGISTER_PROFILE}
                  component={RegisterProfile}
                />
                <Route
                  exact
                  path={PATH.PROVIDER_REGISTER_QUALIFICATIONS}
                  component={RegisterQualifications}
                />

                <Route
                  exact
                  path={`${PATH.REGISTER_FROM_PROFILE}${PATH.PROVIDER_REGISTER_QUALIFICATIONS}`}
                  component={RegisterQualifications}
                />

                <Route
                  exact
                  path={PATH.PROVIDER_REGISTER_CLINICS}
                  component={RegisterClinics}
                />

                <Route
                  exact
                  path={`${PATH.REGISTER_FROM_PROFILE}${PATH.PROVIDER_REGISTER_CLINICS}`}
                  component={RegisterClinics}
                />

                <Route
                  exact
                  path={PATH.PROVIDER.CALENDER}
                  component={DoctorCalenderPage}
                />

                <Route
                  exact
                  path={PATH.PROVIDER.TRANSACTION_DETAILS}
                  component={ProviderTransactionPage}
                />

                <Route
                  exact
                  path={PATH.PROVIDER.PAYMENT_DETAILS}
                  component={PaymentDetailsPage}
                />

                <Route
                  path={PATH.LANDING_PAGE}
                  component={ProviderDoctorPage}
                />
                {/* <Route path={""} component={BlankState} /> */}
              </Switch>
            </div>
          </div>
        </Router>
      </Fragment>
    );
  }
}

export default withRouter(ProviderDoctor);
