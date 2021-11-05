import { getName } from "../../../../Helper/validation";
import React, { Component } from "react";
import { injectIntl } from "react-intl";
import message from "antd/es/message";
import { getFullName } from "../../../../Helper/common";
import { Icon } from "antd";
import messages from "../messages";
import { Tooltip } from "antd";

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

    const { formatMessage } = this;

    const {
      patientData: {
        basic_info: { first_name, middle_name, last_name, id } = {},
      } = {},
      chatData: { messages: { unread = "0" } = {} } = {},
      onRowClick,
    } = this.props || {};

    const { patientData: { basic_info: { age, gender = "" } = {} } = {} } =
      this.props || {};

    return (
      <div
        className="wp100 p10 flex align-center justify-space-between"
        onClick={onRowClick(id)}
      >
        <div className="wp100 p10 flex direction-column align-left ">
          <div className="fw600 tab-color ">
            {`${getName(first_name)}  ${getName(middle_name)} ${getName(
              last_name
            )}`}
          </div>
          <div className="flex direction-row  align-left">
            <div>{age ? `${age}` : "--"}</div>

            <div>{gender ? `, ${gender.toUpperCase()}` : ", --"}</div>
          </div>
        </div>
        {unread === "0" ? (
          ""
        ) : (
          <div className="br50 w20 h20 bg-red text-white text-center ml10">
            {unread}
          </div>
        )}

        <div
          className=" flex align-center justify-space-between"
          onClick={this.stopEventBubbling}
        >
          {isAdded ? (
            <Tooltip title={formatMessage(messages.removeFromWatchlist)}>
              <Icon
                type="eye"
                className="fs20"
                value={isAdded}
                onClick={this.removeFromWatchlist}
              />
            </Tooltip>
          ) : (
            <Tooltip title={formatMessage(messages.addToWatchlist)}>
              <Icon
                type="eye-invisible"
                theme="filled"
                className="fs20"
                value={isAdded}
                onClick={this.addThisToWatchlist}
              />
            </Tooltip>
          )}
        </div>
      </div>
    );
  }
}

export default injectIntl(Watchlist);
