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
import { PATH } from "../../../constant";
import SideMenu from "../../../Components/Sidebar";

const AdminDoctorPage = lazy(() =>
  import(
    /* webpackChunkName: "AdminDoctorTable" */ "../../../Containers/Pages/doctor"
  )
);

const AdminDoctorDetailsPage = lazy(() =>
  import(
    /* webpackChunkName: "AdminDoctorDetails" */ "../../../Containers/Pages/doctorDetails"
  )
);

const AdminDoctorDetailsPageComp = props => {
  const { match: { params: { id } = {} } = {} } = props;
  return <AdminDoctorDetailsPage id={id} />;
};

class AdminDoctor extends Component {
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
                  path={PATH.ADMIN.DOCTORS.DETAILS}
                  component={AdminDoctorDetailsPageComp}
                />
                <Route
                  exact
                  path={PATH.ADMIN.DOCTORS.ROOT}
                  component={AdminDoctorPage}
                />
                <Route exact path={PATH.LANDING_PAGE} component={AdminDoctorPage} />
                <Route exact path={""} component={AdminDoctorPage} />
              </Switch>
            </div>
          </div>
        </Router>
      </Fragment>
    );
  }
}

export default withRouter(AdminDoctor);
