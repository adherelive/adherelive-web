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
import { RADIOLOGY } from "../../../constant";

class AddAppointment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      disabledSubmit: true,
      submitting: false,
    };

    this.FormWrapper = Form.create({ onFieldsChange: this.onFormFieldChanges })(
      AddAppointmentForm
    );
  }

  onFormFieldChanges = (props) => {
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
      addCarePlanAppointment,
      payload: { patient_id },
      carePlanId,
    } = this.props;
    const { formRef = {}, formatMessage } = this;

    // const { basic_info: { user_id } = {} } = patients[patient_id] || {};
    const {
      props: {
        form: { validateFields, resetFields },
      },
    } = formRef;

    validateFields(async (err, values) => {
      if (!err) {
        let {
          date,
          type,
          type_description,
          provider_id,
          critical = false,
          start_time,
          reason,
          end_time,
          description = "",
          treatment = "",
          radiology_type = "",
        } = values;

        // if(type === RADIOLOGY){
        //   type_description = radiology_type;
        // }

        let provider_name = typeof provider_id === "string" ? provider_id : "";

        let newProvider_id =
          typeof provider_id === "string" ? null : provider_id;

        const startDate = date ? moment(date) : moment();
        const newMonth = date ? startDate.get("month") : moment().get("month");
        const newDate = date ? startDate.get("date") : moment().get("date");
        const newYear = date ? startDate.get("year") : moment().get("year");
        let newEventStartTime = date
          ? moment(start_time)
              .clone()
              .set({ month: newMonth, year: newYear, date: newDate })
          : start_time;
        let newEventEndTime = date
          ? moment(end_time)
              .clone()
              .set({ month: newMonth, year: newYear, date: newDate })
          : end_time;

        const data = newProvider_id
          ? {
              // todo: change participant one with patient from store
              participant_two: {
                id: patient_id,
                category: "patient",
              },
              date,
              start_time: newEventStartTime,
              end_time: newEventEndTime,
              reason,
              description,
              type,
              type_description,
              provider_id: newProvider_id,
              provider_name,
              critical,
              treatment_id: treatment,
            }
          : {
              // todo: change participant one with patient from store
              participant_two: {
                id: patient_id,
                category: "patient",
              },
              date,
              start_time: newEventStartTime,
              end_time: newEventEndTime,
              reason,
              description,
              type,
              type_description,
              provider_name,
              critical,
              treatment_id: treatment,
            };

        if (type === RADIOLOGY) {
          data["radiology_type"] = radiology_type;
        }

        if (
          !date ||
          !start_time ||
          !end_time ||
          !type ||
          !type_description ||
          !reason ||
          (!provider_id && !provider_name)
        ) {
          message.error(this.formatMessage(messages.fillMandatory));
        } else if (
          moment(date).isSame(moment(), "day") &&
          moment(start_time).diff(moment(), "minutes") < 0
        ) {
          message.error(this.formatMessage(messages.pastTimeError));
        } else if (moment(end_time).isBefore(moment(start_time))) {
          message.error(this.formatMessage(messages.validTimingError));
        } else {
          try {
            this.setState({ submitting: true });
            const response = await addCarePlanAppointment(data, carePlanId);
            const {
              status,
              statusCode: code,
              payload: {
                message: errorMessage = "",
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
              resetFields();
              message.success(formatMessage(messages.add_appointment_success));
              // getAppointments(patient_id);
            } else {
              if (code === 500) {
                message.warn(formatMessage(messages.somethingWentWrong));
              } else {
                message.warn(errorMessage);
              }
            }
            this.setState({ submitting: false });
          } catch (error) {
            this.setState({ submitting: false });
          }
        }
      }
    });
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  onClose = () => {
    const { close } = this.props;
    const { formRef } = this;
    const {
      props: {
        form: { resetFields },
      },
    } = formRef;
    resetFields();
    close();
  };

  setFormRef = (formRef) => {
    this.formRef = formRef;
    if (formRef) {
      this.setState({ formRef: true });
    }
  };

  render() {
    const { visible, hideAppointment, appointmentVisible, editAppointment } =
      this.props;
    const { disabledSubmit, submitting = false } = this.state;

    const { onClose, formatMessage, setFormRef, handleSubmit, FormWrapper } =
      this;

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
          maskClosable={false}
          headerStyle={{
            position: "sticky",
            zIndex: "9999",
            top: "0px",
          }}
          destroyOnClose={true}
          onClose={editAppointment ? hideAppointment : onClose}
          visible={editAppointment ? appointmentVisible : visible}
          width={"35%"}
          title={
            editAppointment
              ? formatMessage(messages.appointment)
              : formatMessage(messages.add_appointment)
          }
          // headerStyle={{
          //     display:"flex",
          //     justifyContent:"space-between",
          //     alignItems:"center"
          // }}
        >
          {/* <div className="flex direction-row justify-space-between"> */}
          <FormWrapper wrappedComponentRef={setFormRef} {...this.props} />
          {/* <CalendarTimeSelection
                className="calendar-section wp60"
            /> */}
          {/* </div> */}

          <Footer
            onSubmit={handleSubmit}
            onClose={onClose}
            submitText={formatMessage(messages.submit_text)}
            submitButtonProps={submitButtonProps}
            cancelComponent={null}
            submitting={submitting}
          />
        </Drawer>
      </Fragment>
    );
  }
}

export default injectIntl(AddAppointment);
