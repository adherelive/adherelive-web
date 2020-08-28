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
    e.preventDefault();
    const {
      form: { setFieldsValue, getFieldValue }
    } = this.props;
    const currentValue = getFieldValue(FIELD_NAME) || 0.0;
    setFieldsValue({ [FIELD_NAME]: (parseFloat(currentValue) + parseFloat(e.target.value)) });
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

    const error = isFieldTouched(FIELD_NAME) && getFieldError(FIELD_NAME);

    return (
      <Fragment>
        <div className="flex align-items-end justify-content-space-between">
          <label
            htmlFor="quantity"
            className="form-label flex-grow-1"
            title="Quantity"
          >
            {formatMessage(messages.quantity)}
          </label>
          {/* <div className="label-color fontsize12 mb8">
              
            </div> */}
          <div className="flex-grow-0">
            <RadioGroup
              size="small"
              className="flex justify-content-end"
            >
              <RadioButton value={0.25} onClick={onRadioChange}>+0.25</RadioButton>
              <RadioButton value={0.5} onClick={onRadioChange}>+0.5</RadioButton>
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
                type: "number",
                message: "Quantity should be a number"
              }
            ],
            initialValue: getInitialValue()
          })(<InputNumber min={0.01} style={{ width: "100%" }} />)}
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
