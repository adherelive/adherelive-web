import React, { Component } from "react";
import { injectIntl } from "react-intl";
import generateRow from "./dataRow";
import getColumn from "./header";
import message from "antd/es/message";
import Table from "antd/es/table";
import Icon from "antd/es/icon";

import messages from "./messages";
import isEmpty from "../../../Helper/is-empty";

class DietTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      diet_ids: [],
    };
  }

  async componentDidMount() {
    await this.getAllDiets();
  }

  async componentDidUpdate(prevProps, prevState) {
    const { care_plans = {}, carePlanId = null } = this.props;
    const {
      carePlanId: prev_carePlanId = null,
      care_plans: prev_care_plans = {},
    } = prevProps || {};
    const { diet_ids = [] } = care_plans[carePlanId] || {};
    const { diet_ids: prev_diet_ids = [] } =
      prev_care_plans[prev_carePlanId] || {};
    if (
      prev_diet_ids.length !== diet_ids.length ||
      carePlanId != prev_carePlanId
    ) {
      await this.getAllDiets();
    }
  }

  getAllDiets = async () => {
    try {
      const { getDietsForCareplan, carePlanId = null, care_plans } = this.props;
      this.setState({ loading: true });
      const response = await getDietsForCareplan(carePlanId);
      const {
        status,
        statusCode,
        payload: { data = {}, message: resp_msg = "" } = {},
      } = response || {};
      if (!status && statusCode !== 422) {
        message.warn(resp_msg);
      }
      const { diet_ids = [] } = care_plans[carePlanId] || {};

      this.setState({
        loading: false,
        diet_ids,
      });
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  getDataSource = () => {
    const {
      isOtherCarePlan,
      intl: { formatMessage } = {},
      diets = {},
      auth_role = null,
      care_plans = {},
      carePlanId = null,
    } = this.props;

    const { diet_ids = [] } = this.state;

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

    const { openResponseDrawer, openEditDrawer } = this;

    return diet_ids.map((id) => {
      const dietData = diets[id] || {};
      return generateRow({
        id,
        dietData,
        openResponseDrawer,
        openEditDrawer,
        formatMessage,
        isOtherCarePlan,
        canViewDetails,
      });
    });
  };

  openResponseDrawer = (diet_id) => (e) => {
    e.preventDefault();
    const {
      openDietResponseDrawer,
      isOtherCarePlan,
      auth_role = null,
      care_plans = {},
      carePlanId,
      diets = {},
    } = this.props;
    const { basic_info: { name = "" } = {} } = diets[diet_id] || {};
    const { basic_info: { user_role_id = null } = {} } =
      care_plans[carePlanId] || {};
    let canViewDetails = true;
    if (!isOtherCarePlan && user_role_id.toString() === auth_role.toString()) {
      canViewDetails = false;
    }
    openDietResponseDrawer({ diet_id, diet_name: name, loading: true });
  };

  openEditDrawer = (diet_id) => (e) => {
    e.preventDefault();
    const {
      openEditDietDrawer,
      isOtherCarePlan,
      patientId,
      auth_role = null,
      care_plans = {},
      carePlanId,
      diets = {},
    } = this.props;
    const { details: { repeat_days = [] } = {} } = diets[diet_id];
    const { basic_info: { user_role_id = null } = {} } =
      care_plans[carePlanId] || {};
    let canViewDetails = true;
    // AKSHAY NEW CODE IMPLEMENTATIONS
    console.log("care_plans diets", care_plans);
    let careplanData = care_plans[carePlanId];
    if (
      (!isOtherCarePlan && user_role_id.toString() === auth_role.toString()) ||
      (!isEmpty(careplanData) &&
        careplanData.secondary_doctor_user_role_ids !== undefined &&
        careplanData.secondary_doctor_user_role_ids.includes(auth_role) ===
          true)
    ) {
      canViewDetails = false;
    }
    openEditDietDrawer({
      diet_id,
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
      emptyText: this.formatMessage(messages.no_diets),
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

export default injectIntl(DietTable);
