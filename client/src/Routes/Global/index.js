import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
// import landingPage from "../Components/landingPage";
// import Signup from "../Containers/Invite";
// import Identify from "../Components/forgotPassword/Identify";
// import ForgotPassword from "../Containers/ForgotPassword";
// import ResetPassword from "../Containers/ResetPassword";
// import SignIn from "../Containers/SignIn";
import SignIn from "../../Components/SignIn";
// import BlankState from "../Containers/BlankState";
import { PATH } from "../../constant";

export default class Global extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirecting: this.props.authRedirection
    };
  }

  componentDidMount() {
    this.setState((prevState, prevProps) => {
      return {
        redirecting: false
      };
    });
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          {this.state.redirecting && <Redirect to={this.state.redirecting} />}
          <Route exact path={PATH.SIGN_IN} component={SignIn} />
          {/*<Route exact path={PATH.FORGOT_PASSWORD} component={ForgotPassword} />*/}
          {/*<Route exact path={PATH.IDENTIFY} component={Identify} />*/}
          {/*<Route exact path={PATH.SIGN_UP} component={Signup} />*/}
          {/*<Route exact path={PATH.RESET_PASSWORD} component={ResetPassword} />*/}
          {/*<Route exact path={PATH.LANDING_PAGE} component={landingPage} />*/}
          {/*<Route path="" component={BlankState} />*/}
        </Switch>
      </BrowserRouter>
    );
  }
}
