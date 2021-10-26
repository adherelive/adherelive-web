import React, { Component } from "react";
import { injectIntl } from "react-intl";

import Drawer from "antd/es/drawer";
import Form from "antd/es/form";
import message from "antd/es/message";
import confirm from "antd/es/modal/confirm";
import Button from "antd/es/button";

import EditMedicationReminderForm from "./form";

import participants from "../common/participants";
import { MEDICINE_UNITS } from "../../../../constant";
import messages from "../message";
import Footer from "../../footer";
import startTimeField from "../common/startTime";
import whenToTakeMedicineField from "../common/whenTotakeMedicaine";
import startDateField from "../common/startDate";
import endDateField from "../common/endDate";
import repeatDaysField from "../common/selectedDays";
import moment from "moment";
import AddMedicineDrawer from "../../../../Containers/Drawer/addMedicine";

class EditMedicationReminder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disabledOk: true,
      fieldChanged: false,
      members: [],
      submitting: false,
      medicineDrawerVisible: false,
      medicineValue: "",
      newMedicineId: null,
    };
    this.FormWrapper = Form.create({ onFieldsChange: this.onFormFieldChanges })(
      EditMedicationReminderForm
    );
  }

  componentDidMount() {
    const { getMedicationDetails, patientId } = this.props;
    const { addMedication, editMedication } = this.props;

    getMedicationDetails(patientId);
  }

  openMedicineDrawer = () => {
    this.setState({ medicineDrawerVisible: true });
  };

  closeMedicineDrawer = () => {
    this.setState({ medicineDrawerVisible: false });
  };

  setMedicineVal = (value) => {
    this.setState({ medicineValue: value });
  };

  setNewMedicineId = (id) => {
    this.setState({ newMedicineId: id });
  };

  hasErrors = (fieldsError) => {
    let hasError = false;
    // return Object.keys(fieldsError).some((field) => fieldsError[field]);
    for (let err of Object.keys(fieldsError)) {
      if (err !== whenToTakeMedicineField.fieLd_name && fieldsError[err]) {
        hasError = true;
      } else if (err === whenToTakeMedicineField.fieLd_name) {
        hasError = Object.values(fieldsError[err]).some(
          (field) => fieldsError[field]
        );
      }
    }
    return hasError;
  };

  enableSubmit = () => {
    this.setState({ disabledOk: false });
  };

  onFormFieldChanges = (props) => {
    const {
      form: { getFieldsError, isFieldsTouched },
    } = props;
    const { disabledOk } = this.state;

    if (isFieldsTouched()) {
      const isError = this.hasErrors(getFieldsError());

      if (disabledOk !== isError && isFieldsTouched()) {
        this.setState({ disabledOk: isError });
      }
    } else {
      this.setState({ disabledOk: true });
    }
  };

  handleCancel = (e) => {
    if (e) {
      e.preventDefault();
    }
    const { close } = this.props;
    close();
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  setFormRef = (formRef) => {
    this.formRef = formRef;
    if (formRef) {
      this.setState({ formRef: true });
    }
  };

  getOtherUser = () => {
    const { formRef } = this;
    let otherUser;
    if (formRef) {
      const {
        props: {
          form: { getFieldValue },
        },
      } = formRef;
      const { members = [] } = this.state;
      const otherUserId = getFieldValue(participants.field_name);
      const n = members.length;
      for (let i = 0; i < n; i++) {
        const member = members[i] || {};
        const {
          basicInfo: { _id },
        } = member;
        if (otherUserId === _id) {
          otherUser = member;
          break;
        }
      }
    }
    return otherUser;
  };

  onClose = () => {
    const { close } = this.props;
    this.setState(
      {
        disabledOk: true,
      },
      () => {
        close();
      }
    );
    // close();
  };

  handleSubmit = async () => {
    const {
      // form: { validateFields },
      updateMedicationReminder,
      getMedications,
      addMedication,
      patientId,
      editMedication,
      payload: { id: medication_id, patient_id } = {},
    } = this.props;
    let pId = patientId ? patientId : patient_id;

    const { formRef = {}, formatMessage } = this;
    const {
      props: {
        form: { validateFields },
      },
    } = formRef;

    validateFields(async (err, values) => {
      if (!err) {
        const {
          when_to_take = [],
          keys = [],
          when_to_take_abbr = null,
        } = values || {};
        let data_to_submit = {};
        const startTime = values[startTimeField.field_name];
        const startDate = values[startDateField.field_name];
        const endDate = values[endDateField.field_name];
        const repeatDays = values[repeatDaysField.field_name];

        const {
          medicine_id,
          quantity,
          strength,
          unit,
          critical,
          formulation: medicine_type,
          special_instruction: description,
        } = values || {};
        data_to_submit = {
          id: medication_id,
          medicine_id,
          quantity,
          strength,
          unit,
          critical,
          when_to_take_abbr,
          when_to_take: keys.map((id) => when_to_take[id]) || [],
          // when_to_take: when_to_take.map(id => `${id}`),
          participant_id: pId,
          medicine_type,
          description,
          repeat: "weekly",

          [startTimeField.field_name]:
            startTime && startTime !== null
              ? startTime.startOf("minute").toISOString()
              : startTime,
          [startDateField.field_name]:
            startDate && startDate !== null
              ? startDate.clone().toISOString()
              : startDate,
          [endDateField.field_name]:
            endDate && endDate !== null
              ? endDate.clone().toISOString()
              : endDate,
        };
        if (repeatDays) {
          data_to_submit = {
            ...data_to_submit,
            [repeatDaysField.field_name]: repeatDays.split(","),
          };
        }
        if (
          !medicine_id ||
          !unit ||
          (unit === MEDICINE_UNITS.MG && !quantity) ||
          !strength ||
          !when_to_take ||
          !startDate
        ) {
          message.error("Please fill all details.");
        } else if (endDate && moment(endDate).isBefore(moment(startDate))) {
          message.error("Please select valid dates for medication");
        } else if (editMedication) {
          editMedication(data_to_submit);
        } else if (addMedication) {
          addMedication(data_to_submit);
        } else {
          try {
            this.setState({ submitting: true });
            const response = await updateMedicationReminder(data_to_submit);
            const { status, payload: { message: msg } = {} } = response;
            if (status === true) {
              // this.setState({ disabledOk: true });
              message.success(msg);
              getMedications(pId);
            } else {
              console.log("87689076567890", msg);
              message.error(msg);
            }

            this.setState({ submitting: false });
          } catch (error) {
            this.setState({ submitting: false });
            console.log("add medication reminder ui error -----> ", error);
          }
        }
      } else {
        console.log("err", { err });
        message.error(formatMessage(messages.fill_all_details));
      }
    });
  };

  warnNote = () => {
    return (
      <div className="pt16">
        <p className="red">
          <span className="fw600">{"Note"}</span>
          {" : This delete is irreversible"}
        </p>
      </div>
    );
  };

  handleDelete = (e) => {
    e.preventDefault();
    const {
      payload: { id, patient_id } = {},
      patients,
      medicines,
      medications,
    } = this.props;
    const { warnNote } = this;

    const { basic_info: { first_name, middle_name, last_name } = {} } =
      patients[patient_id] || {};
    const { basic_info: { details: { medicine_id } = {} } = {} } =
      medications[id] || {};
    const { basic_info: { name } = {} } = medicines[medicine_id] || {};

    confirm({
      title: `Are you sure you want to delete medication of ${name} for ${first_name} ${
        middle_name ? `${middle_name} ` : ""
      }${last_name ? last_name : ""}?`,
      content: <div>{warnNote()}</div>,
      onOk: async () => {
        this.setState({ loading: true });
        const { deleteMedication, getMedications, getPatientCarePlanDetails } =
          this.props;
        const response = await deleteMedication(id);
        const { status, payload: { message: respMessage = "" } = {} } =
          response || {};
        if (status === true) {
          getPatientCarePlanDetails(patient_id);
          getMedications(patient_id);
          message.success(respMessage);
        } else {
          message.warn(respMessage);
        }
      },
      onCancel() {},
    });
  };

  getDeleteButton = () => {
    const { handleDelete } = this;
    const {
      loading,
      deleteMedicationOfTemplate,
      hideMedication,
      addMedication,
    } = this.props;

    if (addMedication) {
      return (
        <Button onClick={hideMedication} style={{ marginRight: 8 }}>
          Cancel
        </Button>
      );
    }

    return (
      <Button
        type={"danger"}
        ghost
        className="fs14 no-border style-delete"
        onClick={
          deleteMedicationOfTemplate ? deleteMedicationOfTemplate : handleDelete
        }
        loading={loading}
      >
        <div className="flex align-center delete-text">
          <div className="ml4">Delete</div>
        </div>
      </Button>
    );
  };

  render() {
    const {
      visible,
      medicationVisible,
      editMedication,
      addMedication,
      hideMedication,
      loading = false,
      intl: { formatMessage },
      payload = {},
    } = this.props;
    const { onClose, setFormRef, FormWrapper, handleSubmit, getDeleteButton } =
      this;
    const { disabledOk, submitting = false } = this.state;

    const submitButtonProps = {
      disabled: disabledOk,
      loading: loading,
    };

    const {
      medicineDrawerVisible = false,
      medicineValue = "",
      newMedicineId = null,
    } = this.state;

    const { canViewDetails = false } = payload || {};

    const { addNewMedicine } = this.props;

    return (
      <Drawer
        width={"35%"}
        onClose={editMedication || addMedication ? hideMedication : onClose}
        visible={editMedication || addMedication ? medicationVisible : visible}
        destroyOnClose={true}
        maskClosable={false}
        headerStyle={{
          position: "sticky",
          zIndex: "9999",
          top: "0px",
        }}
        className="ant-drawer"
        title={
          canViewDetails
            ? formatMessage(messages.viewHeader)
            : editMedication
            ? formatMessage(messages.medication)
            : addMedication
            ? "Add Medication"
            : formatMessage(messages.title)
        }
      >
        <FormWrapper
          wrappedComponentRef={setFormRef}
          enableSubmit={this.enableSubmit}
          {...this.props}
          openAddMedicineDrawer={this.openMedicineDrawer}
          setMedicineVal={this.setMedicineVal}
          newMedicineId={newMedicineId}
        />

        <AddMedicineDrawer
          visible={medicineDrawerVisible}
          close={this.closeMedicineDrawer}
          input={medicineValue}
          // addNewMedicine={addNewMedicine}
          setNewMedicineId={this.setNewMedicineId}
        />

        {!canViewDetails && (
          <Footer
            className="flex justify-space-between"
            onSubmit={handleSubmit}
            onClose={editMedication || addMedication ? hideMedication : onClose}
            submitText={formatMessage(messages.update_button_text)}
            submitButtonProps={submitButtonProps}
            cancelComponent={getDeleteButton()}
            submitting={submitting}
          />
        )}
      </Drawer>
    );
  }
}

export default injectIntl(EditMedicationReminder);
