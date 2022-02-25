import React, { lazy, Component, Fragment } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
} from "react-router-dom";
import { PATH } from "../../../constant";
import SideMenu from "../../../Containers/Sidebar";
// import BlankState from "../../../Components/Common/BlankState";

const AdminDoctorPage = lazy(() =>
  import(
    /* webpackChunkName: "AdminDoctorTable" */ "../../../Containers/Pages/doctor"
  )
);

const AdminProviderPage = lazy(() =>
  import(
    /* webpackChunkName: "AdminProviderPage" */ "../../../Containers/Pages/provider"
  )
);

const AdminDoctorDetailsPage = lazy(() =>
  import(
    /* webpackChunkName: "AdminDoctorDetails" */ "../../../Containers/Pages/doctorDetails"
  )
);

const TosPpEditorPage = lazy(() =>
  import(
    /* webpackChunkName: "TosPpEditorPage" */ "../../../Containers/Pages/TosPPEditorPage"
  )
);

const TermsOfService = lazy(() =>
  import(
    /* webpackChunkName: "TermsOfServicePage" */ "../../../Containers/Pages/TermsOfService"
  )
);

const TermsOfPayment = lazy(() =>
  import(
    /* webpackChunkName: "TermsOfPayment" */ "../../../Containers/Pages/termsOfPayment"
  )
);

const PrivacyPolicy = lazy(() =>
  import(
    /* webpackChunkName: "PrivacyPolicyPage" */ "../../../Containers/Pages/PrivacyPolicy"
  )
);

const AdminMedicines = lazy(() =>
  import(
    /* webpackChunkName: "AdminMedicinesPage" */ "../../../Containers/Pages/adminMedicines"
  )
);

const SideMenuComp = (props) => {
  const { location: { pathname = "" } = {} } = props;
  if (
    !(
      pathname.includes("patient-consulting") ||
      pathname.includes("terms-of-service") ||
      pathname.includes("privacy-policy") ||
      pathname.includes("terms-of-payment")
    )
  ) {
    return <SideMenu {...props} />;
  } else {
    return null;
  }
};

const AdminDoctorDetailsPageComp = (props) => {
  const { match: { params: { id } = {} } = {} } = props;
  return <AdminDoctorDetailsPage id={id} />;
};

class AdminDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirecting: this.props.authRedirection,
    };
  }

  render() {
    const { location: { pathname = "" } = {} } = this.props;
    const isSideMenuVisible = !(
      pathname.includes("patient-consulting") ||
      pathname.includes("terms-of-service") ||
      pathname.includes("privacy-policy") ||
      pathname.includes("terms-of-payment")
    );
    return (
      <Fragment>
        <Router>
          <div className="App flex" style={{ overflow: "hidden" }}>
            <SideMenuComp {...this.props} />
            <div className={isSideMenuVisible ? "container" : ""}>
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
                  path={PATH.ADMIN.DOCTORS.DETAILS}
                  component={AdminDoctorDetailsPageComp}
                />
                <Route
                  exact
                  path={PATH.ADMIN.DOCTORS.ROOT}
                  component={AdminDoctorPage}
                />
                <Route
                  exact
                  path={PATH.ADMIN.TOS_PP_EDITOR}
                  component={TosPpEditorPage}
                />
                <Route
                  exact
                  path={PATH.LANDING_PAGE}
                  component={AdminDoctorPage}
                />
                <Route
                  exact
                  path={PATH.ADMIN.ALL_PROVIDERS}
                  component={AdminProviderPage}
                />
                <Route
                  exact
                  path={PATH.ADMIN.ALL_MEDICINES}
                  component={AdminMedicines}
                />
                <Route path={PATH.LANDING_PAGE} component={AdminDoctorPage} />
                {/* <Route path={""} component={BlankState} /> */}
              </Switch>
            </div>
          </div>
        </Router>
      </Fragment>
    );
  }
}

export default withRouter(AdminDoctor);
