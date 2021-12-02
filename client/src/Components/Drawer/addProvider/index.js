import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import Footer from "../footer";
import Form from "antd/es/form";
import messages from "./message";

import Drawer from "antd/es/drawer";
import message from "antd/es/message";

import AddProviderForm from "./form";

class addProviderDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabledOk: false,
      submitting: false,
    };

    this.FormWrapper = Form.create({ onFieldsChange: this.onFormFieldChanges })(
      AddProviderForm
    );
  }

  onFormFieldChanges = (props) => {
    const {
      form: { getFieldsError, isFieldsTouched },
    } = props;
    const { disabledOk } = this.state;

    if (isFieldsTouched()) {
      const isError = this.hasErrors(getFieldsError());
      console.log("763132 isError --> ", {
        disabledOk,
        isError,
        isFieldsTouched: isFieldsTouched(),
      });

      if (disabledOk !== isError && isFieldsTouched()) {
        // if (isError && isFieldsTouched()) {
        this.setState({ disabledOk: isError });
      }
    }
    // else {
    //   this.setState({ disabledOk: true });
    // }
  };

  hasErrors = (fieldsError) => {
    // let hasError = false;

    console.log("198273178 fieldsError --> ", { fieldsError });
    return Object.keys(fieldsError).some((field) => fieldsError[field]);
  };

  setPassword = (e) => {
    e.preventDefault();
    const { value } = e.target;
    this.setState({ password: value });
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  onClose = () => {
    const { close } = this.props;
    close();
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { formRef = {}, formatMessage } = this;

    const {
      props: {
        form: { validateFields },
      },
    } = formRef;

    validateFields(async (err, values) => {
      if (!err) {
        let {
          name = "",
          prefix = "91",
          mobile_number = "",
          email = "",
          address = "",
          password = "",
          confirm_password = "",
          account_type = "",
          customer_name = "",
          account_number = "",
          ifsc_code = "",
          upi_id = "",
          razorpay_account_id = "",
          razorpay_account_name = "",
          icon = "",
          banner = "",
          prescription_details = "",
        } = values;

        const data = {
          name,
          prefix,
          mobile_number,
          email,
          address,
          password,
          confirm_password,
          account_type,
          customer_name,
          account_number,
          ifsc_code,
          upi_id,
          razorpay_account_id,
          razorpay_account_name,
          icon,
          banner,
          prescription_details,
        };

        try {
          const { addProvider } = this.props;

          this.setState({ submitting: true });

          const response = await addProvider(data);
          const { status, payload: { message: msg } = {} } = response;
          if (status) {
            message.success(formatMessage(messages.addProviderSuccess));
            this.onClose();
          } else {
            message.warn(msg);
          }

          this.setState({ submitting: false });
        } catch (err) {
          console.log("err", err);
          this.setState({ submitting: false });
          message.warn(formatMessage(messages.somethingWentWrong));
        }
      } else {
        console.log("18731297 err --> ", err);
        let allErrors = "";
        for (let each in err) {
          const { errors = [] } = err[each] || {};
          for (let error of errors) {
            const { message = "" } = error;
            allErrors = allErrors + message + ".";
          }
        }
        message.warn(allErrors);
      }
    });
  };

  setFormRef = (formRef) => {
    this.formRef = formRef;
    // if (formRef) {
    //   this.setState({ formRef: true });
    // }
  };

  render() {
    const { visible, loading } = this.props;
    const { disabledOk, submitting = false } = this.state;
    const { onClose, formatMessage, setFormRef, handleSubmit, FormWrapper } =
      this;

    const submitButtonProps = {
      disabled: disabledOk,
      loading,
    };

    if (visible !== true) {
      return null;
    }

    return (
      <Fragment>
        <Drawer
          title={formatMessage(messages.addProvider)}
          placement="right"
          maskClosable={false}
          headerStyle={{
            position: "sticky",
            zIndex: "9999",
            top: "0px",
          }}
          destroyOnClose={true}
          onClose={onClose}
          // visible={visible}
          visible={true}
          width={`30%`}
        >
          {/* {this.renderAddProviderForm()} */}
          <FormWrapper wrappedComponentRef={setFormRef} {...this.props} />

          <Footer
            onSubmit={handleSubmit}
            onClose={onClose}
            submitText={this.formatMessage(messages.submit)}
            submitButtonProps={submitButtonProps}
            cancelComponent={null}
            submitting={submitting}
          />
        </Drawer>
      </Fragment>
    );
  }
}

export default injectIntl(addProviderDrawer);
