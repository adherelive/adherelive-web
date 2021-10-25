import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import {
  USER_PERMISSIONS,
  MISSED_MEDICATION,
  MISSED_APPOINTMENTS,
  MISSED_ACTIONS,
  MISSED_DIET,
  MISSED_WORKOUT,
} from "../../../constant";

import MissedAppointmentsDrawer from "../../../Containers/Drawer/missedAppointment";
import MissedVitalsDrawer from "../../../Containers/Drawer/missedVital";
import MissedMedicationsDrawer from "../../../Containers/Drawer/missedMedication";
import MissedDietsDrawer from "../../../Containers/Drawer/missedDiet";
import MissedWorkoutsDrawer from "../../../Containers/Drawer/missedWorkout";

// antd components
import Button from "antd/es/button";
import Menu from "antd/es/menu";
import Dropdown from "antd/es/dropdown";
import message from "antd/es/message";
import Spin from "antd/es/spin";

import messages from "./messages";
import DoctorTable from "../../../Containers/Doctor/table";
import GraphsModal from "./graphsModal";
import Donut from "../../Common/graphs/donut";

const CHART_MISSED_MEDICATION = "Missed Medication";
const CHART_MISSED_APPOINTMENT = "Missed Appointment";
const CHART_MISSED_ACTION = "Missed Action";
const CHART_MISSED_DIET = "Missed Diet";
const CHART_MISSED_WORKOUT = "Missed Workout";

class ProviderDoctorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleModal: false,
      graphsToShow: [],
      graphLoading: false,
    };
  }

  componentDidMount() {
    const { getGraphs, getAllMissedScheduleEvents } = this.props;
    getAllMissedScheduleEvents();
    getGraphs().then((response) => {
      const {
        status,
        payload: { data: { user_preferences: { charts = [] } = {} } = {} } = {},
      } = response;
      if (status) {
        this.setState({ graphsToShow: [...charts], graphLoading: false });
      }
    });
  }

  addDoctor = () => {
    this.props.history.push("/register-profile");
  };
  formatMessage = (data) => this.props.intl.formatMessage(data);

  showEditGraphModal = () => {
    this.setState({ visibleModal: true });
  };

  hideEditGraphModal = () => {
    this.setState({ visibleModal: false });
  };

  editDisplayGraphs = (data) => {
    let dataToUpdate = {};
    dataToUpdate.chart_ids = data;
    let { updateGraphs } = this.props;
    updateGraphs(dataToUpdate).then((response) => {
      const { status } = response;
      if (status) {
        this.setState({ graphsToShow: data, visibleModal: false });
      } else {
        message.error(this.formatMessage(messages.somethingWentWrongError));
      }
    });
  };

  getMenu = () => {
    const { authPermissions = [] } = this.props;
    return (
      <Menu>
        {authPermissions.includes(USER_PERMISSIONS.DOCTORS.ADD) && (
          <Menu.Item onClick={this.addDoctor}>
            <div className="tac">
              {this.formatMessage(messages.addProviderOrHSP)}
            </div>
          </Menu.Item>
        )}
        {authPermissions.includes(USER_PERMISSIONS.GRAPHS.UPDATE) && (
          <Menu.Item onClick={this.showEditGraphModal}>
            <div className="tac">{this.formatMessage(messages.graphs)}</div>
          </Menu.Item>
        )}
      </Menu>
    );
  };

  chartClicked = (name) => {
    if (name === CHART_MISSED_APPOINTMENT) {
      const { openMissedAppointmentDrawer } = this.props;
      openMissedAppointmentDrawer();
    } else if (name === CHART_MISSED_ACTION) {
      const { openMissedVitalDrawer } = this.props;
      openMissedVitalDrawer();
    } else if (name === CHART_MISSED_MEDICATION) {
      const { openMissedMedicationDrawer } = this.props;
      openMissedMedicationDrawer();
    } else if (name === CHART_MISSED_DIET) {
      const { openMissedDietDrawer } = this.props;
      openMissedDietDrawer();
    } else if (name === CHART_MISSED_WORKOUT) {
      const { openMissedWorkoutDrawer } = this.props;
      openMissedWorkoutDrawer();
    }
  };

  renderChartTabs = () => {
    const { graphs, dashboard = {} } = this.props;

    const {
      medication_ids = {},
      appointment_ids = {},
      vital_ids = {},
      diet_ids = {},
      workout_ids = {},
    } = dashboard;

    const {
      critical: medication_critical = [],
      non_critical: medication_non_critical = [],
    } = medication_ids;
    const {
      critical: vital_critical = [],
      non_critical: vital_non_critical = [],
    } = vital_ids;
    const {
      critical: appointment_critical = [],
      non_critical: appointment_non_critical = [],
    } = appointment_ids;
    const {
      critical: diet_critical = [],
      non_critical: diet_non_critical = [],
    } = diet_ids;
    const {
      critical: workout_critical = [],
      non_critical: workout_non_critical = [],
    } = workout_ids;

    const medication_total =
      medication_critical.length + medication_non_critical.length;
    const vital_total = vital_critical.length + vital_non_critical.length;
    const appointment_total =
      appointment_critical.length + appointment_non_critical.length;
    const diet_total = diet_critical.length + diet_non_critical.length;
    const workout_total = workout_critical.length + workout_non_critical.length;

    const { graphsToShow, graphLoading } = this.state;

    // initial loading phase
    if (graphLoading) {
      return (
        <div className="flex flex-grow-1 wp100 align-center justify-center">
          <Spin />
        </div>
      );
    }

    const chartBlocks = graphsToShow.map((id) => {
      const { name, type = "" } = graphs[id] || {};
      let total = 0;
      let critical = 0;

      if (type === MISSED_MEDICATION) {
        total = medication_total;
        critical = medication_critical.length;
      } else if (type === MISSED_APPOINTMENTS) {
        total = appointment_total;
        critical = appointment_critical.length;
      } else if (type === MISSED_ACTIONS) {
        total = vital_total;
        critical = vital_critical.length;
      } else if (type === MISSED_DIET) {
        total = diet_total;
        critical = diet_critical.length;
      } else if (type === MISSED_WORKOUT) {
        total = workout_total;
        critical = workout_critical.length;
      }

      return (
        <div onClick={() => this.chartClicked(name)}>
          <Donut
            key={id}
            id={id}
            data={[critical, total - critical]}
            total={total}
            title={name}
            formatMessage={this.formatMessage}
          />
        </div>
      );
    });
    // no graph selected to show phase
    if (graphsToShow.length === 0) {
      return (
        <div className="flex justify-center align-center fs20 fw600 wp100 bg-grey br5">
          {this.formatMessage(messages.no_graph_text)}
        </div>
      );
    } else {
      return chartBlocks;
    }
  };

  render() {
    const {
      authenticated_user = "",
      users = {},
      providers = {},
      authPermissions = [],
    } = this.props;
    const { visibleModal = false, graphsToShow = [] } = this.state;
    const { basic_info: { user_name = "" } = {} } =
      users[authenticated_user] || {};
    let providerID = null;
    let providerName = "";
    const { renderChartTabs } = this;
    Object.keys(providers).forEach((id) => {
      const { basic_info: { user_id } = {} } = providers[id] || {};

      if (user_id === authenticated_user) {
        providerID = id;
      }
    });

    const { basic_info: { name: p_name = "" } = {} } =
      providers[providerID] || {};
    providerName = p_name;
    return (
      <Fragment>
        <div className="p20">
          <div
            className={`mb32 mt10 flex direction-row justify-space-between align-center`}
          >
            {providerName !== "" ? (
              <div className="fs28 fw700">
                {this.formatMessage(messages.welcome)}, {providerName}
              </div>
            ) : (
              <div className="fs28 fw700">
                {this.formatMessage(messages.welcome)}
              </div>
            )}
            {(authPermissions.includes(USER_PERMISSIONS.DOCTORS.ADD) ||
              authPermissions.includes(USER_PERMISSIONS.GRAPHS.UPDATE)) && (
              <div className="flex direction-row justify-space-between align-center">
                <Dropdown
                  overlay={this.getMenu()}
                  trigger={["click"]}
                  placement="bottomRight"
                >
                  <Button
                    type="primary"
                    className="ml10 add-button mb0 "
                    icon={"plus"}
                  >
                    <span className="fs16">
                      {this.formatMessage(messages.add)}
                    </span>
                  </Button>
                </Dropdown>
              </div>
            )}
          </div>

          <section className="horizontal-scroll-wrapper pr10 mt10">
            {renderChartTabs()}
          </section>

          {/* <div className="mt0 wp100 flex align-center justify-center provider-doctor-table">
                    <DoctorTable />
            </div> */}
          <div className="wp100 flex align-center justify-center provider-doctor-table">
            <DoctorTable />
          </div>
          {visibleModal && (
            <GraphsModal
              visible={visibleModal}
              handleCancel={this.hideEditGraphModal}
              handleOk={this.editDisplayGraphs}
              selectedGraphs={graphsToShow}
            />
          )}

          <MissedAppointmentsDrawer />

          <MissedVitalsDrawer />

          <MissedMedicationsDrawer />

          <MissedDietsDrawer />

          <MissedWorkoutsDrawer />
        </div>
      </Fragment>
    );
  }
}

export default injectIntl(ProviderDoctorPage);
