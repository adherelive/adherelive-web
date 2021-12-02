import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Input, Form } from "antd";
import messages from "../message";

const FIELD_NAME = "notes";
const { TextArea } = Input;
const { Item: FormItem } = Form;

class Notes extends Component {
  formatMessage = (data) => this.props.intl.formatMessage(data);

  getInitialValue = () => {
    const { purpose, event } = this.props;
    let initialValue;
    if (purpose) {
      const { data: { notes } = {} } = event;
      initialValue = notes;
    }
    return initialValue;
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { formatMessage, getInitialValue } = this;

    return (
      <FormItem>
        {getFieldDecorator(FIELD_NAME, {
          initialValue: getInitialValue(),
        })(<TextArea placeholder={formatMessage(messages.notes)} autosize />)}
      </FormItem>
    );
  }
}

const Field = injectIntl(Notes);

export default {
  field_name: FIELD_NAME,
  render: (props) => <Field {...props} />,
};
