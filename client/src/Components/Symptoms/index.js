import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Tabs, message } from "antd";

import Timeline from "./timeline";
import Summary from "./summary";
import messages from "./message";

const TABS = {
  TIMELINE: "1",
  SUMMARY: "2",
};

const { TabPane } = Tabs;

class SymptomsTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: TABS.TIMELINE,
    };
  }

  componentDidMount() {
    const { getSymptomTimeLine, patientId } = this.props;
    getSymptomTimeLine(patientId);
  }

  onRowSymptoms = (record, rowIndex) => {
    console.log("utsdiyqwtdyyqwfduyqwfudydqwd=======>", record);
    const { onRowClickSymptoms } = this;
    // const { key } = record;
    return {
      onClick: onRowClickSymptoms(record),
    };
  };

  handleSubmitTemplate = (data) => {
    const {
      addCarePlanMedicationsAndAppointments,
      getMedications,
      getAppointments,
      care_plans,
      patient_id,
      getPatientCarePlanDetails,
    } = this.props;
    let carePlanId = 1;
    for (let carePlan of Object.values(care_plans)) {
      let {
        basic_info: { id = 1, patient_id: patientId = 1 },
      } = carePlan;
      if (patient_id == patientId) {
        carePlanId = id;
      }
    }
    addCarePlanMedicationsAndAppointments(data, carePlanId).then((response) => {
      const {
        status = false,
        statusCode,
        payload: {
          error: { error_type = "" } = {},
          message: errorMessage = "",
        } = {},
      } = response;
      if (status) {
        this.onCloseTemplate();

        message.success(this.formatMessage(messages.carePlanUpdated));
        getMedications(patient_id).then(() => {
          getAppointments(patient_id).then(() => {
            getPatientCarePlanDetails(patient_id);
          });
        });
      } else {
        if (statusCode === 422 && error_type == "slot_present") {
          message.error(this.formatMessage(messages.slotPresent));
        } else if (statusCode === 422) {
          message.error(errorMessage);
        } else {
          message.error(this.formatMessage(messages.somethingWentWrong));
        }
      }
    });
  };

  onChangeTab = (key) => () => {
    this.setState({
      currentTab: key,
    });
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  renderTabBar = () => {
    const { currentTab = TABS.TIMELINE } = this.state;
    return (
      <div class="flex justify-content-space-around">
        <div
          className={
            currentTab === TABS.TIMELINE
              ? " selectedTabBar  flex justify-center align-center timelineRadius"
              : " tabBar  flex justify-center align-center pointer timelineRadius"
          }
          onClick={this.onChangeTab(TABS.TIMELINE)}
        >
          {this.formatMessage(messages.timeline)}
        </div>
        <div
          className={
            currentTab === TABS.SUMMARY
              ? " selectedTabBar  flex justify-center align-center summaryRadius"
              : " tabBar  flex justify-center align-center pointer summaryRadius"
          }
          onClick={this.onChangeTab(TABS.SUMMARY)}
        >
          {this.formatMessage(messages.summary)}
        </div>
      </div>
    );
  };

  render() {
    const { currentTab = TABS.TIMELINE } = this.state;
    return (
      <div className="pt10 pr10 pb10 pl10 wp100 hp100">
        <Tabs activeKey={currentTab} renderTabBar={this.renderTabBar}>
          <TabPane
            tab={this.formatMessage(messages.timeline)}
            key={TABS.TIMELINE}
          >
            <Timeline {...this.props} />
          </TabPane>
          <TabPane
            tab={this.formatMessage(messages.summary)}
            key={TABS.SUMMARY}
          >
            <Summary {...this.props} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default injectIntl(SymptomsTab);
