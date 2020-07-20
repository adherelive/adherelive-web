import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { hasErrors } from "../../../Helper/validation";
import moment from "moment";

import Drawer from "antd/es/drawer";
import Form from "antd/es/form";
import message from "antd/es/message";
import Button from "antd/es/button";
import confirm from "antd/es/modal/confirm";

import messages from "./message";
import EditAppointmentForm from "./form";
import Footer from "../footer";
import CalendarTimeSelecton from "./calender";

class EditAppointment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      disabledSubmit: true,
    };

    this.FormWrapper = Form.create({ onFieldsChange: this.onFormFieldChanges })(
      EditAppointmentForm
    );
  }

  onFormFieldChanges = (props, allvalues) => {
    const {
      form: { getFieldsError, isFieldsTouched },
    } = props;
    const isError = hasErrors(getFieldsError());
    const { disabledSubmit } = this.state;
    if (disabledSubmit !== isError && isFieldsTouched()) {
      this.setState({ disabledSubmit: isError });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      updateAppointment,
      payload: { id } = {},
      patients,
      patientId,
      getAppointments,
      editAppointment,
      addAppointment,
      payload: { patient_id } = {},
    } = this.props;
    const { formRef = {}, formatMessage } = this;
    const {
      props: {
        form: { validateFields },
      },
    } = formRef;

    let pId = patientId ? patientId : patient_id;
    const { basic_info: { user_id } = {} } = patients[pId] || {};

    validateFields(async (err, values) => {
      if (!err) {
        console.log("VALUES --> ", values);
        const {
          patient = {},
          date,
          start_time,
          end_time,
          description,

          treatment,
          reason
        } = values;

        const data = {
          // todo: change participant one with patient from store
          id,
          participant_two: {
            id: pId,
            category: "patient",
          },
          date,
          start_time,
          end_time,
          description,
          treatment_id: treatment,
          reason
        };

        if (moment(date).isSame(moment(), 'day') && moment(start_time).isBefore(moment())) {
          message.error('Cannot create appointment for past time.')
        }
        else if (moment(end_time).isBefore(moment(start_time))) {
          message.error('Please select valid timings for appointment.')
        } else if (editAppointment) {
          editAppointment(data);

        } else if (addAppointment) {
          addAppointment(data);
        } else {
          try {
            const response = await updateAppointment(data);
            const {
              status,
              statusCode: code,
              payload: {
                message: errorMessage = "",
                error,
                error: { error_type = "" } = {},
              },
            } = response || {};

            if (code === 422 && error_type === "slot_present") {
              message.warn(
                `${errorMessage} range: ${moment(start_time).format(
                  "LT"
                )} - ${moment(end_time).format("LT")}`
              );
            } else if (status === true) {
              message.success(formatMessage(messages.edit_appointment_success));
              getAppointments(pId);
            } else {
              message.warn(errorMessage);
            }

            console.log("add appointment response -----> ", response);
          } catch (error) {
            console.log("ADD APPOINTMENT UI ERROR ---> ", error);
          }
        }
      }
    });
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  onClose = () => {
    const { close } = this.props;
    close();
  };

  setFormRef = (formRef) => {
    this.formRef = formRef;
    if (formRef) {
      this.setState({ formRef: true });
    }
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

  handleDelete = e => {
    e.preventDefault();
    const { payload: { id, patient_id } = {}, patients } = this.props;
    const { warnNote } = this;

    const { basic_info: { first_name, middle_name, last_name, user_id } = {} } = patients[patient_id] || {};

    confirm({
      title: `Are you sure you want to delete the appointment with ${first_name} ${middle_name ? `${middle_name} ` : ""}${last_name ? last_name : ""}?`,
      content: (
        <div>
          {warnNote()}
        </div>
      ),
      onOk: async () => {
        this.setState({ loading: true });
        const { deleteAppointment, getAppointments, getPatientCarePlanDetails } = this.props;
        const response = await deleteAppointment(id);
        const { status } = response || {};
        if (status === true) {
          getPatientCarePlanDetails(patient_id);
          getAppointments(patient_id);
        }
      },
      onCancel() { }
    });
  };

  getDeleteButton = () => {
    const { handleDelete } = this;
    const { loading, deleteAppointmentOfTemplate, addAppointment, hideAppointment } = this.props;
    console.log("DELETE APPOINTMENT IN DELETE FUNCTIONNN", typeof (deleteAppointmentOfTemplate), deleteAppointmentOfTemplate ? deleteAppointmentOfTemplate : handleDelete);
    if (addAppointment) {
      return (
        <Button onClick={hideAppointment} style={{ marginRight: 8 }}>
          Cancel
        </Button>
      );
    }
    return (
      <Button
        type="danger"
        ghost
        className="fs14 no-border style-delete"
        onClick={deleteAppointmentOfTemplate ? deleteAppointmentOfTemplate : handleDelete}
        loading={loading}
      >
        <div className="flex align-center delete-text">
          <div className="ml4">Delete</div>
        </div>
      </Button>
    );
  };

  render() {
    const { visible = true,
      editAppointment,
      addAppointment,
      appointmentVisible = false,
      hideAppointment } = this.props;
    const { disabledSubmit } = this.state;
    const {
      onClose,
      formatMessage,
      setFormRef,
      handleSubmit,
      FormWrapper,
      getDeleteButton,
    } = this;

    console.log("PROPSSS OFF APPOINTMENT========>", editAppointment,
      appointmentVisible,
      hideAppointment);
    const submitButtonProps = {
      disabled: disabledSubmit,
      // loading: loading && !deleteLoading
    };

    // if (visible !== true) {
    //   return null;
    // }

    return (
      <Fragment>
        <Drawer
          placement="right"
          // closable={false}
          headerStyle={{
            position: "sticky",
            zIndex: "9999",
            top: "0px"
          }}
          destroyOnClose={true}
          onClose={editAppointment || addAppointment ? hideAppointment : onClose}
          visible={editAppointment || addAppointment ? appointmentVisible : visible} // todo: change as per prop -> "visible", -- WIP --
          width={'35%'}
          title={editAppointment ? formatMessage(messages.appointment) : addAppointment ? "Add Appointment" : formatMessage(messages.edit_appointment)}
        // headerStyle={{
        //     display:"flex",
        //     justifyContent:"space-between",
        //     alignItems:"center"
        // }}
        >
          {/* <div className="flex direction-row justify-space-between"> */}
          <FormWrapper wrappedComponentRef={setFormRef} {...this.props} />
          {/* <CalendarTimeSelecton 
                className="calendar-section wp60"
            /> */}
          {/* </div> */}

          <Footer
            className="flex justify-space-between"
            onSubmit={handleSubmit}
            onClose={editAppointment || addAppointment ? hideAppointment : onClose}
            submitText={formatMessage(messages.submit_text)}
            submitButtonProps={submitButtonProps}
            cancelComponent={getDeleteButton()}
          />
        </Drawer>
      </Fragment>
    );
  }
}

export default injectIntl(EditAppointment);
