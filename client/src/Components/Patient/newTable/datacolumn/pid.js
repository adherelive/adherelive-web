import { getName } from "../../../../Helper/validation";
import React, { Component } from "react";
import { injectIntl } from "react-intl";
import message from "antd/es/message";
import { getFullName } from "../../../../Helper/common";
import { Icon } from "antd";
import messages from "../messages";
import { Tooltip } from "antd";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";

class Watchlist extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {currentTab,handleGetPatients,tabChanged}=this.props;
  }

 
  
  formatMessage = data => this.props.intl.formatMessage(data);


  addThisToWatchlist = e => {
    e.preventDefault();
    const {
      patientData: {
         id, first_name, middle_name, last_name
      } = {},
      addToWatchlist,
      handleGetPatients
    } = this.props || {};


    addToWatchlist(id).then(response => {
      const { status, message: errMessage } = response || {};
      if (status === true) {
        message.success(
          `${getFullName({
            first_name,
            middle_name,
            last_name
          })} ${this.formatMessage(messages.addedToWatchlist)}`
        );
      } else {
        message.warn(errMessage);
      }
    });


    handleGetPatients();

  };



  removeFromWatchlist = e => {
    e.preventDefault();
    const {
      patientData: {
          id, first_name, middle_name, last_name 
      } = {},
      removePatientFromWatchlist,
      handleGetPatients
    } = this.props || {};

    removePatientFromWatchlist(id).then(response => {
      const { status, message: errMessage } = response || {};
      if (status === true) {
        message.success(
          `${getFullName({
            first_name,
            middle_name,
            last_name
          })} ${this.formatMessage(messages.removedFromWatchlist)}`
        );
      } else {
        message.warn(errMessage);
      }
    });


    handleGetPatients();

  };

  stopEventBubbling = e => {
    e.stopPropagation();
  };

  render() {


    const {formatMessage}=this;

    const {
      patientData: {
          first_name, middle_name, last_name, id 
      } = {},
      onRowClick,
      doctorData: { watchlist_ids = []} = {}
    } = this.props || {};

    const { patientData: 
         { age, gender = "" } = {},
         auth_role }
           = this.props || {};

    const  watchlist_patient_ids =  watchlist_ids[auth_role.toString()] || [];      

    const isAdded = watchlist_patient_ids.includes(id);

    return (
      <div
        className="wp100 p10 flex align-center justify-space-between"
        onClick={onRowClick(id)}
      >
        <div className="wp100 p10 flex direction-column align-left ">
          <div className="fw600 tab-color ">
            {`${getName(first_name)}  ${getName(middle_name)} ${getName(last_name)}`}
          </div>
          <div className="flex direction-row  align-left">
            <div>{age ? `${age}` : TABLE_DEFAULT_BLANK_FIELD}</div>

            <div>{gender ? `, ${gender.toUpperCase()}` : `, ${TABLE_DEFAULT_BLANK_FIELD}`}</div>
          </div>
        </div>
        

        <div
          className=" flex align-center justify-space-between"
          onClick={this.stopEventBubbling}
        >
          {isAdded ? (
            <Tooltip title={formatMessage(messages.removeFromWatchlist)} >
              <Icon
                type="eye"
                className="fs20"
                value={isAdded}
                onClick={this.removeFromWatchlist}
              />
            </Tooltip>
          ) : (
            <Tooltip title={formatMessage(messages.addToWatchlist)} >
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

