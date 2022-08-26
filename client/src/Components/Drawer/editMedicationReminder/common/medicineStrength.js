import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";

// antd models
import InputNumber from "antd/es/input-number";
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
    const {
      form,
      medications,
      payload: { id: medication_id } = {},
      medicationData = {},
      payload: { canViewDetails = false } = {},
    } = this.props;
    const {
      getFieldDecorator,
      getFieldError,
      isFieldTouched,
      //getFieldValue
    } = form;

    let { basic_info: { details: { strength } = {} } = {} } =
      medications[medication_id] || {};

    let { schedule_data: { strength: dose = 0 } = {} } = medicationData;
    if (dose) {
      strength = parseInt(dose);
    }
    const error = isFieldTouched(FIELD_NAME) && getFieldError(FIELD_NAME);

    return (
      <Fragment>
        <FormItem
          className="flex-1 align-self-end wp100"
          validateStatus={error ? "error" : ""}
          // className='wp80'
          help={error ? error[0] : ""}
        >
          {getFieldDecorator(FIELD_NAME, {
            rules: [
              {
                required: true,
                message: "Enter Medicine Strength.  ",
              },
              {
                type: "number",
                max: MAXIMUM_LENGTH,
                message: "Please enter valid strength",
              },
            ],
            initialValue: strength ? strength : null,
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

const Field = injectIntl(MedicationStrength);

export default {
  field_name: FIELD_NAME,
  maximum_length: MAXIMUM_LENGTH,
  render: (props) => <Field {...props} />,
};
