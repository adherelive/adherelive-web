import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { hasErrors } from "../../../Helper/validation";

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
    const { addAppointment } = this.props;
    const { formRef = {}, formatMessage } = this;
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
          end_time,
          description = "",
          treatment = "",
        } = values;

        const data = {
          // todo: change participant one with patient from store
          participant_two: {
            id: "2",
            category: "patient",
          },
          date,
          start_time,
          end_time,
          description,
          treatment,
        };

        try {
          const response = await addAppointment(data);
          const { status } = response || {};

          if (status === true) {
            message.success(formatMessage(messages.add_appointment_success));
          } else {
            // TODO: add error message from response here
            // message.error(formatMessage(message.add_appointment_error))
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
    const { visible = true } = this.props;
    const { disabledSubmit } = this.state;
    const {
      onClose,
      formatMessage,
      setFormRef,
      handleSubmit,
      FormWrapper,
    } = this;

    console.log("1897123 disabledSubmit ---> ", disabledSubmit);

    const submitButtonProps = {
      disabled: disabledSubmit,
      // loading: loading && !deleteLoading
    };
    return (
      <Fragment>
        <Drawer
          placement="right"
          // closable={false}
          onClose={onClose}
          visible={visible} // todo: change as per prop -> "visible", -- WIP --
          width={800}
          title={formatMessage(messages.add_appointment)}
          // headerStyle={{
          //     display:"flex",
          //     justifyContent:"space-between",
          //     alignItems:"center"
          // }}
        >
          <div className="flex direction-row justify-space-between">
            <FormWrapper wrappedComponentRef={setFormRef} {...this.props} />
            <CalendarTimeSelecton 
                className="calendar-section wp60"
            />
          </div>

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
