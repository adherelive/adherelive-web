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

const Provider = lazy(() => 
  import(/* webpackChunkName: "ProviderRouter" */ "../Provider") )

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
    // const {getInitialData} = this.props;
    // getInitialData();
    
  }
  render() {
    const { redirecting } = this.state;
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
            { (authenticated_category === USER_CATEGORY.ADMIN) && (
              <Admin {...this.props} />
            )}
            { (authenticated_category === USER_CATEGORY.PROVIDER) && (
              <Provider {...this.props} />
            )}
      </Fragment>
    );
  }
}
