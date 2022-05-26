import React, { Component } from "react";
import { injectIntl } from "react-intl";
import generateRow from "./dataRow";
import getColumn from "./header";
import Table from "antd/es/table";
import messages from "./messages";
import isEmpty from "./../../../Helper/is-empty";

class MedicationTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      medication_ids: [],
    };
  }

  componentDidMount() {
    console.log("Medication table Component did Mount!", this.props);
    this.getMedications();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { medication_ids = [] } = this.props;
    const { medication_ids: prev_medication_ids = [] } = prevProps;

    if (medication_ids.length !== prev_medication_ids.length) {
      this.setState({ medication_ids });
    }
  }

  getMedications = async () => {
    try {
      const { getPatientMedications } = this.props;
      const { loading } = this.state;
      const response = await getPatientMedications();
      // const {status, payload: {data: {medication_ids = []} = {}} = {}} = response || {};
      const { medication_ids = [] } = this.props;
      this.setState({ medication_ids, loading: false });
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  getDataSource = () => {
    const {
      medications,
      medicines,
      isOtherCarePlan,
      intl: { formatMessage } = {},
      care_plans,
      auth_role = null,
    } = this.props;

    const { medication_ids = [] } = care_plans || {};

    const { basic_info: { user_role_id = null } = {} } = care_plans || {};
    let canViewDetails = true;
    if (
      (!isOtherCarePlan && user_role_id.toString() === auth_role.toString()) ||
      (!isEmpty(care_plans) &&
        care_plans.secondary_doctor_user_role_ids !== undefined &&
        care_plans.secondary_doctor_user_role_ids.includes(auth_role) === true)
    ) {
      canViewDetails = false;
    }

    const { openResponseDrawer, openEditDrawer } = this;

    return medication_ids.map((id) => {
      return generateRow({
        id,
        medications,
        openResponseDrawer,
        openEditDrawer,
        formatMessage,
        isOtherCarePlan,
        medicines,
        canViewDetails,
      });
    });
  };

  openResponseDrawer = (id) => (e) => {
    e.preventDefault();
    const {
      medicationResponseDrawer,
      isOtherCarePlan,
      auth_role = null,
      care_plans = {},
    } = this.props;
    const { basic_info: { user_role_id = null } = {} } = care_plans || {};
    let canViewDetails = true;
    if (!isOtherCarePlan && user_role_id.toString() === auth_role.toString()) {
      canViewDetails = false;
    }
    medicationResponseDrawer({ id, loading: true });
  };

  openEditDrawer = (id) => (e) => {
    e.preventDefault();
    const {
      editMedicationDrawer,
      isOtherCarePlan,
      patientId,
      auth_role = null,
      care_plans = {},
    } = this.props;
    const { basic_info: { user_role_id = null } = {} } = care_plans || {};
    let canViewDetails = true;
    if (
      (!isOtherCarePlan && user_role_id.toString() === auth_role.toString()) ||
      (!isEmpty(care_plans) &&
        care_plans.secondary_doctor_user_role_ids !== undefined &&
        care_plans.secondary_doctor_user_role_ids.includes(auth_role) === true)
    ) {
      canViewDetails = false;
    }

    editMedicationDrawer({
      id,
      patient_id: patientId,
      loading: true,
      canViewDetails,
    });
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  render() {
    // console.log("238423749823794729847293",{props:this.props});
    const locale = {
      emptyText: this.formatMessage(messages.emptyMedicationTable),
    };

    const { intl: { formatMessage } = {} } = this.props;
    const { getLoadingComponent, getDataSource } = this;

    return (
      <Table
        rowClassName={() => "pointer"}
        // loading={loading === true ? getLoadingComponent() : false}
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

export default injectIntl(MedicationTable);
