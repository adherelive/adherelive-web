import React, { Component } from "react";
// import AppHeader from "../../Containers/Header";
import "./style.less";
import { injectIntl } from "react-intl";
import messages from "./messages";

import { PATH } from "../../constant";

class BlankState extends Component {
  componentDidMount() {
    const { auth: { authenticated } = {}, location: { pathname } = {} } =
      this.props;
    if (!authenticated) {
      this.props.history.push(pathname);
    }
  }

  goHome = (e) => {
    e.preventDefault();
    // this.props.resetUnauthorizedError();

    this.props.history.push(PATH.LANDING_PAGE);
  };

  // componentWillUnmount() {
  //   this.props.resetUnauthorizedError();
  // }

  render() {
    const { intl: { formatMessage } = {} } = this.props;
    return (
      <div className="eror-page-container">
        <div
          className="dark medium fontsize14 go-home-btn pointer"
          onClick={this.goHome}
        >
          {formatMessage(messages.description)}
        </div>
      </div>
    );
  }
}

export default injectIntl(BlankState);
