import React, { Component } from "react";
import { injectIntl } from "react-intl";
import messages from "./messages";
// import {formatMessage} from "react-intl/src/format";
import { withRouter } from "react-router-dom";

class Steps extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  formatMessage = (data) => this.props.intl.formatMessage(data);

  render() {
    const { current = 0 } = this.props;
    return (
      <div className="custom-steps-container">
        <div className="step-line-container h60">
          <div className="step-line-active" />
        </div>
        <div className="step-data-container ">
          <div className="step-active-text">
            {this.formatMessage(messages.profile)}
          </div>
          <div className="step-active-div">
            <div className="step-active-text">1</div>
          </div>
        </div>
        <div className="step-line-container h80">
          <div className={current >= 1 ? "step-line-active" : "step-line"} />
        </div>
        <div className="step-data-container">
          <div
            className={current >= 1 ? "step-active-text" : "step-inactive-text"}
          >
            {this.formatMessage(messages.qualification)}
          </div>
          <div
            className={current >= 1 ? "step-active-div" : "step-inactive-div"}
          >
            <div
              className={
                current >= 1 ? "step-active-text" : "step-inactive-text"
              }
            >
              2
            </div>
          </div>
        </div>
        <div className="step-line-container h80">
          <div className={current >= 2 ? "step-line-active" : "step-line"} />
        </div>
        <div className="step-data-container">
          <div
            className={current >= 2 ? "step-active-text" : "step-inactive-text"}
          >
            {this.formatMessage(messages.clinics)}
          </div>
          <div
            className={current >= 2 ? "step-active-div" : "step-inactive-div"}
          >
            <div
              className={
                current >= 2 ? "step-active-text" : "step-inactive-text"
              }
            >
              3
            </div>
          </div>
        </div>
        <div className="step-line-container h100">
          <div className="step-line" />
        </div>
      </div>
    );
  }
}

export default withRouter(injectIntl(Steps));
