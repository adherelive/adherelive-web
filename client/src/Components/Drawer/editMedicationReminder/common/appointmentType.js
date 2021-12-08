import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Radio, Form } from "antd";

import messages from "../message";
import { getActivityBetween } from "../constant";
import activityModeField from "./activityMode";

const { Group: RadioGroup, Button: RadioButton } = Radio;

const { Item: FormItem } = Form;

const FIELD_NAME = "activityType";

class AppointmentType extends Component {
  // componentDidMount() {
  //   const {
  //     activityType,
  //     onChangeActivityType,
  //     data: { mode = {} } = {}
  //   } = this.props;
  //   const activityModeOption = mode[activityType] || [];
  //   for (const modeData of activityModeOption) {
  //     const { value, disable } = modeData;
  //     if (disable === false) {
  //       onChangeActivityType({ activityMode: value });
  //       break;
  //     }
  //   }
  // }

  onChangeActivityType = (e) => {
    e.preventDefault();
    const activityType = e.target.value;

    const {
      currentUser,
      data,
      form: { getFieldValue, setFieldsValue },
      otherUser,
      purpose,
    } = this.props;

    const config = getActivityBetween({
      viewer: currentUser,
      other: otherUser,
      event: data,
      edit: !!purpose,
    });

    const { mode = {} } = config;

    const prevActivityMode = getFieldValue(activityModeField.field_name);

    const activityModeOption = mode[activityType] || [];

    for (const modeData of activityModeOption) {
      const { value, disable } = modeData;
      if (disable === false) {
        setFieldsValue({ [activityModeField.field_name]: value });
        break;
      }
    }

    for (const modeData of activityModeOption) {
      const { value, disable } = modeData;
      if (disable === false && prevActivityMode === value) {
        setFieldsValue({ [activityModeField.field_name]: value });
        break;
      }
    }
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  getInitialValue = () => {
    let initialValue;

    const { currentUser, data, otherUser, purpose, event } = this.props;

    if (purpose) {
      const { data: { activityType } = {} } = event;
      return activityType;
    }

    const config = getActivityBetween({
      viewer: currentUser,
      other: otherUser,
      event: data,
      edit: !!purpose,
    });
    const { activity = [] } = config;

    if (activity.length > 0) {
      initialValue = activity[0].value;
    }

    return initialValue;
  };

  getAppointmentTypeRadioOption = () => {
    const { currentUser, data, otherUser, purpose } = this.props;
    const { formatMessage } = this;

    const config = getActivityBetween({
      viewer: currentUser,
      other: otherUser,
      event: data,
      edit: !!purpose,
    });
    const { activity = [] } = config;

    return activity.map((option) => {
      return (
        <RadioButton
          key={option.value}
          className="full-width"
          disabled={option.disable}
          value={option.value}
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
    const {
      formatMessage,
      onChangeActivityType,
      getAppointmentTypeRadioOption,
      getInitialValue,
    } = this;

    // if (activity.length === 1) {
    //   return (
    //     <div className="flex justify-content-start align-items-start mb24">
    //       <div className="label-color fontsize12 mr8">
    //         {formatMessage(messages.appointmentType)}
    //       </div>
    //       <div>{formatMessage(messages.forPatientApptType)}</div>
    //     </div>
    //   );
    // } else {
    return (
      <FormItem label={formatMessage(messages.appointmentType)}>
        {getFieldDecorator(FIELD_NAME, {
          initialValue: getInitialValue(),
        })(
          <RadioGroup
            className="radio-group-tab"
            buttonStyle="solid"
            disabled={!!purpose}
            onChange={onChangeActivityType}
            // defaultValue={activityType}
            // value={activityType}
          >
            {getAppointmentTypeRadioOption()}
          </RadioGroup>
        )}
      </FormItem>
    );
    // }
  }
}

const Field = injectIntl(AppointmentType);

export default {
  field_name: FIELD_NAME,
  render: (props) => <Field {...props} />,
};
