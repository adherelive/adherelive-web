import React, { Component } from "react";
import { injectIntl } from "react-intl";
import messages from "../message";
import {
  GENDER,
  TABLET,
  SYRUP,
  PARTS,
  PART_LIST_CODES,
} from "../../../../constant";

import { getName } from "../../../../Helper/validation";

import { Tabs, Table, Menu, Dropdown, Spin, message, Button } from "antd";

class patientCarePlans extends Component {
  constructor(props) {
    super(props);

    this.state = {
      care_plans: {},
      current_careplan_id: null,
    };
  }

  componentDidMount() {
    let { getPatientCarePlanDetails, patient_id } = this.props;

    getPatientCarePlanDetails(patient_id).then((response) => {
      let { status = false, payload = {} } = response;
      console.log(
        "respOnseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee -->",
        response
      );
      if (status) {
        let {
          data: { show = false, care_plans = {}, current_careplan_id } = {},
        } = payload;

        console.log("Cureent careplan ====>", care_plans, current_careplan_id);

        this.setState({
          care_plans,
          current_careplan_id,
        });
      }
    });
  }

  getActiveInactiveOptions = (isActive = false) => {
    if (isActive) {
      return (
        <div className="active-inactive-careplan">
          <div className="active-careplan">
            {this.formatMessage(messages.activeCareplan)}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  getAllCarePlans = (care_plans, current_careplan_id) => {
    let allCarePlans = [];
    let currentCarePlan = this.getCurrentCarePlan(
      care_plans,
      current_careplan_id
    );
    allCarePlans.push(currentCarePlan);

    let allOtherCarePlans = this.getCarePlans(care_plans, current_careplan_id);
    allCarePlans.push(allOtherCarePlans);
    return allCarePlans;
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  getCurrentCarePlan = (care_plans, current_careplan_id) => {
    const { treatments, doctors } = this.props;
    const { basic_info: { first_name = "", last_name = "" } = {} } =
      Object.values(doctors)[0] || {};

    const { details: { treatment_id } = {} } =
      care_plans[current_careplan_id] || {};
    const { basic_info: { name = "" } = {} } = treatments[treatment_id] || {};
    return (
      <div className="careplanListOption">
        <div>
          <h3>{name}</h3>
          <h5>{`${first_name} ${getName(last_name)}`} </h5>
        </div>
        {this.getActiveInactiveOptions(true)}
      </div>
    );
  };

  getCarePlans = (care_plans, current_careplan_id) => {
    const { treatments } = this.props;

    const nonCurrentCareplans = [];
    for (let eachId in care_plans) {
      const { details: { treatment_id } = {} } = care_plans[eachId] || {};
      const { basic_info: { name = "" } = {} } = treatments[treatment_id] || {};
      if (eachId !== JSON.stringify(current_careplan_id)) {
        nonCurrentCareplans.push(
          <div className="careplanListOption">
            <div>
              <h3>{this.formatMessage(messages.careplanHeading)}</h3>
            </div>
            {this.getActiveInactiveOptions()}
          </div>
        );
      }
    }

    return nonCurrentCareplans;
  };

  render() {
    const { care_plans, current_careplan_id } = this.state;
    const allCarePlans = this.getAllCarePlans(care_plans, current_careplan_id);

    return <div className="careplanList">{allCarePlans}</div>;
  }
}

export default injectIntl(patientCarePlans);
