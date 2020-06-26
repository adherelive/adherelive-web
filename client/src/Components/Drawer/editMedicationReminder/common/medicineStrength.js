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
    const { form, medications, payload: {id: medication_id} = {} , medicationData = {}} = this.props;
    const {
      getFieldDecorator,
      getFieldError,
      isFieldTouched
      //getFieldValue
    } = form;
    // console.log("act,", activityType, activityModeOption, activityMode);

    let {basic_info : {details: {strength} = {}} = {}} = medications[medication_id] || {};
    
    let { schedule_data: { strength:dose=0 } = {} } = medicationData;
    if(dose){
      strength=parseInt(dose);
    }
    const error = isFieldTouched(FIELD_NAME) && getFieldError(FIELD_NAME);

    return (
      <Fragment>
        <FormItem
          className="flex-1 align-self-end wp80"
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
            initialValue: strength ? strength : null
          })(<InputNumber min={1} style={{ width: "100%" }} />)}
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
