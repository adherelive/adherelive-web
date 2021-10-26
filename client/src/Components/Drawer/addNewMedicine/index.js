import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { hasErrors } from "../../../Helper/validation";
import moment from "moment";
import { USER_CATEGORY } from "../../../constant";
import Drawer from "antd/es/drawer";
import Form from "antd/es/form";
import message from "antd/es/message";

import messages from "./messages";
import AddMedicineForm from "./form";
import Footer from "../footer";

class AddMedicine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      disabledSubmit: true,
      submitting: false,
    };

    this.FormWrapper = Form.create({ onFieldsChange: this.onFormFieldChanges })(
      AddMedicineForm
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
    //props
    //   state
    const { formRef = {}, formatMessage } = this;

    const {
      props: {
        form: { validateFields, resetFields },
      },
    } = formRef;

    validateFields(async (err, values) => {
      if (!err) {
        let { type = "", name = "" } = values;

        const {
          addNewMedicine,
          addAdminMedicine,
          setNewMedicineId,
          auth: { authenticated_category } = {},
        } = this.props;

        const addMedicine =
          authenticated_category === USER_CATEGORY.ADMIN
            ? addAdminMedicine
            : addNewMedicine;

        if (name === "" || type === "") {
          message.error(formatMessage(messages.fillFieldsError));
          return;
        }

        this.setState({ submitting: true });
        const response = await addMedicine({ name, type, generic_name: name });
        const {
          status,
          statusCode,
          payload: { data = {}, message: respMsg = "" } = {},
        } = response || {};
        if (status) {
          const { medicines = {} } = data || {};
          const medId = Object.keys(medicines)[0];
          const { basic_info: { id = null } = {} } = medicines[medId] || {};
          if (setNewMedicineId) {
            setNewMedicineId(id);
          }
          message.success(respMsg);
          this.onClose();
        } else {
          message.warn(respMsg);
        }

        this.setState({ submitting: false });
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
    const { visible } = this.props;
    const { disabledSubmit, submitting = false } = this.state;

    const { onClose, formatMessage, setFormRef, handleSubmit, FormWrapper } =
      this;

    const submitButtonProps = {
      disabled: disabledSubmit,
    };

    return (
      <Fragment>
        <Drawer
          visible={visible}
          width={400}
          closable={true}
          onClose={this.onClose}
          headerStyle={{
            position: "sticky",
            zIndex: "9999",
            top: "0px",
          }}
          maskClosable={false}
          destroyOnClose={true}
          className="ant-drawer"
          title={formatMessage(messages.addNewMedicine)}
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

export default injectIntl(AddMedicine);
