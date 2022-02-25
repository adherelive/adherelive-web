import React, { Component } from "react";
import { message } from "antd";
import { Spring } from "react-spring/renderprops";
import SignUpForm from "./signUp";

import rightArrow from "../../Assets/images/next.png";
import { PATH } from "../../constant";

import { injectIntl } from "react-intl";
import messages from "./message";

class ToggleSignUp extends Component {
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
    const { signUp } = this.props;
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
                className=" flex align-end direction-column flex-1 wp100 hp100"
                style={props}
              >
                <div className=" login-description mr22 relative">
                  <div className="flex  hp100">
                    <div className="h200 wp100">
                      <div className="wp100 h100 right-bar ">
                        <div className="now-available-right">
                          <div className="fs14 medium text-white">
                            {formatMessage(messages.nowAvailable)}
                          </div>
                        </div>

                        <div className="fs18 medium text-white ">
                          {formatMessage(messages.customDashboard)}
                        </div>

                        <div className="fs12 text-white mt4 ">
                          {formatMessage(messages.metrics)}
                        </div>
                      </div>

                      <div className="wp100 ">
                        <div className="flex direction-row-reverse">
                          <div className="login-text">
                            <div className="fs16 medium tar">
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
                              </b>
                              <br /> <br />{" "}
                            </div>
                          </div>
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
          from={{ right: "15%", opacity: 0 }}
          to={{ right: "60%", opacity: 1 }}
        >
          {(props) => (
            <div className="form-container" style={props}>
              <div className="mb8 fs24 fw600 pt20 flex direction-column tal">
                {formatMessage(messages.signUp)}
              </div>
              <div className="mb12 fs14  flex direction-column tal">
                {formatMessage(messages.continue)}
              </div>

              <SignUpForm signUp={signUp} />
              <div className="flex direction-column justify-space-between align-center"></div>
            </div>
          )}
        </Spring>
      </div>
    );
  }
}

export default injectIntl(ToggleSignUp);
