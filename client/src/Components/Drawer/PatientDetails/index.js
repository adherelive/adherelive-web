import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Drawer, Icon } from "antd";
import ChatComponent from "../../../Containers/Chat";
import { GENDER, PATIENT_BOX_CONTENT } from "../../../constant";
import messages from "./message";

import CloseIcon from "../../../Assets/images/close.svg";
import ChatIcon from "../../../Assets/images/chat.svg";
import ClipIcon from "../../../Assets/images/clip.svg";

class PatientDetailsDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getFormattedDays = dates => {
    let dayString = [];
    dates.forEach(date => {
      const { day, time } = date || {};
      dayString.push(`${day} at ${time}`);
    });

    return dayString.join(",");
  };

  getMedicationList = () => {
    const { patients, id = "1", medications } = this.props;
    const { getFormattedDays } = this;
    const { medications: medication_ids = [] } = patients[id] || {};
    const medicationList = medication_ids.map(id => {
      const { basic_info: { medicine_name } = {}, schedule, end_date } =
        medications[id] || {};
      const { repeat_type, doses, date = [] } = schedule || {};
      return (
        <div className="flex justify-space-between align-center mb10">
          <div className="pointer tab-color fw600 flex-1">{medicine_name}</div>
          {date.length === 0 ? (
            <div className="flex-2">{`${doses}, ${repeat_type}`}</div>
          ) : (
            <div className="flex-2">{getFormattedDays(date)}</div>
          )}
          <div className="flex-1">{end_date}</div>
        </div>
      );
    });

    console.log("123781232 here");

    return medicationList;
  };

  getPatientDetailContent = () => {
    const { treatments, doctors, providers, patients, id = "1" } = this.props;
    const { formatMessage, getMedicationList } = this;
    const {
      basic_info: { name, age, gender } = {},
      reports = [],
      treatment_id,
      provider_id,
      doctor_id,
      condition
    } = patients[id] || {};

    const { basic_info: { treatment_type } = {}, severity_level, start_date } =
      treatments[treatment_id] || {};
    const { basic_info: { name: doctorName } = {} } = doctors[doctor_id] || {};
    const { basic_info: { name: providerName } = {} } =
      providers[provider_id] || {};
    return (
      <Fragment>
        <img src={CloseIcon} alt="close icon" />

        {/*header*/}

        <div className="wp100 flex justify-space-between align-center mt20">
          <div className="flex justify-space-around align-center">
            <div className="pr10 fs24 fw600">{name}</div>
            <div className="pr10 fs20 fw500">{`(${GENDER[gender]["view"]} ${age})`}</div>
            <Icon type="wechat" width={20} />
          </div>
          <img src={ClipIcon} alt="clip icon" className="pointer" />
        </div>

        {/*boxes*/}

        <div>
          {Object.keys(PATIENT_BOX_CONTENT).map(id => {
            const { total, critical } = reports[id] || {};
            return (
              <div
                className={`mt10 ml10 w235 h100 br5 bg-${PATIENT_BOX_CONTENT[id]["background_color"]} br-${PATIENT_BOX_CONTENT[id]["border_color"]} float-l flex direction-column justify-space-between`}
              >
                <div className="ml10 mt10 fs16 fw600">
                  {PATIENT_BOX_CONTENT[id]["text"]}
                </div>
                <div className="wp90 mauto pb10">
                  <div className="flex justify-space-between align-center">
                    <div className="fs14 fw400">
                      {formatMessage(messages.critical)}
                    </div>
                    <div>{critical}</div>
                  </div>
                  <div className="flex justify-space-between align-center">
                    <div>{formatMessage(messages.no_critical)}</div>
                    <div>{total - critical}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/*details*/}

        <div className="clearfix"></div>

        <div className="mt20">
          <div className="mt10 mb10 fs18 fw600">
            {formatMessage(messages.patient_details)}
          </div>
          <div className="fw500 black-85">
            <div className="flex justify-space-between align-center">
              <div className="flex-1">{formatMessage(messages.treatment)}</div>
              <div className="flex-2">{treatment_type}</div>
            </div>
            <div className="flex justify-space-between align-center">
              <div className="flex-1">{formatMessage(messages.severity)}</div>
              <div className="flex-2">{severity_level}</div>
            </div>
            <div className="flex justify-space-between align-center">
              <div className="flex-1">{formatMessage(messages.condition)}</div>
              <div className="flex-2">{condition}</div>
            </div>
            <div className="flex justify-space-between align-center">
              <div className="flex-1">{formatMessage(messages.doctor)}</div>
              <div className="flex-2">{doctorName}</div>
            </div>
            <div className="flex justify-space-between align-center">
              <div className="flex-1">{formatMessage(messages.start_date)}</div>
              <div className="flex-2">{start_date}</div>
            </div>
            <div className="flex justify-space-between align-center">
              <div className="flex-1">{formatMessage(messages.provider)}</div>
              <div className="flex-2">{providerName}</div>
            </div>
          </div>
        </div>

        {/*medications*/}

        <div className="mt20 black-85">
          <div className="mt10 mb10 fs18 fw600">
            {formatMessage(messages.medications)}
          </div>

          {getMedicationList()}
        </div>
      </Fragment>
    );
  };

  formatMessage = data => this.props.intl.formatMessage(data);

  render() {
    const { onClose, getPatientDetailContent } = this;
    return (
      <Fragment>
        <Drawer
          placement="right"
          closable={false}
          onClose={onClose}
          visible={false} // todo: change as per state, -- WIP --
          width={550}
        >
          {getPatientDetailContent()}
        </Drawer>
        {/*<ChatComponent {...this.props}/>*/}
        {/*<div className="chat-container">*/}

        {/*</div>*/}
      </Fragment>
    );
  }
}

export default injectIntl(PatientDetailsDrawer);
