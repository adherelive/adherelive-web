import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";

// antd models
import InputNumber from "antd/es/input-number";
import Input from "antd/es/input";
import Form from "antd/es/form";

const { Item: FormItem } = Form;

const FIELD_NAME = "strength";
const MAXIMUM_LENGTH = 10000;

class MedicationStrength extends Component {
  componentDidMount() {
    const {
      form: { validateFields },
    } = this.props;
    validateFields();
  }

  componentWillUnmount() {
    const {
      form: { validateFields },
    } = this.props;
    validateFields();
  }

  getParentNode = (t) => t.parentNode;

  getInitialValue = () => {
    const { purpose, event: { data = {} } = {} } = this.props;
    let initialValue;
    if (purpose) {
      initialValue = data[FIELD_NAME];
    }
    return initialValue;
  };

  render() {
    const { form } = this.props;
    const {
      getFieldDecorator,
      getFieldError,
      isFieldTouched,
      medication,
      getFieldValue,
    } = form;

    const error = isFieldTouched(FIELD_NAME) && getFieldError(FIELD_NAME);

    const { getInitialValue } = this;

    return (
      <Fragment>
        <FormItem
          className="flex-1 align-self-end wp100"
          validateStatus={error ? "error" : ""}
          help={error ? error[0] : ""}
        >
          {getFieldDecorator(FIELD_NAME, {
            rules: [
              {
                required: true,
                message: "Enter Medicine Strength.",
              },

              {
                type: "number",
                max: MAXIMUM_LENGTH,
                message: "Please enter valid strength",
              },
            ],
            initialValue: getInitialValue(),
          })(<InputNumber min={0.01} style={{ width: "100%" }} />)}
        </FormItem>
      </Fragment>
    );
    // }
  }
}

const Field = injectIntl(MedicationStrength);

export default {
  field_name: FIELD_NAME,
  maximum_length: MAXIMUM_LENGTH,
  render: (props) => <Field {...props} />,
};
