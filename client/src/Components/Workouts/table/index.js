import React, { Component } from "react";
import { injectIntl } from "react-intl";
import generateRow from "./dataRow";
import getColumn from "./header";
import message from "antd/es/message";
import Table from "antd/es/table";
import Icon from "antd/es/icon";

import messages from "./messages";
import isEmpty from "../../../Helper/is-empty";

class WorkoutTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      workout_ids: [],
    };
  }

  async componentDidMount() {
    await this.getAllWorkouts();
  }

  async componentDidUpdate(prevProps, prevState) {
    const { care_plans = {}, carePlanId = null } = this.props;
    const {
      carePlanId: prev_carePlanId = null,
      care_plans: prev_care_plans = {},
    } = prevProps || {};
    const { workout_ids = [] } = care_plans[carePlanId] || {};
    const { workout_ids: prev_workout_ids = [] } =
      prev_care_plans[prev_carePlanId] || {};
    if (
      prev_workout_ids.length !== workout_ids.length ||
      carePlanId != prev_carePlanId
    ) {
      await this.getAllWorkouts();
    }
  }

  getAllWorkouts = async () => {
    try {
      const {
        getWorkoutsForPatient,
        carePlanId = null,
        care_plans,
        patientId,
        workouts = {},
      } = this.props;
      this.setState({ loading: true });
      const response = await getWorkoutsForPatient(patientId);
      const {
        status,
        statusCode,
        payload: { data = {}, message: resp_msg = "" } = {},
      } = response || {};
      if (!status && statusCode !== 422) {
        message.warn(resp_msg);
      }

      const { workout_ids = [] } = care_plans[carePlanId] || {};
      console.log("234623426384762742342", { workout_ids, workouts });

      this.setState({
        loading: false,
        workout_ids,
      });
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  getDataSource = () => {
    const {
      isOtherCarePlan,
      intl: { formatMessage } = {},
      workouts = {},
      auth_role = null,
      care_plans = {},
      carePlanId = null,
    } = this.props;
    console.log("datasource", workouts);

    const { workout_ids = [] } = this.state;
    // AKSHAY NEW CODE IMPLEMENTATIONS

    let careplanData = care_plans[carePlanId];

    const { basic_info: { user_role_id = null } = {} } =
      care_plans[carePlanId] || {};
    let canViewDetails = true;

    if (
      (!isOtherCarePlan && user_role_id.toString() === auth_role.toString()) ||
      (!isEmpty(careplanData) &&
        careplanData.secondary_doctor_user_role_ids.includes(auth_role) ===
          true)
    ) {
      canViewDetails = false;
    }

    const { openResponseDrawer, openEditDrawer } = this;

    return workout_ids.map((id) => {
      const workoutData = workouts[id] || {};
      return generateRow({
        id,
        workoutData,
        openResponseDrawer,
        openEditDrawer,
        formatMessage,
        isOtherCarePlan,
        canViewDetails,
      });
    });
  };

  openResponseDrawer = (workout_id) => (e) => {
    e.preventDefault();
    const {
      openWorkoutResponseDrawer,
      isOtherCarePlan,
      auth_role = null,
      care_plans = {},
      carePlanId,
      workouts = {},
    } = this.props;
    const { basic_info: { name = "" } = {} } = workouts[workout_id] || {};
    const { basic_info: { user_role_id = null } = {} } =
      care_plans[carePlanId] || {};
    let canViewDetails = true;
    if (!isOtherCarePlan && user_role_id.toString() === auth_role.toString()) {
      canViewDetails = false;
    }
    openWorkoutResponseDrawer({
      workout_id,
      workout_name: name,
      loading: true,
    });
  };

  openEditDrawer = (workout_id) => (e) => {
    e.preventDefault();
    const {
      openEditWorkoutDrawer,
      isOtherCarePlan,
      patientId,
      auth_role = null,
      care_plans = {},
      carePlanId,
      workouts = {},
    } = this.props;
    const { details: { repeat_days = [] } = {} } = workouts[workout_id];
    const { basic_info: { user_role_id = null } = {} } =
      care_plans[carePlanId] || {};
    let canViewDetails = true;
    // AKSHAY NEW CODE IMPLEMENTATIONS
    let careplanData = care_plans[carePlanId];
    if (
      (!isOtherCarePlan && user_role_id.toString() === auth_role.toString()) ||
      (!isEmpty(careplanData) &&
        careplanData.secondary_doctor_user_role_ids.includes(auth_role) ===
          true)
    ) {
      canViewDetails = false;
    }
    openEditWorkoutDrawer({
      workout_id,
      patient_id: patientId,
      careplan_id: carePlanId,
      repeat_days,
      canViewDetails,
    });
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  getLoadingComponent = () => {
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
    return {
      indicator: antIcon,
    };
  };

  render() {
    const locale = {
      emptyText: this.formatMessage(messages.no_workouts),
    };

    const { intl: { formatMessage } = {} } = this.props;
    const { getLoadingComponent, getDataSource } = this;

    const { loading = false } = this.state;

    return (
      <Table
        rowClassName={() => "pointer"}
        loading={loading === true ? getLoadingComponent() : false}
        columns={getColumn({
          formatMessage,
          className: "pointer",
        })}
        dataSource={getDataSource()}
        scroll={{ x: "100%" }}
        pagination={{
          position: "bottom",
        }}
        locale={locale}
      />
    );
  }
}

export default injectIntl(WorkoutTable);
