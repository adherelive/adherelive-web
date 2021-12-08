import React, { Component } from "react";
import { Form, Input } from "antd";
import { injectIntl } from "react-intl";
import { isNumber } from "../../../../Helper/validation";
import messages from "../message";
import repeatTypeField from "./repeatType";
import { REPEAT_TYPE } from "../../../../constant";

const { Item: FormItem } = Form;
const FIELD_NAME = "repeatInterval";

class RepeatInterval extends Component {
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

  validateRepeatInterval = (rule, value, callback) => {
    const res = isNumber(value);
    if (value && res.valid === false) {
      callback(`${value} is not valid Repeat Interval.`);
    } else if (value > 1000) {
      callback("Repeat Interval cannot be greater than 1000");
    } else {
      callback();
    }
  };

  getRepeatTypeStr = () => {
    const {
      form: { getFieldValue },
    } = this.props;
    const repeatType = getFieldValue(repeatTypeField.field_name);
    switch (repeatType) {
      case REPEAT_TYPE.WEEKLY:
        return "Weeks";
      case REPEAT_TYPE.MONTHLY:
        return "Months";
      case REPEAT_TYPE.YEARLY:
        return "Years";
      default:
        return "";
    }
  };

  getInitialValue = () => {
    let initialValue;
    const { purpose, event } = this.props;
    if (purpose) {
      const { data: { repeatInterval } = {} } = event;
      initialValue = repeatInterval;
    }
    return initialValue;
  };

  onChangeRepeatInterval = (e) => {
    const { adjustEndDate } = this.props;
    const val = e.target.value;
    const res = isNumber(val);
    if (val && !!res.valid && val < 1000) {
      adjustEndDate(e.target.value);
    }
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldError, isFieldTouched },
      adjustEndDate,
      intl: { formatMessage },
    } = this.props;
    const {
      validateRepeatInterval,
      getRepeatTypeStr,
      getInitialValue,
      onChangeRepeatInterval,
    } = this;

    const repeatIntervalError =
      isFieldTouched(FIELD_NAME) && getFieldError(FIELD_NAME);

    return (
      <div className="ml16">
        <FormItem
          className="flex-1 flex repeat-interval"
          label={"Repeats Every"}
          validateStatus={repeatIntervalError ? "error" : ""}
          help={repeatIntervalError || ""}
        >
          {getFieldDecorator(FIELD_NAME, {
            rules: [
              {
                required: true,
                message: formatMessage(messages.repeatIntervalError),
              },

              {
                validator: validateRepeatInterval,
              },
            ],
            initialValue: getInitialValue(),
          })(
            <Input
              onChange={onChangeRepeatInterval}
              className="full-width repeat-interval"
              min={1}
              style={{ width: "100%" }}
            />
          )}
          <div className="repeat-type">{getRepeatTypeStr()}</div>
        </FormItem>
      </div>
    );
  }
}

const Field = injectIntl(RepeatInterval);

export default {
  field_name: FIELD_NAME,
  render: (props) => <Field {...props} />,
};
