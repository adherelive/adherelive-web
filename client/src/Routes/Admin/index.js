import React, { lazy, Component } from "react";
import { withRouter } from "react-router-dom";

const AdminDoctors = lazy(() =>
  import(/* webpackChunkName: "AdminDoctorRouter" */ "./doctor")
);

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirecting: this.props.authRedirection,
    };
  }

  componentDidMount() {
    this.setState(() => {
      return {
        redirecting: false,
      };
    });
  }

  render() {
    // const {authRedirection} = this.props;
    return <AdminDoctors {...this.props} />;
  }
}

export default withRouter(Admin);
