import React, { Component } from "react";
import { message } from "antd";
import LoginComponent from "./toggleLogin";
import SignUpComponent from "./toggleSignup";

import CompanyIcon from "../../Assets/images/logo3x.png";
import { PATH } from "../../constant";

import { injectIntl } from "react-intl";
import messages from "./message";

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: true,
    };
  }

  async componentDidMount() {
    const { match: { params = {} } = {}, history } = this.props;
    const { link = "" } = params;
    const { formatMessage } = this;
    if (link) {
      const { verifyUser } = this.props;
      let response = await verifyUser(link);
      const { status } = response;
      if (!status) {
        message.error(formatMessage(messages.linkExpired));
      } else {
        history.push(PATH.REGISTER_PROFILE);
      }
    }
  }

  formatMessage = (data) => this.props.intl.formatMessage(data);

  toggleLogin = () => {
    let { login } = this.state;
    let newLogin = !login;

    this.setState({ login: newLogin });
  };

  redirectToForgotPassword = () => {
    const { history } = this.props;
    history.push(PATH.FORGOT_PASSWORD);
  };

  render() {
    const { auth: { authenticated_user } = {} } = this.props;
    const { login } = this.state;
    const { formatMessage, toggleLogin } = this;
    return (
      <div
        className={`wp100 landing-background flex direction-column justify-center align-center ${
          authenticated_user ? "hp100" : ""
        }`}
        style={{ overflowY: "hidden" }}
      >
        <div className="hp100 wp75">
          <div className="mt40 wp100 mt24 flex justify-space-between align-center direction-row ">
            <div className="flex direction-row align-center">
              <img
                alt="adherelive-logo"
                src={CompanyIcon}
                className="company-logo"
              />
              <div className="text-white fs28 medium italic">
                {formatMessage(messages.appName)}
              </div>
            </div>

            <div className="flex direction-row align-center">
              <div className="text-white fs16 mr16 ">
                {login
                  ? this.formatMessage(messages.newToAdhere)
                  : this.formatMessage(messages.alreadyAUser)}
              </div>
              <div
                className="signup-button medium pointer"
                onClick={toggleLogin}
              >
                {login
                  ? formatMessage(messages.signup)
                  : formatMessage(messages.login)}
              </div>
            </div>
          </div>
          {}
          {login ? (
            <LoginComponent {...this.props} />
          ) : (
            <SignUpComponent {...this.props} />
          )}
        </div>
      </div>
    );
  }
}

export default injectIntl(SignIn);
