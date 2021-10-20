import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";

import iconUpload from "./iconUpload";
import bannerUpload from "./bannerUpload";

import messages from "../message";

class Customization extends Component {
  constructor(props) {
    super(props);
  }

  formatMessage = (message) => this.props.intl.formatMessage(message);

  render() {
    const { formatMessage } = this;
    return (
      <Fragment>
        <span className="fw600 fs18 mb20 mt20 flex align-center justify-space-between">
          {formatMessage(messages.customization)}
        </span>

        {iconUpload.render(this.props)}
        {bannerUpload.render(this.props)}
      </Fragment>
    );
  }
}

export default injectIntl(Customization);
