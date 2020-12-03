import React, { lazy, Component, Fragment } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  useLocation,
  withRouter
} from "react-router-dom";
// import BlankState from "../../Containers/BlankState";
import { PATH } from "../../constant";
import SideMenu from "../../Components/Sidebar";


// FOR DOCTOR TODO: can be in separate doctors folder for easy management
const ProviderDoctorPage = lazy(() =>
  import(
    /* webpackChunkName: "AdminDoctorTable" */ "../../Containers/Pages/providerDashboard"
  )
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

const ProviderDoctorDetailsPage = lazy(() =>
    import(
        /* webpackChunkName: "ProviderDoctorDetailsPage" */ "../../Containers/Pages/providerDoctorDetails"
        )
);

const ProviderDoctorDetailsComp = props => {
  const { match: { params: { id } = {} } = {} } = props;
  return <ProviderDoctorDetailsPage id={id} />;
};


class ProviderDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirecting: this.props.authRedirection
    };
  }

  render() {
    const { redirecting = false } = this.state;
    const { authRedirection } = this.props;
    return (
      <Fragment>
        <Router>
          <div className="App flex" style={{ overflow: "hidden" }}>
            <SideMenu {...this.props} />
            <div className="container">
              <Switch>
                <Route
                    exact
                    path={PATH.PROVIDER.DOCTORS.DETAILS}
                    component={ProviderDoctorDetailsComp}
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
                  path={PATH.PROVIDER_REGISTER_CLINICS}
                  component={RegisterClinics}
                />



                <Route exact path={""} component={ProviderDoctorPage} />
              </Switch>
            </div>
          </div>
        </Router>
      </Fragment>
    );
  }
}

export default withRouter(ProviderDoctor);
