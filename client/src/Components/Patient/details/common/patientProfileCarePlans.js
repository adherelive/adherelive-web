import React, { Component } from "react";
import { injectIntl } from "react-intl";
import Button from "antd/es/button";

import { getAuthCategory, getFullName } from "../../../../Helper/common";
import messages from "./messages";

class PatientCarePlans extends Component {
  constructor(props) {
    super(props);
  }

  getCarePlanStatus = expired_on => {
    const { intl: { formatMessage } = {} } = this.props;
    return expired_on
      ? formatMessage(messages.inactive_careplan)
      : formatMessage(messages.active_careplan);
  };

  getVisibleCarePlans = () => {
    const {
      doctors,
      care_plans,
      authenticated_user,
      treatments,
      handleCarePlanChange,
      selectedCarePlanId,
        patient_id,
        intl: {formatMessage} = {}
    } = this.props;
    const { getCarePlanStatus } = this;
    const authDoctor = getAuthCategory({ doctors, authenticated_user });

    const { care_plan_ids = [], basic_info: {id : doctorId} = {} } = authDoctor || {};

    const patientCarePlans = care_plan_ids.filter(id => {
      const {
        basic_info: { patient_id: carePlanPatientId = "0" } = {},
      } = care_plans[id] || {};

      if(carePlanPatientId.toString() === patient_id) {
        return id;
      }
    });

    patientCarePlans.sort((carePlanIdA, carePlanIdB) => {
      const {basic_info: {doctor_id: doctorA} = {}, expired_on = null} = care_plans[carePlanIdA] || {};

      if(doctorA === doctorId && !expired_on) {
        return -1;
      } else {
        return 1;
      }
    });

    return patientCarePlans.map((id, index) => {
      const {
        basic_info: { doctor_id, patient_id: carePlanPatientId } = {},
        details: { treatment_id } = {},
        expired_on
      } = care_plans[id] || {};
      const { basic_info: { name } = {} } = treatments[treatment_id] || {};
      const { basic_info: { first_name, middle_name, last_name } = {} } =
        doctors[doctor_id] || {};

      return (
        <div
          key={`cp-${id}`}
          onClick={handleCarePlanChange(id)}
          className={`pointer flex justify-space-between align-center p10 br5 ${selectedCarePlanId === id ? "bg-lighter-blue" : ""}`}
        >
          <div>
            <div className="fs18 fw700 blueish-purple">{name}</div>
            <div className="blueish-purple">{doctorId === doctor_id ? formatMessage(messages.with_you_text) : `Dr. ${getFullName({
              first_name,
              middle_name,
              last_name
            })}`}</div>
          </div>
          <div className="blueish-purple">{getCarePlanStatus(expired_on)}</div>
        </div>
      );
    });
  };

  getHiddenCarePlans = () => {
    const {
      care_plans,
      doctors,
      authenticated_user,
      patientCarePlanIds,
      intl: { formatMessage } = {}
    } = this.props;
    const { getCarePlanStatus } = this;

    const authDoctor = getAuthCategory({ doctors, authenticated_user });

    const { care_plan_ids = [] } = authDoctor || {};

    let hiddenCarePlans = [];

    patientCarePlanIds.forEach((id, index) => {
      if (!care_plan_ids.includes(id)) {
        const { expired_on } = care_plans[id] || {};
        hiddenCarePlans.push(
          <div
            key={`cp-no-consent-${id}`}
            className={`flex justify-space-between blueish-purple align-center p10 br5`}
          >
            <div className="fs18 fw700 blueish-purple">{`${formatMessage(
              messages.careplan_text
            )} ${index + 1}`}</div>
            <div className="blueish-purple">{getCarePlanStatus(expired_on)}</div>
          </div>
        );
      }
    });

    return hiddenCarePlans;
  };

  renderFooter = () => {
    const { intl: { formatMessage } = {}, handleRequestConsent } = this.props;

    return (
      <div onClick={handleRequestConsent}>
        <Button type={"primary"} block={true}>
          {formatMessage(messages.request_consent_text)}
        </Button>
      </div>
    );
  };

  hideFooter = () => {
    const { doctors, authenticated_user, patientCarePlanIds } = this.props;

    const authDoctor = getAuthCategory({ doctors, authenticated_user });

    const { care_plan_ids = [] } = authDoctor || {};

    const hiddenCarePlanIds = patientCarePlanIds.filter(id => {
      return !care_plan_ids.includes(id);
    });

    return hiddenCarePlanIds.length > 0 ? false : true;
  };

  render() {
    const {intl: {formatMessage} = {}} = this.props;
    const {
      getVisibleCarePlans,
      getHiddenCarePlans,
      renderFooter,
      hideFooter
    } = this;

    return (
      <div className="mt18">
        <div className="fs18 fw500 blueish-purple">{formatMessage(messages.treatment_plans_text)}</div>
          <div className="br5 bw-purple">
            {getVisibleCarePlans()}
            {getHiddenCarePlans()}
          </div>
        {!hideFooter() && renderFooter()}
      </div>
    );
  }
}

export default injectIntl(PatientCarePlans);
