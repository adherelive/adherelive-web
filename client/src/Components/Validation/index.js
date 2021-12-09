import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { message } from "antd";
import Loading from "../Common/Loading";
import messages from "./message";
import { withRouter } from "react-router-dom";

class ValidationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: true,
    };
  }

  async componentDidMount() {
    const { link = "" } = this.props.match.params;
    if (link) {
      const { verifyUser } = this.props;
      let response = await verifyUser(link);
      //   .then(response=>{
      const { status, statusCode } = response;
      if (!status) {
        if (statusCode === 422) {
          message.error(this.formatMessage(messages.linkExpired));
          this.props.history.replace("/");
        } else {
          message.error(this.formatMessage(messages.somethingWentWrong));
          this.props.history.replace("/");
        }
      } else {
        message.success(this.formatMessage(messages.accountVerified));
      }
    }
  }

  formatMessage = (data) => this.props.intl.formatMessage(data);

  render() {
    return (
      <div className="wp100 hp100 flex justify-center align-center">
        <Loading />
      </div>
    );
  }
}

export default withRouter(injectIntl(ValidationPage));
