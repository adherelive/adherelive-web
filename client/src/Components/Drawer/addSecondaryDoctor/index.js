import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { hasErrors } from "../../../Helper/validation";

import Drawer from "antd/es/drawer";
import Form from "antd/es/form";
import message from "antd/es/message";

import messages from "./messages";
import AddFoodItemForm from "./form";
import Footer from "../footer";

class AddSecondaryDoc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      disabledSubmit: true,
      submitting: false,
    };

    this.FormWrapper = Form.create({ onFieldsChange: this.onFormFieldChanges })(
      AddFoodItemForm
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
    const { addSecondaryDoctorToCareplan, carePlanId = null } = this.props;
    const { formRef = {}, formatMessage } = this;

    const {
      props: {
        form: { validateFields, resetFields },
      },
    } = formRef;

    validateFields(async (err, values) => {
      if (!err) {
        let { doctor_role_id } = values;

        const data = {
          user_role_id: doctor_role_id,
          care_plan_id: carePlanId,
        };

        try {
          this.setState({ submitting: true });
          const response = await addSecondaryDoctorToCareplan(data);
          const {
            status,
            statusCode: code,
            payload: {
              message: errorMessage = "",
              error: { error_type = "" } = {},
            },
          } = response || {};

          if (!status) {
            message.error(errorMessage);
          } else {
            message.success(errorMessage);
          }
          this.setState({ submitting: false });

          if (status) {
            this.onClose();
          }
        } catch (error) {
          this.setState({ submitting: false });
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
    this.setState({
      visible: true,
      disabledSubmit: true,
      submitting: false,
    });
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
    const { visible } = this.props;
    const { disabledSubmit, submitting = false } = this.state;

    const { onClose, formatMessage, setFormRef, handleSubmit, FormWrapper } =
      this;

    const submitButtonProps = {
      disabled: disabledSubmit,
    };

    console.log("82376482364826348723", { props: this.props });

    return (
      <Fragment>
        <Drawer
          placement="right"
          maskClosable={false}
          headerStyle={{
            position: "sticky",
            zIndex: "9999",
            top: "0px",
          }}
          destroyOnClose={true}
          onClose={onClose}
          visible={visible}
          width={"35%"}
          title={formatMessage(messages.add_doctor)}
        >
          <FormWrapper wrappedComponentRef={setFormRef} {...this.props} />

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

export default injectIntl(AddSecondaryDoc);
