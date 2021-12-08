import React, { Component } from "react";
import { Drawer, Form, message } from "antd";
import { injectIntl } from "react-intl";

import moment from "moment";
import { MEDICINE_UNITS, WHEN_TO_TAKE_ABBR_TYPES } from "../../../../constant";
import AddMedicationReminderForm from "./form";
import AddMedicineDrawer from "../../../../Containers/Drawer/addMedicine";

import participants from "../common/participants";

import messages from "../message";
import Footer from "../../footer";
import startTimeField from "../common/startTime";
import startDateField from "../common/startDate";
import endDateField from "../common/endDate";
import repeatDaysField from "../common/selectedDays";

class AddMedicationReminder extends Component {
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
      AddMedicationReminderForm
    );
  }

  componentDidMount() {
    const { getMedicationDetails, patientId } = this.props;
    getMedicationDetails(patientId);
  }

  hasErrors = (fieldsError) => {
    return Object.keys(fieldsError).some((field) => fieldsError[field]);
  };

  onFormFieldChanges = (props, allvalues) => {
    const {
      form: { getFieldsError, isFieldsTouched },
    } = props;
    const isError = this.hasErrors(getFieldsError());
    const { disabledOk } = this.state;
    if (disabledOk !== isError && isFieldsTouched()) {
      this.setState({ disabledOk: isError, fieldChanged: true });
    }
  };

  openMedicineDrawer = () => {
    this.setState({ medicineDrawerVisible: true });
  };

  closeMedicineDrawer = () => {
    this.setState({ medicineDrawerVisible: false });
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
    close();
  };

  handleSubmit = async () => {
    const {
      // form: { validateFields },
      addCarePlanMedicationReminder,
      getMedications,
      carePlanId,
      payload: { patient_id } = {},
    } = this.props;

    const { formRef = {}, formatMessage } = this;
    const {
      props: {
        form: { validateFields },
      },
    } = formRef;

    validateFields(async (err, values) => {
      if (!err) {
        const {
          when_to_take_abbr = "",
          when_to_take = [],
          keys = [],
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
          medicine_id,
          quantity,
          strength,
          unit,
          medicine_type,
          description,
          critical,
          when_to_take: keys.map((id) => when_to_take[id]) || [],
          when_to_take_abbr,
          // when_to_take: when_to_take.map(id => `${id}`),
          id: patient_id,

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
          (when_to_take_abbr !== WHEN_TO_TAKE_ABBR_TYPES.SOS &&
            !when_to_take) ||
          !startDate
        ) {
          message.error("Please fill all details.");
        } else if (endDate && moment(endDate).isBefore(moment(startDate))) {
          message.error("Please select valid dates for medication");
        } else {
          try {
            this.setState({ submitting: true });
            const response = await addCarePlanMedicationReminder(
              data_to_submit,
              carePlanId
            );
            const { status, payload: { message: msg } = {} } = response;
            if (status === true) {
              this.setState({ submitting: false });
              message.success(msg);
              // getMedications(patient_id);
            } else {
              this.setState({ submitting: false });
              message.error(msg);
            }
          } catch (error) {
            this.setState({ submitting: false });
            console.log("add medication reminder ui error -----> ", error);
          }
        }
      } else {
        message.warn("Please fill all the mandatory fields");
        // Object.keys(err).forEach(id => {
        //   const {errors} = err[id] || {};
        //   message.warn(errors[0].message, 10);
        // });
      }
    });
  };

  setMedicineVal = (value) => {
    this.setState({ medicineValue: value });
  };

  setNewMedicineId = (id) => {
    this.setState({ newMedicineId: id });
  };

  render() {
    const {
      visible,
      loading = false,
      intl: { formatMessage },
    } = this.props;
    const { onClose, setFormRef, FormWrapper, handleSubmit } = this;
    const { disabledSubmit } = this.state;
    // const submitButtonProps = {
    //   disabled: disabledSubmit,
    //   loading: loading
    // };
    const {
      members,
      submitting = false,
      medicineDrawerVisible = false,
      medicineValue = "",
      newMedicineId = null,
    } = this.state;
    const { addNewMedicine } = this.props;

    return (
      <Drawer
        width={"35%"}
        onClose={onClose}
        visible={visible}
        // closeIcon={<img src={backArrow} />}
        headerStyle={{
          position: "sticky",
          zIndex: "9999",
          top: "0px",
        }}
        maskClosable={false}
        destroyOnClose={true}
        className="ant-drawer"
        title={formatMessage(messages.title)}
      >
        <FormWrapper
          wrappedComponentRef={setFormRef}
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

        <Footer
          onSubmit={handleSubmit}
          onClose={onClose}
          submitText={formatMessage(messages.add_button_text)}
          submitButtonProps={{}}
          cancelComponent={null}
          submitting={submitting}
        />
      </Drawer>
    );
  }
}

export default injectIntl(AddMedicationReminder);
