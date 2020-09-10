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
    const { getVitals, carePlanId, payload } = this.props;
    console.log("payload",payload);
    getVitals(carePlanId);
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
        const { when_to_take = [], keys = [] } = values || {};
        let data_to_submit = {};
        const startTime = values[startTimeField.field_name];
        const startDate = values[startDateField.field_name];
        const endDate = values[endDateField.field_name];
        const repeatDays = values[repeatDaysField.field_name];
        const { medicine_id, quantity, strength, unit, critical, formulation: medicine_type, special_instruction: description } = values || {};
        data_to_submit = {
          id: medication_id,
          medicine_id,
          quantity,
          strength,
          unit,
          critical,
          when_to_take: keys.map((id) => when_to_take[id]) || [],
          // when_to_take: when_to_take.map(id => `${id}`),
          participant_id: patient_id,
          medicine_type,
          description,
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
        if (!medicine_id || !unit || (unit === MEDICINE_UNITS.MG && !quantity) || !strength || !when_to_take || !startDate) {

          message.error('Please fill all details.')
        }
        else if (endDate && moment(endDate).isBefore(moment(startDate))) {
          message.error('Please select valid dates for medication')
        } else if (editMedication) {
          editMedication(data_to_submit);
        } else if (addMedication) {

          addMedication(data_to_submit);
        } else {
          try {
            const response = await updateMedicationReminder(data_to_submit);
            const { status, payload: { message: msg } = {} } = response;
            if (status === true) {

              // this.setState({ disabledOk: true });
              message.success(msg);
              getMedications(pId);
            } else {
              message.error(msg);
            }
          } catch (error) {
            console.log("add medication reminder ui error -----> ", error);
          }
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
