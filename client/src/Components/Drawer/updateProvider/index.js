import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Drawer, Select, Input } from "antd";
import message from "antd/es/message";
import Footer from "../footer";
import Form from "antd/es/form";
import messages from "./message";

import UpdateProviderForm from "./form";
import { SAVINGS, CURRENT, ACCOUNT_TYPES } from "../../../constant";

class updateProviderDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
    };

    this.FormWrapper = Form.create({ onFieldsChange: this.onFormFieldChanges })(
      UpdateProviderForm
    );
  }

  componentDidMount() {}

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
        form: { validateFields, resetFields },
      },
    } = formRef;

    validateFields(async (err, values) => {
      if (!err) {
        const {
          payload = {},
          providers = {},
          users = {},
          visible,
        } = this.props;
        const { provider_id = null } = payload;

        let {
          name = "",
          prefix = "91",
          mobile_number = "",
          email = "",
          address = "",
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

        let data = {};

        data = {
          name,
          prefix,
          mobile_number,
          email,
          address,
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
          const { updateProvider } = this.props;
          this.setState({ submitting: true });
          const response = await updateProvider(provider_id, data);

          const { status, payload: { message: msg } = {} } = response;
          if (status) {
            message.success(this.formatMessage(messages.updateProviderSuccess));
            this.onClose();
          } else {
            message.warn(msg);
          }

          this.setState({ submitting: false });
        } catch (err) {
          console.log("err", err);
          this.setState({ submitting: false });
          message.warn(this.formatMessage(messages.somethingWentWrong));
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
    if (formRef) {
      this.setState({ formRef: true });
    }
  };

  render() {
    const { payload = {}, providers = {}, users = {}, visible } = this.props;
    const { provider_id = null } = payload;
    const { submitting = false } = this.state;

    const { onClose, formatMessage, setFormRef, handleSubmit, FormWrapper } =
      this;

    if (visible !== true) {
      return null;
    }

    return (
      <Fragment>
        <Drawer
          title={this.formatMessage(messages.updateProvider)}
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
          width={`30%`}
        >
          {/* {this.renderUpdateProviderForm()} */}
          <FormWrapper
            wrappedComponentRef={setFormRef}
            {...this.props}
            provider_id={provider_id}
          />

          <Footer
            onSubmit={this.handleSubmit}
            onClose={onClose}
            submitText={this.formatMessage(messages.submit)}
            submitButtonProps={null}
            cancelComponent={null}
            submitting={submitting}
          />
        </Drawer>
      </Fragment>
    );
  }
}

export default injectIntl(updateProviderDrawer);
