import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { InputNumber, Form } from "antd";

const { Item: FormItem } = Form;

const FIELD_NAME = "strength";
class MedicationStrength extends Component {
  componentDidMount() {
    const {
      form: { validateFields }
    } = this.props;
    validateFields();
  }
  componentWillUnmount() {
    const {
      form: { validateFields }
    } = this.props;
    validateFields();
  }

  getParentNode = t => t.parentNode;

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
      medication
      //getFieldValue
    } = form;
    // console.log("act,", activityType, activityModeOption, activityMode);
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
                message: "Enter Medicine Strength.  "
              },
              {
                type: "number",
                message: "Medicine Strength should be a number"
              }
            ],
            initialValue: getInitialValue()
          })(<InputNumber  min={1} style={{ width: "100%" }} />)}
        </FormItem>
      </Fragment>
    );
    // }
  }
}

const Field = injectIntl(MedicationStrength);

export default {
  field_name: FIELD_NAME,
  render: props => <Field {...props} />
};
