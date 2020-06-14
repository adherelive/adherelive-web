import React, { lazy, Component, Fragment } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  useLocation
} from "react-router-dom";
import SideMenu from "../../Components/Sidebar";
import BlankState from "../../Containers/BlankState";
import { PATH } from "../../constant";



const Doctors = lazy(() =>
  import(
    /* webpackChunkName: "DoctorsRouter" */ "../Doctors"
  )
);

const Dashboard = lazy(() =>
  import(/* webpackChunkName: "Dashboard" */ "../../Containers/Dashboard")
);



export default class Authenticated extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      // redirecting: this.props.authRedirection
    };
  }

  componentDidMount() {


  }

  render() {
    const { redirecting } = this.state;
    const { authRedirection, authenticated_user, users } = this.props;
    return (
      <Fragment>
        <Doctors {...this.props} />
      
      </Fragment>
    );
  }
}
