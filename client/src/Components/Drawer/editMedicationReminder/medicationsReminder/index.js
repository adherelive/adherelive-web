import React, { Component } from "react";
import { injectIntl } from "react-intl";

import Drawer from "antd/es/drawer";
import Form from "antd/es/form";
import message from "antd/es/message";
import confirm from "antd/es/modal/confirm";
import Button from "antd/es/button";

import EditMedicationReminderForm from "./form";

import participants from "../common/participants";

import messages from "../message";
import Footer from "../../footer";
import startTimeField from "../common/startTime";
import startDateField from "../common/startDate";
import endDateField from "../common/endDate";
import repeatDaysField from "../common/selectedDays";

class EditMedicationReminder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disabledOk: true,
      fieldChanged: false,
      members: [],
    };
    this.FormWrapper = Form.create({ onFieldsChange: this.onFormFieldChanges })(
      EditMedicationReminderForm
    );
  }

  componentDidMount() {
    const { getMedicationDetails } = this.props;
    getMedicationDetails();
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
      console.log("[1234] this.state.fieldChanged ", this.state.fieldChanged);
      this.setState({ disabledOk: isError, fieldChanged: true });
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
    close();
  };

  handleSubmit = async () => {
    const {
      // form: { validateFields },
      updateMedicationReminder,
      payload: { id: medication_id, patient_id } = {},
    } = this.props;

    const { formRef = {}, formatMessage } = this;
    const {
      props: {
        form: { validateFields },
      },
    } = formRef;

    validateFields(async (err, values) => {
      if (!err) {
        console.log("131231 values ----> ", values);
        const { when_to_take = [], keys = [] } = values || {};
        let data_to_submit = {};
        const startTime = values[startTimeField.field_name];
        const startDate = values[startDateField.field_name];
        const endDate = values[endDateField.field_name];
        const repeatDays = values[repeatDaysField.field_name];
        const { medicine_id, quantity, strength, unit } = values || {};
        data_to_submit = {
          id: medication_id,
          medicine_id,
          quantity,
          strength,
          unit,
          when_to_take: keys.map((id) => when_to_take[id]) || [],
          // when_to_take: when_to_take.map(id => `${id}`),
          participant_id: patient_id,

          repeat: "weekly",

          [startTimeField.field_name]:
            startTime && startTime !== null
              ? startTime.startOf("minute").toISOString()
              : startTime,
          [startDateField.field_name]:
            startDate && startDate !== null
              ? startDate
                  .clone()
                  .startOf("day")
                  .toISOString()
              : startDate,
          [endDateField.field_name]:
            endDate && endDate !== null
              ? endDate
                  .clone()
                  .endOf("day")
                  .toISOString()
              : endDate,
        };

        if (repeatDays) {
          data_to_submit = {
            ...data_to_submit,
            [repeatDaysField.field_name]: repeatDays.split(","),
          };
        }
        try {
          const response = await updateMedicationReminder(data_to_submit);
          const { status, payload: { message: msg } = {} } = response;
          if (status === true) {
            message.success(msg);
          } else {
            message.error(msg);
          }
        } catch (error) {
          console.log("add medication reminder ui error -----> ", error);
        }
      }
    });
  };

  warnNote = () => {
    return (
      <div className="pt50">
        <p>
          <span className="red">{"Note"}</span>
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
        const { deleteMedication, getMedications } = this.props;
        const response = await deleteMedication(id);
        const {status} = response || {};
        if(status === true) {
          getMedications(patient_id);
        }
      },
      onCancel() {},
    });
  };

  getDeleteButton = () => {
    const { handleDelete } = this;
    const { loading } = this.props;
    return (
      <Button
        type="danger"
        ghost
        className="fs14 no-border style-delete"
        onClick={handleDelete}
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
      loading = false,
      intl: { formatMessage },
    } = this.props;
    const {
      onClose,
      setFormRef,
      FormWrapper,
      handleSubmit,
      getDeleteButton,
    } = this;
    const { disabledSubmit } = this.state;
    const submitButtonProps = {
      disabled: disabledSubmit,
      loading: loading,
    };

    console.log("8749234 visible --> ", visible);

    return (
      <Drawer
        width={"35%"}
        onClose={onClose}
        visible={visible}
        destroyOnClose={true}
        className="ant-drawer"
        title={formatMessage(messages.title)}
      >
        <FormWrapper wrappedComponentRef={setFormRef} {...this.props} />
        <Footer
          className="flex justify-space-between"
          onSubmit={handleSubmit}
          onClose={onClose}
          submitText={formatMessage(messages.update_button_text)}
          submitButtonProps={{}}
          cancelComponent={getDeleteButton()}
        />
      </Drawer>
    );
  }
}

export default injectIntl(EditMedicationReminder);
