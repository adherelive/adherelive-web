import React, { Component } from "react";
import { injectIntl } from "react-intl";
import message from "antd/es/message";
import { getFullName } from "../../../../Helper/common";
import { Icon } from "antd";
import messages from "../messages";

class Watchlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdded: false,
    };
  }

  componentDidMount() {
    const {
      patientData: { basic_info: { id } = {} } = {},
      doctorData: { watchlist_patient_ids = [] } = {},
    } = this.props || {};

    if (watchlist_patient_ids.includes(id)) {
      this.setState({ isAdded: true });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      patientData: { basic_info: { id: prev_id } = {} } = {},
      doctorData: {
        watchlist_patient_ids: prev_watchlist_patient_ids = [],
      } = {},
    } = prevProps || {};

    const {
      patientData: { basic_info: { id } = {} } = {},
      doctorData: { watchlist_patient_ids = [] } = {},
    } = this.props || {};

    if (
      prev_watchlist_patient_ids.length !== watchlist_patient_ids.length &&
      !watchlist_patient_ids.includes(id)
    ) {
      this.setState({
        isAdded: watchlist_patient_ids.includes(id),
      });
    }
  }

  formatMessage = (data) => this.props.intl.formatMessage(data);

  addThisToWatchlist = (e) => {
    e.preventDefault();
    const {
      patientData: {
        basic_info: { id, first_name, middle_name, last_name } = {},
      } = {},
      addToWatchlist,
    } = this.props || {};

    addToWatchlist(id).then((response) => {
      const { status, message: errMessage } = response || {};
      if (status === true) {
        message.success(
          `${getFullName({
            first_name,
            middle_name,
            last_name,
          })} ${this.formatMessage(messages.addedToWatchlist)}`
        );
      } else {
        message.warn(errMessage);
      }
    });

    this.setState({
      isAdded: true,
    });
  };

  removeFromWatchlist = (e) => {
    e.preventDefault();
    const {
      patientData: {
        basic_info: { id, first_name, middle_name, last_name } = {},
      } = {},
      removePatientFromWatchlist,
    } = this.props || {};

    removePatientFromWatchlist(id).then((response) => {
      const { status, message: errMessage } = response || {};
      if (status === true) {
        message.success(
          `${getFullName({
            first_name,
            middle_name,
            last_name,
          })} ${this.formatMessage(messages.removedFromWatchlist)}`
        );
      } else {
        message.warn(errMessage);
      }
    });

    this.setState({
      isAdded: false,
    });
  };

  stopEventBubbling = (e) => {
    e.stopPropagation();
  };

  render() {
    const { isAdded } = this.state;
    return (
      <div
        className=" flex align-center justify-space-between"
        onClick={this.stopEventBubbling}
      >
        {isAdded ? (
          <Icon
            type="eye-invisible"
            theme="filled"
            className="fs24"
            value={isAdded}
            onClick={this.addThisToWatchlist}
          />
        ) : (
          <Icon
            type="eye"
            className="fs24"
            value={isAdded}
            onClick={this.removeFromWatchlist}
          />
        )}
      </div>
    );
  }
}

export default injectIntl(Watchlist);
