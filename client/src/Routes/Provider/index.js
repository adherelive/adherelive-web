import React, { lazy, Component } from "react";
import {
  
  withRouter
} from "react-router-dom";
// import SideMenu from "../../Components/Sidebar";
// import BlankState from "../../Containers/BlankState";

const ProviderDoctors = lazy(() =>
  import(/* webpackChunkName: "AdminDoctorRouter" */ "./doctor")
);

class Provider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirecting: this.props.authRedirection
    };
  }

  componentDidMount() {
    this.setState(() => {
      return {
        redirecting: false
      };
    });
  }

  render() {
    // const {authRedirection} = this.props;
    return <ProviderDoctors {...this.props}/>;
  }
}

export default withRouter(Provider);
