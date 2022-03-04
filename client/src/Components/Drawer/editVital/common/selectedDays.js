import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Form, Input, Tag } from "antd";
import { DAYS, ALTERNATE_DAYS } from "../../../../constant";
import messages from "../message";

import startDate from "./startDate";
import endDate from "./endDate";
// import { REPEAT_TYPE } from "../../../../../constant";
import { Radio } from "antd";
import moment from "moment";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const { Item: FormItem } = Form;
const { CheckableTag } = Tag;

const FIELD_NAME = "repeat_days";

class SelectedDays extends Component {
  constructor(props) {
    super(props);
    const {
      form: { getFieldValue },
    } = props;

    const { vitals, payload: { id: vital_id } = {} } = props;
    let { details: { repeat_days = [] } = {} } = vitals[vital_id] || {};
    this.state = {
      selectedDays: repeat_days,
    };
  }

  componentDidMount() {
    const {
      form: { validateFields },
      payload: { id = null } = {},
      vitals = {},
    } = this.props;
    validateFields();

    const { vitalData = {} } = this.props;
    let { repeat_days: existing_repeat_days = "" } = vitalData || {};
    if (existing_repeat_days) {
      this.setState({ selectedDays: existing_repeat_days });
    } else {
      const { details: { repeat_days: vital_repeat_days_new = [] } = {} } =
        vitalData || {};
      existing_repeat_days = vital_repeat_days_new;
      this.setState({ selectedDays: existing_repeat_days });
    }

    const { details: { repeat_days = [] } = {} } = vitals[id] || {};
    if (repeat_days && repeat_days.length) {
      this.setState({ selectedDays: repeat_days });
    }
  }

  componentWillUnmount() {
    const {
      form: { validateFields },
    } = this.props;
    validateFields();
  }

  formatMessage = (data) => this.props.intl.formatMessage(data);

  getselectedDayRadio = () => {
    let { selectedDays } = this.state;
    const { vitalData = {} } = this.props;
    const {
      form: { getFieldValue },
    } = this.props;
    let start = getFieldValue(startDate.field_name);
    let end = getFieldValue(endDate.field_name);
    let selectedDaysValue = selectedDays;
    let selectedDaysArray = [];
    let selectedDaysRadio = 2;
    if (selectedDaysValue) {
      if (Array.isArray(selectedDaysValue)) {
        selectedDaysArray = selectedDaysValue;
      } else {
        selectedDaysArray = selectedDaysValue.split(",");
      }
      if (selectedDaysArray.length == 7) {
        selectedDaysRadio = 1;
        return selectedDaysRadio;
      } else if (selectedDaysArray.length == 4) {
        ALTERNATE_DAYS.map((value) => {
          if (!selectedDaysArray.includes(value)) {
            selectedDaysRadio = null;
          } else {
            selectedDaysRadio = 2;
            return selectedDaysRadio;
          }
        });
      } else {
        selectedDaysRadio = null;
      }
    } else {
      selectedDaysRadio = null;
    }

    return selectedDaysRadio;
  };

  setRepeatEveryDay = (e) => {
    const { selectedDays } = this.state;
    e.preventDefault();
    const {
      form: { setFieldsValue, validateFields },
      enableSubmit,
    } = this.props;
    // setFieldsValue({
    //   [repeatDaysField.field_name]: DAYS
    // });

    const nextSelectedTags = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    this.setState({ selectedDays: nextSelectedTags });

    setFieldsValue({ [FIELD_NAME]: nextSelectedTags });
    validateFields();
    enableSubmit();
  };

  setRepeatAlternateDay = (e) => {
    const { selectedDays } = this.state;
    e.preventDefault();
    const {
      form: { setFieldsValue, validateFields },
      enableSubmit,
    } = this.props;
    // setFieldsValue({
    //   [repeatDaysField.field_name]: ALTERNATE_DAYS
    // });

    const nextSelectedTags = ["Sun", "Tue", "Thu", "Sat"];
    this.setState({ selectedDays: nextSelectedTags });

    setFieldsValue({ [FIELD_NAME]: nextSelectedTags });
    validateFields();
    enableSubmit();
  };

  handleCheckDays = (tag, checked) => {
    const {
      form: { getFieldValue },
    } = this.props;
    const { selectedDays } = this.state;
    const nextSelectedTags = checked
      ? [...selectedDays, tag]
      : selectedDays.filter((t) => t !== tag);
    // console.log("nextSelectedTags",nextSelectedTags);
    this.setState({ selectedDays: nextSelectedTags });
    const {
      form: { setFieldsValue, validateFields },
    } = this.props;
    setFieldsValue({ [FIELD_NAME]: nextSelectedTags });
    validateFields();
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const { selectedDays } = this.state;
    const { vitalData = {}, payload: { canViewDetails = false } = {} } =
      this.props;
    let { repeat_days: existing_repeat_days = "" } = vitalData || {};
    if (!existing_repeat_days) {
      const { details: { repeat_days: vital_repeat_days_new = [] } = {} } =
        vitalData || {};
      existing_repeat_days = vital_repeat_days_new;
    }

    const { handleCheckDays, formatMessage } = this;

    return (
      <div className="select-days-form-content">
        <div className="flex row">
          <span className="form-label">Repeats</span>
          <div className="star-red">*</div>
        </div>
        <FormItem style={{ display: "none" }}>
          {getFieldDecorator(FIELD_NAME, {
            rules: [
              {
                required: true,
                message: "Please select days for vitals!",
              },
            ],
            initialValue: existing_repeat_days
              ? existing_repeat_days
              : selectedDays,
          })(<Input disabled={canViewDetails} />)}
        </FormItem>
        <div className="flex-shrink-1 flex justify-space-evenly select-days">
          {DAYS.map((tag) => (
            <CheckableTag
              key={tag}
              checked={selectedDays.indexOf(tag) > -1}
              onChange={
                !canViewDetails
                  ? (checked) => handleCheckDays(tag, checked)
                  : null
              }
            >
              {tag}
            </CheckableTag>
          ))}
        </div>

        <RadioGroup
          className="flex justify-content-end radio-formulation mt10 mb24"
          buttonStyle="solid"
          value={this.getselectedDayRadio()}
          disabled={canViewDetails}
        >
          <RadioButton value={1} onClick={this.setRepeatEveryDay}>
            {this.formatMessage(messages.everyday)}
          </RadioButton>
          <RadioButton value={2} onClick={this.setRepeatAlternateDay}>
            {this.formatMessage(messages.alternate)}
          </RadioButton>
        </RadioGroup>
      </div>
    );
  }
}

const Field = injectIntl(SelectedDays);

export default {
  field_name: FIELD_NAME,
  render: (props) => <Field {...props} />,
};
