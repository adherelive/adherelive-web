import React, { lazy, Component, Fragment } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  useLocation,
  withRouter,
} from "react-router-dom";
// import SideMenu from "../../Components/Sidebar";
// import BlankState from "../../Containers/BlankState";
import { PATH } from "../../../constant";

const AdminDoctorPage = lazy(() => import(/* webpackChunkName: "AdminDoctorTable" */"../../../Containers/Pages/doctor"));

const AdminDoctorDetailsPage = lazy(() => import(/* webpackChunkName: "AdminDoctorDetails" */"../../../Containers/Pages/doctorDetails"));

const AdminDoctorDetailsPageComp = (props) => {
  const {match: { params: { id } = {} } = {}} = props;
  return <AdminDoctorDetailsPage id={id}/>
};

class AdminDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirecting: this.props.authRedirection,
    };
  }

  render() {
    const { redirecting = false } = this.state;
    const { authRedirection } = this.props;
    return (
      <Fragment>
        <Router>
          <Switch>
            {redirecting && <Redirect to={authRedirection} />}

             <Route exact path={PATH.ADMIN.DOCTORS.DETAILS} component={AdminDoctorDetailsPageComp} />
            <Route path={PATH.ADMIN.DOCTORS.ROOT} component={AdminDoctorPage} />
          </Switch>
        </Router>
      </Fragment>
    );
  }
}

export default withRouter(AdminDoctor);
