import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Checkbox, Form } from "antd";

const { Item: FormItem } = Form;

const FIELD_NAME = "critical";

class CriticalMedication extends Component {
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
      //getFieldValue
    } = form;
    const error = isFieldTouched(FIELD_NAME) && getFieldError(FIELD_NAME);

    const { getInitialValue } = this;

    return (
      <Fragment>
        <FormItem
          className="flex-1 wp100 critical-checkbox"
          validateStatus={error ? "error" : ""}
          help={error ? error[0] : ""}
        >
          {getFieldDecorator(FIELD_NAME, {
            initialValue: getInitialValue(),
          })(<Checkbox>Critical Medication</Checkbox>)}
        </FormItem>
      </Fragment>
    );
    // }
  }
}

const Field = injectIntl(CriticalMedication);

export default {
  field_name: FIELD_NAME,
  render: (props) => <Field {...props} />,
};
