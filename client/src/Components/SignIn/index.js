import React, { Component } from "react";
import { message } from "antd";
import { Spring } from "react-spring/renderprops";
import SignInForm from "./signIn";
import SignUpForm from "./signUp";

import rightArrow from "../../Assets/images/next.png";
import CompanyIcon from "../../Assets/images/logo3x.png";
import { PATH } from "../../constant";

import config from "../../config";
import { injectIntl } from "react-intl";
import messages from "./message";

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: true
    };
  }

  async componentDidMount() {
    const { link = "" } = this.props.match.params;
    if (link) {
      const { verifyUser } = this.props;
      let response = await verifyUser(link);
      //   .then(response=>{
      const { status } = response;
      if (!status) {
        message.error(this.formatMessage(messages.linkExpired));
      } else {
        this.props.history.push("/register-profile");
      }
    }
  }

  formatMessage = data => this.props.intl.formatMessage(data);

  toggleLogin = () => {
    let { login } = this.state;
    let newLogin = !login;

    // this.props.form.resetFields();
    this.setState({ login: newLogin });
  };

  redirectToForgotPassword = () => {
    const { history } = this.props;
    history.push(PATH.FORGOT_PASSWORD);
  };

  render() {
    const { signIn, signUp, getInitialData } = this.props;
    const { login } = this.state;
    return (
      <div className="wp100 landing-background flex direction-column justify-center align-center">
        <div className="hp100 wp75">
          <div className="mt40 wp100 mt24 flex justify-space-between align-center direction-row ">
            <div className="flex direction-row align-center">
              <img
                alt="adhere-logo"
                src={CompanyIcon}
                className="company-logo"
              />
              <div className="text-white fs28 medium italic">
                {this.formatMessage(messages.appName)}
              </div>
            </div>

            <div className="flex direction-row align-center">
              <div className="text-white fs16 mr16 ">
                {login ? "New to Adhere?" : "Already a user?"}
              </div>
              <div
                className="signup-button medium pointer"
                onClick={this.toggleLogin}
              >
                {login ? "Signup" : "Login"}
              </div>
            </div>
          </div>
          <div className="center-container">
            <div className="form-background-box">
              {login ? (
                <Spring
                  from={{ opacity: 0 }}
                  to={{ opacity: 1 }}
                  config={{ delay: 500, duration: 500 }}
                >
                  {props => (
                    <div
                      className="flex direction-column flex1 wp100 hp100"
                      style={props}
                    >
                      <div className="login-description ml10">
                        <div className="now-available mb10">
                          <div className="fs14 medium text-white">
                            {this.formatMessage(messages.nowAvailable)}
                          </div>
                        </div>
                        <div className="fs18 medium text-white ml10">
                          {this.formatMessage(messages.customDashboard)}
                        </div>

                        <div className="fs12 text-white mt4 ml10">
                          {this.formatMessage(messages.metrics)}
                        </div>
                      </div>
                      <div className="login-text">
                        <div className="fs16 medium">
                          {" "}
                          Fusce vehicula dolor arcu, sit amet blandit dolor
                          mollis nec. Donec viverra eleifend lacus, vitae
                          ullamcorper metus.{" "}
                        </div>
                      </div>
                      <div className="learn-more-text ml10">
                        <div className="dark-sky-blue fs18 medium mr4">
                          {this.formatMessage(messages.learnMore)}
                        </div>
                        <img src={rightArrow} height={14} width={14} />
                      </div>
                    </div>
                  )}
                </Spring>
              ) : (
                <Spring
                  from={{ opacity: 0 }}
                  to={{ opacity: 1 }}
                  config={{ delay: 2000, duration: 1000 }}
                >
                  {props => (
                      <div
                          className="flex align-end direction-column wp100 hp100"
                          style={props}
                      >
                        <div className="login-description mr10">
                          <div className="now-available mb10">
                            <div className="fs14 medium text-white">
                              {this.formatMessage(messages.nowAvailable)}
                            </div>
                          </div>
                          <div className="fs18 medium text-white ml10">
                            {this.formatMessage(messages.customDashboard)}
                          </div>

                          <div className="fs12 text-white mt4 ml10">
                            {this.formatMessage(messages.metrics)}
                          </div>
                        </div>
                        <div className="login-text">
                          <div className="fs16 medium">
                            {" "}
                            Fusce vehicula dolor arcu, sit amet blandit dolor
                            mollis nec. Donec viverra eleifend lacus, vitae
                            ullamcorper metus.{" "}
                          </div>
                        </div>
                        <div className="learn-more-text mr10">
                          <div className="dark-sky-blue fs18 medium mr4">
                            {this.formatMessage(messages.learnMore)}
                          </div>
                          <img src={rightArrow} height={14} width={14} />
                        </div>
                      </div>
                  )}
                </Spring>
              )}
            </div>
            {login ? (
              <Spring
                from={{ right: "60%", opacity: 0 }}
                to={{ right: "15%", opacity: 1 }}
              >
                {props => (
                  // <div style={props}>
                  <div className="form-container" style={props}>
                    <div className="mb8 fs24 fw600 pt20 flex direction-column tal">
                      {this.formatMessage(messages.loginToDashboard)}
                    </div>
                    <div className="mb12 fs14  flex direction-column tal">
                      {this.formatMessage(messages.enterCredentials)}
                    </div>

                    <SignInForm
                      signIn={signIn}
                      getInitialData={getInitialData}
                      redirectToForgotPassword={this.redirectToForgotPassword}
                    />
                    <div className="flex direction-column justify-space-between align-center">
                      {/* <LoginByGoogle googleSignIn={googleSignIn}/> */}
                      {/* <LoginByFacebook facebookSignIn={facebookSignIn}/> */}
                    </div>

                    <div className="flex mt12 wp100 justify-center">
                      <div className="medium fs12">
                        {this.formatMessage(messages.issue)}
                      </div>
                    </div>
                    <div className="flex wp100 justify-center">
                      <a href={`mailto:${config.ADHERE_LIVE_CONTACT_LINK}?subject=${config.mail.LOGIN_CONTACT_MESSAGE}`} target={"_blank"} className="medium fs14 dark-sky-blue pointer">
                        {this.formatMessage(messages.contactSupport)}
                      </a>
                    </div>
                  </div>

                  // </div>
                )}
              </Spring>
            ) : (
              <Spring
                from={{ right: "15%", opacity: 0 }}
                to={{ right: "60%", opacity: 1 }}
              >
                {props => (
                  // <div style={props}>
                  <div className="form-container" style={props}>
                    <div className="mb8 fs24 fw600 pt20 flex direction-column tal">
                      {this.formatMessage(messages.signUp)}
                    </div>
                    <div className="mb12 fs14  flex direction-column tal">
                      {this.formatMessage(messages.continue)}
                    </div>

                    <SignUpForm signUp={signUp} />
                    <div className="flex direction-column justify-space-between align-center"></div>
                  </div>
                )}
              </Spring>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(SignIn);
