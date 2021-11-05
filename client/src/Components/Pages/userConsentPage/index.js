import React, { Component } from "react";
// import {withRouter} from "react-router-dom";
import { injectIntl } from "react-intl";
import Button from "antd/es/button";
import Checkbox from "antd/es/checkbox";
import message from "antd/es/message";
import CompanyIcon from "../../../Assets/images/logo3x.png";
import messages from "./message";
import ReactMarkdown from "react-markdown";
import { PATH } from "../../../constant";

const TERMS_OF_SERVICE = "terms_of_service";

class UserConsent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      checked: false,
    };
  }

  async componentDidMount() {
    const { getTermsAndPolicy } = this.props;
    try {
      const response = await getTermsAndPolicy(TERMS_OF_SERVICE);
      // console.log("37825412761907858734 RESPONSE --->",response);
      const { status, payload: { data } = {} } = response;
      if (status === true) {
        const { [TERMS_OF_SERVICE]: { content } = {} } = data || {};
        this.setState({ value: content });
      }
    } catch (error) {
      console.log("37825412761907858734 ===> error", error);
      message.warn("Something went wrong");
    }
  }

  formatMessage = (data) => this.props.intl.formatMessage(data);

  markChecked = (e) => {
    e.preventDefault();
    const { checked } = this.state;
    this.setState({ checked: !checked });
  };

  handleGiveConsent = async (e) => {
    e.preventDefault();
    try {
      const { giveUserConsent, history, getInitialData } = this.props;

      const response = await giveUserConsent({ agreeConsent: true });
      const {
        status,
        statusCode,
        payload: { data = {}, message: resp_msg = "" } = {},
      } = response || {};
      // console.log("37825412761907858734 CONSENT RES",{response});
      if (status) {
        message.success(resp_msg);
        getInitialData();
        history.push(PATH.DASHBOARD);
      } else {
        message.warn(resp_msg);
      }
    } catch (error) {
      message.warn(error);
      console.log("err --->", error);
    }
  };

  render() {
    const { checked = false, value = "" } = this.state;
    return (
      <div className="wp100 landing-background flex direction-column justify-center align-center">
        <div className="hp100 wp75">
          <div className="mt40 wp100 mt24 flex justify-space-between align-center direction-row ">
            <div className="flex direction-row align-center">
              <img
                alt="adherelive-logo"
                src={CompanyIcon}
                className="company-logo"
              />
              <div className="text-white fs28 medium italic">
                {this.formatMessage(messages.appName)}
              </div>
            </div>
          </div>
          <div className="wp100 bg-white hauto mt28 p20 tal">
            <div className="wp100 flex align-center mt10 mb36">
              <div className="pl10 fs28 fw700 italic">
                {this.formatMessage(messages.tos)}
              </div>
            </div>

            <div className="p10 h400 mb20" style={{ overflowY: "scroll" }}>
              <ReactMarkdown>{value}</ReactMarkdown>
            </div>

            <div className="mt20 flex align-center justify-space-between">
              <div className="flex direction-column align-center justify-center">
                <Checkbox
                  checked={checked}
                  onClick={this.markChecked}
                  //   className="mt20"
                >
                  <span className="fs20 fw600 ml12">
                    {this.formatMessage(messages.giveConsent)}
                  </span>
                </Checkbox>
              </div>

              <Button
                disabled={!checked}
                type={"primary"}
                size={"large"}
                onClick={this.handleGiveConsent}
              >
                {this.formatMessage(messages.submit)}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(UserConsent);
