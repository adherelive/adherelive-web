import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Drawer, message, Spin } from "antd";
import MissedDietCard from "../../Cards/patient/missedDiet";
import { USER_CATEGORY } from "../../../constant";

import messages from "./message";

class MissedDietsDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      missed_diets: {},
      criticalDietIds: [],
      nonCriticalDietIds: [],
      fetching: false,
    };
  }

  componentDidMount() {
    // this.getMissedDiet();
  }

  formatMessage = (data) => this.props.intl.formatMessage(data);

  onClose = () => {
    const { close } = this.props;
    close();
  };

  handlePatientDetailsRedirect = (patient_id) => (e) => {
    const { authenticated_category } = this.props;

    if (authenticated_category === USER_CATEGORY.PROVIDER) {
      return;
    }

    const { history } = this.props;
    this.onClose();
    history.push(`/patients/${patient_id}`);
  };

  getDietList = () => {
    const { patients = {}, missed_diets = {} } = this.props;
    const { handlePatientDetailsRedirect, formatMessage } = this;

    const dietList = [];
    const criticalList = [];
    const nonCriticalList = [];

    Object.keys(missed_diets).forEach((id) => {
      const {
        critical,
        participant_id,
        diet_name = "",
        timings,
      } = missed_diets[id] || {};

      const { basic_info: { id: patientId, full_name } = {} } =
        patients[participant_id] || {};

      if (critical) {
        criticalList.push(
          <MissedDietCard
            formatMessage={formatMessage}
            name={full_name}
            time={timings}
            diet_name={diet_name}
            onClick={handlePatientDetailsRedirect(patientId)}
          />
        );
      } else {
        nonCriticalList.push(
          <MissedDietCard
            formatMessage={this.formatMessage}
            name={full_name}
            time={timings}
            diet_name={diet_name}
            onClick={handlePatientDetailsRedirect(patientId)}
          />
        );
      }
    });

    dietList.push(
      <div>
        <div>
          <span className="fs18 fw700 brown-grey tac mb20">
            {this.formatMessage(messages.critical)}
          </span>
          {criticalList.length > 0 ? (
            criticalList
          ) : (
            <div className="mt10 mb10">
              {this.formatMessage(messages.no_critical_missed)}
            </div>
          )}
        </div>
        <div>
          <span className="fs18 fw700 brown-grey tac">
            {this.formatMessage(messages.non_critical)}
          </span>
          {nonCriticalList.length > 0 ? (
            nonCriticalList
          ) : (
            <div className="mt10 mb10">
              {this.formatMessage(messages.no_non_critical_missed)}
            </div>
          )}
        </div>
      </div>
    );
    return dietList;
  };

  render() {
    const { visible = false } = this.props;
    const { fetching } = this.state;

    if (visible !== true) {
      return null;
    }
    return (
      <Fragment>
        <Drawer
          title={this.formatMessage(messages.diet_header)}
          placement="right"
          maskClosable={false}
          onClose={this.onClose}
          visible={visible}
          width={`30%`}
        >
          <div className="mt20 black-85 wp100">
            {fetching ? (
              <Spin size="small" className="flex align-center justify-center" />
            ) : (
              this.getDietList()
            )}
          </div>
        </Drawer>
      </Fragment>
    );
  }
}

export default injectIntl(MissedDietsDrawer);
