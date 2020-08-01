import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Form, Input, Tag } from "antd";
import messages from "../message";
import { DAYS } from "../../../../constant";

const { Item: FormItem } = Form;
const { CheckableTag } = Tag;

const FIELD_NAME = "repeat_days";

class SelectedDays extends Component {
  constructor(props) {
    super(props);
    const { medications, payload: { id: medication_id } = {}, medicationData = {} } = props;
    let { basic_info: { details: { repeat_days = [] } = {} } = {} } = medications[medication_id] || {};


    let { schedule_data: { repeat_days: rDays = [] } = {} } = medicationData;
    if (rDays.length) {
      repeat_days = rDays;
    }
    this.state = {
      selectedDays: repeat_days
    };
  }

  componentDidMount() {
    const {
      form: { validateFields }
    } = this.props;
    validateFields();
    const { medications, payload: { id: medication_id } = {}, medicationData = {} } = this.props;
    let { basic_info: { details: { repeat_days = [] } = {} } = {} } = medications[medication_id] || {};


    let { schedule_data: { repeat_days: rDays = [] } = {} } = medicationData;
    if (rDays.length) {
      repeat_days = rDays;
    }
    this.state = {
      selectedDays: repeat_days
    };
  }

  componentWillUnmount() {
    const {
      form: { validateFields }
    } = this.props;
    validateFields();
  }

  formatMessage = data => this.props.intl.formatMessage(data);

  handleCheckDays = (tag, checked) => {
    const { selectedDays } = this.state;
    const nextSelectedTags = checked
      ? [...selectedDays, tag]
      : selectedDays.filter(t => t !== tag);
    this.setState({ selectedDays: nextSelectedTags });
    const {
      form: { setFieldsValue, validateFields }
    } = this.props;
    setFieldsValue({ [FIELD_NAME]: nextSelectedTags.join(",") });
    validateFields();
  };

  render() {
    const {
      form: { getFieldDecorator },
      medications,
      payload: { id: medication_id } = {}
    } = this.props;

    const { basic_info: { details: { repeat_days } = {} } = {} } = medications[medication_id] || {};

    const { selectedDays } = this.state;
    const { handleCheckDays, formatMessage } = this;


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
                required: true
              }
            ],
            initialValue: selectedDays.join(",")
          })(<Input />)}
        </FormItem>
        <div className="flex-shrink-1 flex justify-space-evenly select-days">
          {DAYS.map(tag => (
            <CheckableTag
              key={tag}
              checked={selectedDays.indexOf(tag) > -1}
              onChange={checked => handleCheckDays(tag, checked)}
            >
              {tag}
            </CheckableTag>
          ))}
        </div>
      </div>
    );
  }
}

const Field = injectIntl(SelectedDays);

export default {
  field_name: FIELD_NAME,
  render: props => <Field {...props} />
};
