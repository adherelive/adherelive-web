import React, { Component } from "react";
import { injectIntl } from "react-intl";
import message from "antd/es/message";
import ReactMarkdown from "react-markdown";
import CompanyIcon from "../../../Assets/images/logo3x.png";
import messages from "./message";

const TERMS_OF_PAYMENT = "terms_of_payment";

class TermsOfPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
  }

  formatMessage = (message) => this.props.intl.formatMessage(message);

  async componentDidMount() {
    const { getTAC } = this.props;
    try {
      const url = window.location.href.split("/");

      const id = url.length > 4 ? url[url.length - 1] : null;

      const tacId = id;

      const response = await getTAC(tacId);
      const { status, payload: { data } = {} } = response;

      if (status === true) {
        const { terms_and_conditions = {} } = data;
        const {
          basic_info: { terms_type = "", details: { content = {} } = {} } = {},
        } = terms_and_conditions[tacId] || {};

        this.setState({ value: content });
      }
    } catch (error) {
      console.log("23742747327423y742 ===>", { error });
      message.warn("Something went wrong");
    }
  }

  render() {
    const { value } = this.state;
    return (
      <div className="wp100 p10 fs18">
        <div className="wp100 flex align-center mt10 mb36">
          <img
            alt="adherelive-logo"
            src={CompanyIcon}
            className="company-logo"
          />
          <div className="pl10 fs28 fw700 italic">
            {this.formatMessage(messages.appName)}
          </div>
        </div>
        <ReactMarkdown>{value}</ReactMarkdown>
      </div>
    );
  }
}

export default injectIntl(TermsOfPayment);
