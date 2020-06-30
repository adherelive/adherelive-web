import React, { lazy, Component, Fragment } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  useLocation,
} from "react-router-dom";
import SideMenu from "../../Components/Sidebar";
import BlankState from "../../Containers/BlankState";
import { PATH, USER_CATEGORY } from "../../constant";

const Doctors = lazy(() =>
  import(/* webpackChunkName: "DoctorsRouter" */ "../Doctors")
);

const Admin = lazy(() =>
  import(/* webpackChunkName: "AdminRouter" */ "../Admin")
);

export default class Authenticated extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // redirecting: this.props.authRedirection
    };
  }
  componentDidMount() {
    // this.setState((prevState, prevProps) => {
    //   return {
    //     redirecting: false
    //   };
    // });

  }
  render() {
    const { redirecting } = this.state;
    console.log("PROPS IN AUTH COMPONENTTTT",this.props);
    const {
      authRedirection,
      authenticated_user,
      authenticated_category,
      users,
    } = this.props;
    return (
      <Fragment>
            {authenticated_category === USER_CATEGORY.DOCTOR && (
              <Doctors {...this.props} />
            )}
            {authenticated_category === USER_CATEGORY.ADMIN && (
              <Admin {...this.props} />
            )}
      </Fragment>
    );
  }
}
