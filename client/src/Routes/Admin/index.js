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
import { PATH } from "../../constant";

const AdminDoctors = lazy(() =>
  import(/* webpackChunkName: "AdminDoctorRouter" */ "./doctor")
);

class Admin extends Component {
  constructor(props) {
    super(props);
    console.log("PPROPSSS IN DOCTORRRRR ROUTERRR ---->  ", this.props);
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
    const { authRedirection, authenticated_user, users } = this.props;
    return (
      <Fragment>
        <Router>
          <Switch>
            {redirecting && <Redirect to={authRedirection} />}

            <Route path={PATH.ADMIN.DOCTORS.ROOT} component={AdminDoctors} />
          </Switch>
        </Router>
      </Fragment>
    );
  }
}

export default withRouter(Admin);
