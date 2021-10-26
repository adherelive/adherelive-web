import React, { Component } from "react";
import { Form } from "antd";
import { injectIntl } from "react-intl";
import TextArea from "antd/es/input/TextArea";
import messages from "../message";

const FIELD_NAME = "special_instruction";

const { Item: FormItem } = Form;

class Formulation extends Component {
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

  formatMessage = (data) => this.props.intl.formatMessage(data);

  render() {
    const {
      form,
      medicationData = {},
      payload: { id: medication_id, canViewDetails = false } = {},
      medications,
    } = this.props;
    const { getFieldDecorator, getFieldError, isFieldTouched } = form;
    const error = isFieldTouched(FIELD_NAME) && getFieldError(FIELD_NAME);

    let { basic_info: { description = "" } = {} } =
      medications[medication_id] || {};

    const { schedule_data: { description: des = "" } = {} } = medicationData;

    if (des) {
      description = des;
    }

    return (
      <div className="mb20 select-days-form-content">
        <span className="form-label mb-4">
          {this.formatMessage(messages.specialInstruction)}
        </span>

        <FormItem validateStatus={error ? "error" : ""} help={error || ""}>
          {getFieldDecorator(FIELD_NAME, {
            initialValue: description,
          })(
            <TextArea
              autoFocus
              className="mt10"
              maxLength={1000}
              placeholder={this.formatMessage(messages.enterInstruction)}
              rows={4}
              disabled={canViewDetails}
            />
          )}
        </FormItem>
      </div>
    );
  }
}

const Field = injectIntl(Formulation);

export default {
  field_name: FIELD_NAME,
  render: (props) => <Field {...props} />,
};
