import React, { Component } from "react";
import { injectIntl } from "react-intl";

import Drawer from "antd/es/drawer";
import Form from "antd/es/form";
import message from "antd/es/message";
import confirm from "antd/es/modal/confirm";
import Button from "antd/es/button";

import EditVitalForm from "./form";

import { MEDICINE_UNITS } from '../../../../constant'
import messages from "../message";
import Footer from "../../footer";
import startTimeField from "../common/startTime";
import startDateField from "../common/startDate";
import endDateField from "../common/endDate";
import repeatDaysField from "../common/selectedDays";
import moment from "moment";
import instructions from "../common/instructions";
import vitalOccurence from "../common/vitalOccurence";

class EditVital extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disabledOk: true,
      fieldChanged: false,
      members: [],
    };
    this.FormWrapper = Form.create({ onFieldsChange: this.onFormFieldChanges })(
      EditVitalForm
    );
  }

  componentDidMount() {
    // const { getVitals, carePlanId, payload } = this.props;
    // console.log("payload",payload);
    // getVitals(carePlanId);
  }

  enableSubmit = () => {
    this.setState({ disabledOk: false });
  }

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

  onClose = () => {
    const { close } = this.props;
    this.setState({
      disabledOk: true,
    }, () => {
      close();

    });
    // close();
  };

  handleSubmit = async () => {
    const {
      // form: { validateFields },
      updateVital,
      getMedications,
      addMedication,
      patientId,
      editMedication,
      close,
      payload: { id: vital_id } = {},
    } = this.props;
    const { formRef = {}, formatMessage } = this;
    const {
      props: {
        form: { validateFields },
      },
    } = formRef;

    validateFields(async (err, values) => {
      if (!err) {
        const { when_to_take = [], keys = [] } = values || {};
        let data_to_submit = {};
        const startDate = values[startDateField.field_name];
        const endDate = values[endDateField.field_name];
        const repeatDays = values[repeatDaysField.field_name];
        const description = values[instructions.field_name];
        const repeat_interval_id = values[vitalOccurence.field_name];
        data_to_submit = {
          id: vital_id,
          repeat_interval_id,
          description,
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
            [repeatDaysField.field_name]: repeatDays,
          };
        }
        if (!startDate || !repeat_interval_id || !repeatDays) {

          message.error('Please fill all details.')
        }
        else if (endDate && moment(endDate).isBefore(moment(startDate))) {
          message.error('Please select valid dates for vitals')
        }
        try {
          const response = await updateVital(data_to_submit);
          const { status, payload: { message: msg } = {} } = response;
          if (status === true) {
            message.success(msg);
            close();
          } else {
            message.error(msg);
          }
        } catch (error) {
          console.log("add medication reminder ui error -----> ", error);
        }
        
      } else {
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
        const { deleteMedication, getMedications, getPatientCarePlanDetails } = this.props;
        const response = await deleteMedication(id);
        const { status } = response || {};
        if (status === true) {
          getPatientCarePlanDetails(patient_id);
          getMedications(patient_id);
        }
      },
      onCancel() { },
    });
  };

  getDeleteButton = () => {
    const { handleDelete } = this;
    const { loading, deleteMedicationOfTemplate, hideMedication, addMedication } = this.props;

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
        onClick={deleteMedicationOfTemplate ? deleteMedicationOfTemplate : handleDelete}
        loading={loading}
        disabled={true}
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
    } = this.props;
    const {
      onClose,
      setFormRef,
      FormWrapper,
      handleSubmit,
      getDeleteButton,
    } = this;
    const { disabledOk } = this.state;

    const submitButtonProps = {
      disabled: disabledOk,
      loading: loading,
    };

    return (
      <Drawer
        width={"35%"}
        onClose={onClose}
        visible={visible}
        destroyOnClose={true}
        maskClosable={false}
        headerStyle={{
          position: "sticky",
          zIndex: "9999",
          top: "0px"
        }}
        className="ant-drawer"
        title={formatMessage(messages.title)}
      >
        <FormWrapper wrappedComponentRef={setFormRef} enableSubmit={this.enableSubmit} {...this.props} />
        <Footer
          className="flex justify-space-between"
          onSubmit={handleSubmit}
          onClose={onClose}
          submitText={formatMessage(messages.update_button_text)}
          submitButtonProps={submitButtonProps}
          cancelComponent={getDeleteButton()}
        />
      </Drawer>
    );
  }
}

export default injectIntl(EditVital);
