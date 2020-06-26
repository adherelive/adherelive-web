import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { hasErrors } from "../../../Helper/validation";
import moment from "moment";

import Drawer from "antd/es/drawer";
import Form from "antd/es/form";
import message from "antd/es/message";

import messages from "./message";
import AddAppointmentForm from "./form";
import Footer from "../footer";
import CalendarTimeSelecton from "./calender";

class AddAppointment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      disabledSubmit: true,
    };

    this.FormWrapper = Form.create({ onFieldsChange: this.onFormFieldChanges })(
      AddAppointmentForm
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
    const { addCarePlanAppointment, getAppointments, payload: { patient_id }, patients ,carePlanId} = this.props;
    const { formRef = {}, formatMessage } = this;

    const {basic_info: {user_id} = {}} = patients[patient_id] || {};
    const {
      props: {
        form: { validateFields },
      },
    } = formRef;

    validateFields(async (err, values) => {
      if (!err) {
        console.log("VALUES --> ", values);
        const {
          patient = {},
          date,
          start_time,
          reason,
          end_time,
          description = "",
          treatment = "",
        } = values;

        const data = {
          // todo: change participant one with patient from store
          participant_two: {
            id: patient_id,
            category: "patient",
          },
          date,
          start_time,
          end_time,
          reason,
          description,
          treatment,
          reason
        };

        try {
          const response = await addCarePlanAppointment(data,carePlanId);
          const {
            status,
            statusCode: code,
            payload: { message: errorMessage = "", error, error: { error_type = "" } = {} },
          } = response || {};

          if (code === 422 && error_type === "slot_present") {
            message.warn(
              `${errorMessage} range: ${moment(start_time).format(
                "LT"
              )} - ${moment(end_time).format("LT")}`
            );
          } else if (status === true) {
            message.success(formatMessage(messages.add_appointment_success));
            // getAppointments(patient_id);
          } else {
            message.warn(errorMessage);
          }

          console.log("add appointment response -----> ", response);
        } catch (error) {
          console.log("ADD APPOINTMENT UI ERROR ---> ", error);
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

  render() {
    const { visible = true,
      hideAppointment,
      appointmentVisible,
      editAppointment } = this.props;
    const { disabledSubmit } = this.state;


    console.log('STATE OF DRAWER==========>IN APPOINTMENT',editAppointment ? appointmentVisible : visible, visible,appointmentVisible,hideAppointment, editAppointment);
    const {
      onClose,
      formatMessage,
      setFormRef,
      handleSubmit,
      FormWrapper,
    } = this;

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
          onClose={editAppointment ? hideAppointment : onClose}
          visible={editAppointment ? appointmentVisible : visible}
          width={350}
          title={editAppointment ? formatMessage(messages.appointment) : formatMessage(messages.add_appointment)}
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
            onSubmit={handleSubmit}
            onClose={onClose}
            submitText={formatMessage(messages.submit_text)}
            submitButtonProps={submitButtonProps}
            cancelComponent={null}
          />
        </Drawer>
      </Fragment>
    );
  }
}

export default injectIntl(AddAppointment);
