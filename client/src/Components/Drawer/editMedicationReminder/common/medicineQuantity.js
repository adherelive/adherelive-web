import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import messages from "../message";

// antd models
import InputNumber from "antd/es/input-number";
import Form from "antd/es/form";
import Radio from "antd/es/radio";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const { Item: FormItem } = Form;

const FIELD_NAME = "quantity";
const MAXIMUM_LENGTH = 10000;

class MedicineQuantity extends Component {
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

  formatMessage = (data) => this.props.intl.formatMessage(data);

  onRadioChange = (e) => {
    e.preventDefault();
    const {
      form: { setFieldsValue, getFieldValue },
      enableSubmit,
    } = this.props;
    const currentValue = getFieldValue(FIELD_NAME) || 0.0;
    setFieldsValue({
      [FIELD_NAME]: parseFloat(currentValue) + parseFloat(e.target.value),
    });
    enableSubmit();
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
    const {
      form,
      medications,
      payload: { id: medication_id, canViewDetails = false } = {},
      medicationData = {},
    } = this.props;
    const { getFieldDecorator, getFieldError, isFieldTouched, getFieldValue } =
      form;

    const { onRadioChange, formatMessage, getInitialValue } = this;

    let { basic_info: { details: { quantity } = {} } = {} } =
      medications[medication_id] || {};
    let { schedule_data: { quantity: quant = "" } = {} } = medicationData;
    if (quant) {
      quantity = parseFloat(quant);
    }

    const error = isFieldTouched(FIELD_NAME) && getFieldError(FIELD_NAME);

    return (
      <Fragment>
        <div className="flex align-items-end justify-content-space-between">
          <div className="flex direction-row flex-grow-1">
            <label htmlFor="quantity" className="form-label" title="Quantity">
              {formatMessage(messages.quantity)}
            </label>

            <div className="star-red">*</div>
          </div>
          {/* <div className="label-color fontsize12 mb8">
            
            </div> */}
          <div className="flex-grow-0">
            <RadioGroup
              size="small"
              className="flex justify-content-end"
              disabled={canViewDetails}
            >
              <RadioButton value={1.0} onClick={onRadioChange}>
                +1.0
              </RadioButton>
              <RadioButton value={0.5} onClick={onRadioChange}>
                +0.50
              </RadioButton>
              <RadioButton value={0.25} onClick={onRadioChange}>
                +0.25
              </RadioButton>
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
                max: MAXIMUM_LENGTH,
                message: "Please enter valid quantity",
              },
            ],
            initialValue: quantity ? quantity : 1,
          })(
            <InputNumber
              min={0.01}
              style={{ width: "100%" }}
              disabled={canViewDetails}
            />
          )}
        </FormItem>
      </Fragment>
    );
    // }
  }
}

const Field = injectIntl(MedicineQuantity);

export default {
  field_name: FIELD_NAME,
  maximum_length: MAXIMUM_LENGTH,
  render: (props) => <Field {...props} />,
};
