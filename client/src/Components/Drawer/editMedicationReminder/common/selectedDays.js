import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Form, Input, Tag } from "antd";
import messages from "../message";
import { DAYS, ALTERNATE_DAYS } from "../../../../constant";
import startDate from "./startDate";
import endDate from "./endDate";
import moment from "moment";
import { Radio } from "antd";
import whenToTake, {
  WHEN_TO_TAKE_BUTTONS,
} from "../../addMedicationReminder/common/whenTotakeMedicaine";

const { Item: FormItem } = Form;
const { CheckableTag } = Tag;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const FIELD_NAME = "repeat_days";

class SelectedDays extends Component {
  constructor(props) {
    super(props);
    const {
      medications,
      payload: { id: medication_id } = {},
      medicationData = {},
    } = props;
    let { basic_info: { details: { repeat_days = [] } = {} } = {} } =
      medications[medication_id] || {};

    let { schedule_data: { repeat_days: rDays = [] } = {} } = medicationData;
    if (rDays.length) {
      repeat_days = rDays;
    }
    this.state = {
      selectedDays: repeat_days,
    };
  }

  componentDidMount() {
    const {
      form: { validateFields },
    } = this.props;
    validateFields();
    const {
      medications,
      payload: { id: medication_id } = {},
      medicationData = {},
    } = this.props;
    let { basic_info: { details: { repeat_days = [] } = {} } = {} } =
      medications[medication_id] || {};

    let { schedule_data: { repeat_days: rDays = [] } = {} } = medicationData;
    if (rDays.length) {
      repeat_days = rDays;
    }
    this.state = {
      selectedDays: repeat_days,
    };
  }

  componentWillUnmount() {
    const {
      form: { validateFields },
    } = this.props;
    validateFields();
  }

  formatMessage = (data) => this.props.intl.formatMessage(data);

  handleCheckDays = (tag, checked) => {
    const { selectedDays } = this.state;
    const nextSelectedTags = checked
      ? [...selectedDays, tag]
      : selectedDays.filter((t) => t !== tag);
    this.setState({ selectedDays: nextSelectedTags });
    const {
      form: { setFieldsValue, validateFields },
      enableSubmit,
    } = this.props;
    setFieldsValue({ [FIELD_NAME]: nextSelectedTags.join(",") });
    validateFields();
    enableSubmit();
  };

  setRepeatEveryDay = (e) => {
    e.preventDefault();
    const {
      form: { setFieldsValue, validateFields },
      enableSubmit,
    } = this.props;
    this.setState({ selectedDays: DAYS });
    setFieldsValue({ [FIELD_NAME]: DAYS.join(",") });
    validateFields();
    enableSubmit();
  };

  setRepeatAlternateDay = (e) => {
    e.preventDefault();
    const {
      form: { setFieldsValue, validateFields },
      enableSubmit,
    } = this.props;
    this.setState({ selectedDays: ALTERNATE_DAYS });
    setFieldsValue({ [FIELD_NAME]: ALTERNATE_DAYS.join(",") });
    validateFields();
    enableSubmit();
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      medications,
      payload: { id: medication_id, canViewDetails = false } = {},
    } = this.props;

    const { basic_info: { details: { repeat_days } = {} } = {} } =
      medications[medication_id] || {};

    const { selectedDays } = this.state;
    const { handleCheckDays, formatMessage } = this;
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
      } else if (selectedDaysArray.length == 4) {
        ALTERNATE_DAYS.map((value) => {
          if (!selectedDaysArray.includes(value)) {
            selectedDaysRadio = null;
          }
        });
      } else {
        selectedDaysRadio = null;
      }
    } else {
      selectedDaysRadio = null;
    }
    let diff = end ? moment(end).diff(moment(start), "days") : 1;
    // let selectedRadio = end ? null : 3;
    // if( diff == 7 ){
    //   selectedRadio = 1;
    // } else if( diff == 14 ){
    //   selectedRadio = 2;
    // }

    const isSos =
      getFieldValue(whenToTake.field_name_abbr) === WHEN_TO_TAKE_BUTTONS.SOS.id;

    console.log("817218291 isSos", { isSos });

    if (isSos) {
      return null;
    }

    return (
      <div className="mb20 select-days-form-content">
        <div className="flex row">
          <span className="form-label">Repeats</span>
          <div className="star-red">*</div>
        </div>
        <FormItem style={{ display: "none" }}>
          {getFieldDecorator(FIELD_NAME, {
            rules: [
              {
                required: true,
              },
            ],
            initialValue: selectedDays.join(","),
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
          value={selectedDaysRadio}
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
