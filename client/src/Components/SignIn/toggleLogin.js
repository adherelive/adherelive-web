import React, { Component } from "react";
import { message } from "antd";
import { Spring } from "react-spring/renderprops";
import SignInForm from "./signIn";

import rightArrow from "../../Assets/images/next.png";
import { PATH } from "../../constant";

import config from "../../config";
import { injectIntl } from "react-intl";
import messages from "./message";

class ToggleLogin extends Component {
  constructor(props) {
    super(props);
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

  redirectToForgotPassword = () => {
    const { history } = this.props;
    history.push(PATH.FORGOT_PASSWORD);
  };

  render() {
    const { signIn, getInitialData, getUserRoles } = this.props;
    const { formatMessage } = this;
    return (
      <div className="center-container">
        <div className="form-background-box">
          <Spring
            from={{ opacity: 0 }}
            to={{ opacity: 1 }}
            config={{ delay: 200, duration: 500 }}
          >
            {(props) => (
              <div
                className=" flex direction-column flex-1 wp100 hp100"
                style={props}
              >
                <div className=" login-description ml22 relative">
                  <div className="flex hp100">
                    <div className="h200 wp100">
                      <div className="wp100 h100 left-bar ">
                        <div className="now-available-left">
                          <div className="fs14 medium text-white">
                            {formatMessage(messages.nowAvailable)}
                          </div>
                        </div>

                        <div className="fs18 medium text-white ml10">
                          {formatMessage(messages.customDashboard)}
                        </div>

                        <div className="fs12 text-white mt4 ml10">
                          {formatMessage(messages.metrics)}
                        </div>

                        {/* <div className="now-available-left" ></div> */}
                      </div>

                      <div className="login-text">
                        <div className="fs16 medium">
                          {" "}
                          <b>
                            {" "}
                            Remote Care Enablement "For the Provider, by the
                            Provider, to their Patients"{" "}
                          </b>{" "}
                          <br />
                          <b>
                            {" "}
                            Subscription based health care service delivery.{" "}
                          </b>{" "}
                          <br />
                          <br />{" "}
                        </div>
                      </div>
                      <div className="learn-more-text">
                        <div className="dark-sky-blue fs18 medium mr4">
                          {formatMessage(messages.learnMore)}
                        </div>

                        <img src={rightArrow} height={14} width={14} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Spring>
        </div>

        <Spring
          from={{ right: "60%", opacity: 0 }}
          to={{ right: "15%", opacity: 1 }}
        >
          {(props) => (
            <div className="form-container" style={props}>
              <div className="mb8 fs24 fw600 pt20 flex direction-column tal">
                {formatMessage(messages.loginToDashboard)}
              </div>
              <div className="mb12 fs14  flex direction-column tal">
                {formatMessage(messages.enterCredentials)}
              </div>

              <SignInForm
                signIn={signIn}
                getInitialData={getInitialData}
                getUserRoles={getUserRoles}
                redirectToForgotPassword={this.redirectToForgotPassword}
              />
              <div className="flex direction-column justify-space-between align-center">
                {/* <LoginByGoogle googleSignIn={googleSignIn}/> */}
                {/* <LoginByFacebook facebookSignIn={facebookSignIn}/> */}
              </div>

              <div className="flex mt12 wp100 justify-center">
                <div className="medium fs12">
                  {formatMessage(messages.issue)}
                </div>
              </div>
              <div className="flex wp100 justify-center">
                <a
                  href={`mailto:${config.ADHERE_LIVE_CONTACT_LINK}?subject=${config.mail.LOGIN_CONTACT_MESSAGE}`}
                  target={"_blank"}
                  className="medium fs14 dark-sky-blue pointer"
                >
                  {formatMessage(messages.contactSupport)}
                </a>
              </div>
            </div>
          )}
        </Spring>
      </div>
    );
  }
}

export default injectIntl(ToggleLogin);
