import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Radio, Form } from "antd";

import messages from "../message";
import { getActivityBetween } from "../constant";
import appointmentType from "./appointmentType";

const { Item: FormItem } = Form;

const { Group: RadioGroup, Button: RadioButton } = Radio;

const FIELD_NAME = "activityMode";

class ActivityMode extends Component {
  onChangeActivityMode = (e) => {
    e.preventDefault();
    const { onChangeActivityMode } = this.props;
    onChangeActivityMode(e.target.value);
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  getInitialValue = () => {
    let initialValue;

    const {
      currentUser,
      data,
      form: { getFieldValue },
      otherUser,
      purpose,
      event = {},
    } = this.props;

    if (purpose) {
      const { data: { activityMode } = {} } = event;
      return activityMode;
    }

    const config = getActivityBetween({
      viewer: currentUser,
      other: otherUser,
      event: data,
      edit: !!purpose,
    });

    const activityType = getFieldValue(appointmentType.field_name);
    const { mode = {} } = config;

    const activityModeOption = mode[activityType] || [];

    const n = activityModeOption.length;

    for (let i = 0; n > i; i++) {
      const activityMode = activityModeOption[i];
      if (!activityMode.disable) {
        initialValue = activityMode.value;
        break;
      }
    }

    return initialValue;
  };

  getActivityModeRadioButton = () => {
    const {
      currentUser,
      data,
      form: { getFieldValue },
      otherUser,
      purpose,
    } = this.props;
    const { formatMessage } = this;

    const config = getActivityBetween({
      viewer: currentUser,
      other: otherUser,
      event: data,
      edit: !!purpose,
    });

    const activityType = getFieldValue(appointmentType.field_name);
    const { mode = {} } = config;

    const activityModeOption = mode[activityType] || [];

    return activityModeOption.map((option) => {
      return (
        <RadioButton
          key={option.value}
          className="full-width"
          value={option.value}
          disabled={option.disable}
        >
          {formatMessage(option.label)}
        </RadioButton>
      );
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      purpose,
    } = this.props;

    const { formatMessage, getActivityModeRadioButton, getInitialValue } = this;

    return (
      <FormItem label={formatMessage(messages.activity)}>
        {getFieldDecorator(FIELD_NAME, {
          initialValue: getInitialValue(),
        })(
          <RadioGroup
            className="radio-group-tab"
            disabled={!!purpose}
            buttonStyle="solid"
            // onChange={onChangeActivityMode}
          >
            {getActivityModeRadioButton()}
          </RadioGroup>
        )}
      </FormItem>
    );
    // }
  }
}

const Field = injectIntl(ActivityMode);

export default {
  field_name: FIELD_NAME,
  render: (props) => <Field {...props} />,
};
