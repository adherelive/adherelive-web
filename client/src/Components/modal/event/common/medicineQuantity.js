import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { InputNumber, Form, Radio } from "antd";
import messages from "../message";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const { Item: FormItem } = Form;

const FIELD_NAME = "quantity";

class MedicineQuantity extends Component {
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

  formatMessage = data => this.props.intl.formatMessage(data);

  onRadioChange = e => {
    const {
      form: { setFieldsValue }
    } = this.props;
    setFieldsValue({ [FIELD_NAME]: e.target.value });
  };

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
      isFieldTouched
      //getFieldValue
    } = form;

    const { onRadioChange, formatMessage, getInitialValue } = this;

    // console.log("act,", activityType, activityModeOption, activityMode);
    const error = isFieldTouched(FIELD_NAME) && getFieldError(FIELD_NAME);

    return (
      <Fragment>
        <div className="flex align-items-end justify-content-space-between">
          <div className="flex">
            <label
              for="quantity"
              className="ant-form-item-required label-color mb8"
              title="Quantity"
              style={{ fontSize: "12px" }}
            >
              {formatMessage(messages.quantity)}
            </label>
            {/* <div className="label-color fontsize12 mb8">
              
            </div> */}
          </div>
          <div className="tab-radio-button">
            <RadioGroup
              size="small"
              onChange={onRadioChange}
              className="flex justify-content-end"
            >
              <RadioButton value={0.25}>+0.25</RadioButton>
              <RadioButton value={0.5}>+0.5</RadioButton>
              <RadioButton value={1.0}>+1.0</RadioButton>
            </RadioGroup>
          </div>
        </div>
        <FormItem
          className="flex-1 align-self-end"
          validateStatus={error ? "error" : ""}
          help={error ? error[0] : ""}
        >
          {getFieldDecorator(FIELD_NAME, {
            rules: [
              {
                required: true,
                message: "Enter Quantity"
              },
              {
                type: "number",
                message: "Quantity should be a number"
              }
            ],
            initialValue: getInitialValue()
          })(<InputNumber style={{ width: "100%" }} />)}
        </FormItem>
      </Fragment>
    );
    // }
  }
}

const Field = injectIntl(MedicineQuantity);

export default {
  field_name: FIELD_NAME,
  render: props => <Field {...props} />
};
