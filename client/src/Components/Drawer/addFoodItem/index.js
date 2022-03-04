import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { hasErrors } from "../../../Helper/validation";

import Drawer from "antd/es/drawer";
import Form from "antd/es/form";
import message from "antd/es/message";

import messages from "./message";
import AddFoodItemForm from "./form";
import Footer from "../footer";

class AddFoodItem extends Component {
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
    const { addFoodItem } = this.props;
    const { formRef = {}, formatMessage } = this;

    const {
      props: {
        form: { validateFields, resetFields },
      },
    } = formRef;

    validateFields(async (err, values) => {
      if (!err) {
        let {
          name: initail_name,
          portion_id = null,
          portion_size = 1,
          proteins = null,
          fats = null,
          carbs = null,
          fibers = null,
          calorific_value = null,
        } = values;

        const name = initail_name.trim();

        const data = {
          name,
          portion_id: portion_id ? parseInt(portion_id) : null,
          portion_size: portion_size ? parseFloat(portion_size) : null,
          proteins: proteins ? parseFloat(proteins) : null,
          fats: fats ? parseFloat(fats) : null,
          carbs: carbs ? parseFloat(carbs) : null,
          fibers: fibers ? parseFloat(fibers) : null,
          calorific_value: calorific_value ? parseFloat(calorific_value) : null,
        };

        try {
          this.setState({ submitting: true });
          const response = await addFoodItem(data);
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
    const { closeAddFoodItemDrawer } = this.props;

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
    closeAddFoodItemDrawer();
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
          title={formatMessage(messages.add_food_item)}
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

export default injectIntl(AddFoodItem);
