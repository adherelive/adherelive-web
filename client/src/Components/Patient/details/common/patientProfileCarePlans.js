import React, { Component } from "react";
import { injectIntl } from "react-intl";
import Button from "antd/es/button";

import { getAuthCategory, getFullName } from "../../../../Helper/common";
import careplanBg from "../../../../Assets/images/careplan-access-bg.png";
import {
  DIAGNOSIS_TYPE,
  FINAL,
  PROBABLE,
  TABLE_DEFAULT_BLANK_FIELD,
} from "../../../../constant";
import messages from "./messages";
import isEmpty from "./../../../../Helper/is-empty";

class PatientCarePlans extends Component {
  constructor(props) {
    super(props);
  }

  getCarePlanStatus = (expired_on) => {
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
      intl: { formatMessage } = {},
      auth_role,
    } = this.props;
    const { getCarePlanStatus } = this;
    const authDoctor = getAuthCategory({ doctors, authenticated_user });

    const { care_plan_ids = {}, basic_info: { id: doctorId } = {} } =
      authDoctor || {};

    const patientCarePlans = care_plan_ids[auth_role].filter((id) => {
      const { basic_info: { patient_id: carePlanPatientId = "0" } = {} } =
        care_plans[id] || {};

      if (carePlanPatientId.toString() === patient_id) {
        return id;
      }
    });

    patientCarePlans.sort((carePlanIdA, carePlanIdB) => {
      const { basic_info: { doctor_id: doctorA } = {}, expired_on = null } =
        care_plans[carePlanIdA] || {};

      if (doctorA === doctorId && !expired_on) {
        return -1;
      } else {
        return 1;
      }
    });

    return patientCarePlans.map((id, index) => {
      const {
        basic_info: {
          doctor_id,
          patient_id: carePlanPatientId,
          user_role_id = null,
          doctor = {},
        } = {},
        details: {
          treatment_id,
          diagnosis: { type = "1", description = "" } = {},
        } = {},
        expired_on,
      } = care_plans[id] || {};
      const { basic_info: { name } = {} } = treatments[treatment_id] || {};
      const { basic_info: { first_name, middle_name, last_name } = {} } =
        doctors[doctor_id] || {};

      const { auth_role = null, providers = {}, user_roles = {} } = this.props;

      const { basic_info: { linked_id = null } = {} } =
        user_roles[user_role_id] || {};

      const { basic_info: { name: provider_name = "" } = {} } =
        providers[linked_id] || {};

      console.log("6tr678656", care_plans[id]);

      return (
        <div
          key={`cp-${id}`}
          onClick={handleCarePlanChange(id)}
          className={`pointer flex justify-space-between align-center p10 br5 ${
            selectedCarePlanId === id ? "bg-lighter-blue" : ""
          }`}
        >
          <div>
            <div className="fs18 black-85 fw700">
              {description ? description : TABLE_DEFAULT_BLANK_FIELD}
            </div>
            <div className="fw700 brown-grey">{name}</div>
            <div className="fw700 brown-grey">
              {
                doctorId === doctor_id
                  ? auth_role.toString() == user_role_id.toString()
                    ? formatMessage(messages.with_you_text)
                    : linked_id
                    ? `${formatMessage(
                        messages.with_you_text
                      )} (${provider_name})`
                    : `${formatMessage(messages.with_you_text)} (Self)`
                  : `Dr ${!isEmpty(doctor) && doctor.full_name}`
                //PREV CHNAGES
                // `Dr. ${getFullName({
                //     first_name,
                //     middle_name,
                //     last_name,
                //   })}`
              }
            </div>
          </div>
          <div className="fw700 brown-grey">
            {getCarePlanStatus(expired_on)}
          </div>
        </div>
      );
    });
  };

  // getHiddenCarePlans = () => {
  //   const {
  //     care_plans,
  //     doctors,
  //     authenticated_user,
  //     patientCarePlanIds,
  //     intl: { formatMessage } = {}
  //   } = this.props;
  //   const { getCarePlanStatus } = this;

  //   const authDoctor = getAuthCategory({ doctors, authenticated_user });

  //   const { care_plan_ids = [] } = authDoctor || {};

  //   let hiddenCarePlans = [];

  //   patientCarePlanIds.forEach((id, index) => {
  //     if (!care_plan_ids.includes(id)) {
  //       const { expired_on } = care_plans[id] || {};
  //       hiddenCarePlans.push(
  //         <div
  //           key={`cp-no-consent-${id}`}
  //           className={`flex justify-space-between align-center p10 br5`}
  //         >
  //           <div className="fs18 fw700">{`${formatMessage(
  //             messages.careplan_text
  //           )} ${index + 1}`}</div>
  //           <div className="">{getCarePlanStatus(expired_on)}</div>
  //         </div>
  //       );
  //     }
  //   });

  //   return hiddenCarePlans;
  // };

  getHiddenCarePlans = () => {
    const { renderFooter } = this;
    return (
      <div className="wp100 h180 relative ">
        <img
          alt="careplan-bg-img"
          src={careplanBg}
          style={{ height: "100%", width: "100%" }}
        ></img>
        {renderFooter()}
      </div>
    );
  };

  // renderFooter = () => {
  //   const { intl: { formatMessage } = {}, handleRequestConsent } = this.props;

  //   return (
  //     <div onClick={handleRequestConsent}>
  //       <Button type={"primary"} block={true}>
  //         {formatMessage(messages.request_access_text)}
  //       </Button>
  //     </div>
  //   );
  // };

  renderFooter = () => {
    const { intl: { formatMessage } = {}, handleRequestConsent } = this.props;

    return (
      <div className="absolute l0 t0 wp100 hp100  flex direction-column align-center justify-center">
        <span className="fw700 fs18">
          {formatMessage(messages.patientOtherTreatmentPlans)}
        </span>
        <span
          onClick={handleRequestConsent}
          className="tab-color pointer fw700 fs19"
        >
          {formatMessage(messages.request_access_text)}
        </span>
      </div>
    );
  };

  hideFooter = () => {
    const { doctors, authenticated_user, patientCarePlanIds, auth_role } =
      this.props;

    const authDoctor = getAuthCategory({ doctors, authenticated_user });

    const { care_plan_ids = [] } = authDoctor || {};

    const hiddenCarePlanIds = patientCarePlanIds.filter((id) => {
      return !care_plan_ids[auth_role].includes(id);
    });

    return hiddenCarePlanIds.length > 0 ? false : true;
  };

  render() {
    const { intl: { formatMessage } = {} } = this.props;
    const {
      getVisibleCarePlans,
      getHiddenCarePlans,
      renderFooter,
      hideFooter,
    } = this;

    return (
      <div className="mt18">
        <div className="fs18 fw700">
          {formatMessage(messages.treatment_plans_text)}
        </div>
        <div className="br5 bw-faint-grey">{getVisibleCarePlans()}</div>
        {!hideFooter() && getHiddenCarePlans()}
      </div>
    );
  }
}

export default injectIntl(PatientCarePlans);
