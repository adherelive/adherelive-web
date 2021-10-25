import React, { Component, lazy } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
// import landingPage from "../Components/landingPage";
// import Signup from "../Containers/Invite";
// import Identify from "../Components/forgotPassword/Identify";
// import ForgotPassword from "../Containers/ForgotPassword";
// import ResetPassword from "../Containers/ResetPassword";
// import Register from "../../Containers/DoctorOnBoarding/clinicRegister";
import SignIn from "../../Containers/SignIn";
import Validation from "../../Containers/Validation";
import ForgotPassword from "../../Containers/forgotPassword";
import ResetPassword from "../../Containers/forgotPassword/resetPassword";
//import SignIn from "../../Components/SignIn";
import { PATH } from "../../constant";

const TermsOfService = lazy(() =>
  import(
    /* webpackChunkName: "TermsOfServicePage" */ "../../Containers/Pages/TermsOfService"
  )
);

const TermsOfPayment = lazy(() =>
  import(
    /* webpackChunkName: "TermsOfPayment" */ "../../Containers/Pages/termsOfPayment"
  )
);

const PrivacyPolicy = lazy(() =>
  import(
    /* webpackChunkName: "PrivacyPolicyPage" */ "../../Containers/Pages/PrivacyPolicy"
  )
);

export default class Global extends Component {
  constructor(props) {
    super(props);
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

  componentDidUpdate(prevProps) {
    const { authRedirection } = this.props;
    const { redirecting } = this.state;
    const { authRedirection: prevAuthRedirection } = prevProps || {};
    if (!(prevAuthRedirection === authRedirection)) {
      this.setState((prevState, prevProps) => {
        return {
          redirecting: authRedirection,
        };
      });
    } else {
      if (redirecting) {
        this.setState((prevState, prevProps) => {
          return {
            redirecting: false,
          };
        });
      }
    }
  }

  render() {
    const { authRedirection } = this.props;
    const { redirecting } = this.state;

    return (
      <BrowserRouter>
        <Switch>
          {redirecting && <Redirect to={authRedirection} />}
          <Route exact path={PATH.SIGN_IN} component={SignIn} />

          <Route
            exact
            path={PATH.TERMS_OF_SERVICE}
            component={TermsOfService}
          />

          <Route
            exact
            path={PATH.TERMS_OF_PAYMENT}
            component={TermsOfPayment}
          />

          <Route exact path={PATH.PRIVACY_POLICY} component={PrivacyPolicy} />
          <Route path={PATH.VALIDATION_PAGE} component={Validation} />
          <Route path={PATH.FORGOT_PASSWORD} component={ForgotPassword} />
          <Route path={PATH.RESET_PASSWORD} component={ResetPassword} />
          <Route path="" component={SignIn} />
          {/*<Route path="" component={BlankState} />*/}
        </Switch>
      </BrowserRouter>
    );
  }
}
