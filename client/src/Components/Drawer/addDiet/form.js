import React, { Component } from "react";
import { injectIntl } from "react-intl";

import Form from "antd/es/form";
import messages from "./messages";
import moment from "moment";
import DatePicker from "antd/es/date-picker";
import TextArea from "antd/es/input/TextArea";
import Input from "antd/es/input";
import Tag from "antd/es/tag";
import { DAYS } from "../../../constant";

const { Item: FormItem } = Form;
const { CheckableTag } = Tag;

const NAME = "name";
const REPEAT_DAYS = "repeat_days";
const START_DATE = "start_date";
const END_DATE = "end_date";
const WHAT_NOT_TO_DO = "what_not_to_do";

const FIELDS = [NAME, START_DATE, END_DATE, WHAT_NOT_TO_DO, REPEAT_DAYS];

class DietFieldsFrom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDays: [],
    };
  }

  getParentNode = (t) => t.parentNode;

  formatMessage = (data) => this.props.intl.formatMessage(data);

  disabledStartDate = (current) => {
    return current && current <= moment().subtract({ day: 1 });
  };

  handleCheckDays = (tag, checked) => {
    const { selectedDays } = this.state;
    const nextSelectedTags = checked
      ? [...selectedDays, tag]
      : selectedDays.filter((t) => t !== tag);

    const newSelectedTags = checked
      ? [...selectedDays, tag]
      : selectedDays.filter((t) => t !== tag);

    this.setState({ selectedDays: newSelectedTags });
    const {
      form: { setFieldsValue, validateFields },
    } = this.props;
    setFieldsValue({ [REPEAT_DAYS]: newSelectedTags });
    validateFields();
  };

  setSameForAllDays = () => {
    const {
      form: { setFieldsValue, validateFields },
    } = this.props;
    this.setState({ selectedDays: DAYS });
    setFieldsValue({ [REPEAT_DAYS]: DAYS });
    validateFields();
  };

  unSetSameForAllDays = () => {
    const {
      form: { setFieldsValue, validateFields },
    } = this.props;
    this.setState({ selectedDays: [] });
    setFieldsValue({ [REPEAT_DAYS]: [] });
    validateFields();
  };

  render() {
    const {
      form: { getFieldDecorator, isFieldTouched, getFieldError, getFieldValue },
      getDietComponent,
    } = this.props;

    const { selectedDays } = this.state;

    const { formatMessage, handleCheckDays } = this;

    let fieldsError = {};
    FIELDS.forEach((value) => {
      const error = isFieldTouched(value) && getFieldError(value);
      fieldsError = { ...fieldsError, [value]: error };
    });

    return (
      <Form className="fw700 wp100 pb30 Form">
        <FormItem
          label={formatMessage(messages.name)}
          className="full-width mt10 ant-date-custom-ap-date "
        >
          {getFieldDecorator(NAME, {
            rules: [
              {
                required: true,
                message: formatMessage(messages.requiredName),
              },
            ],
          })(
            <Input
              placeholder={this.formatMessage(messages.addDietName)}
              className={"form-inputs"}
            />
          )}
        </FormItem>

        <div className="select-days-wrapper flex align-items-center justify-content-space-between wp100">
          <div className="repeats wp100">
            <div className="mb20 select-days-form-content">
              <div className="flex justify-space-between">
                <div className="flex">
                  <div className="star-red">*</div>
                  <span className="fs14">
                    {this.formatMessage(messages.dayOftheWeek)}
                  </span>
                </div>
                <div
                  className={`pointer ${
                    selectedDays.length === 7 ? "tab-color" : "null"
                  }`}
                  onClick={
                    selectedDays.length === 7
                      ? this.unSetSameForAllDays
                      : this.setSameForAllDays
                  }
                >
                  Same for all days
                </div>
              </div>
              <FormItem style={{ display: "none" }}>
                {getFieldDecorator(REPEAT_DAYS, {
                  rules: [
                    {
                      required: true,
                      message: this.formatMessage(messages.requiredRepeatDays),
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <div className="flex-shrink-1 flex justify-space-evenly select-days mt10">
                {DAYS.map((tag) => (
                  <CheckableTag
                    key={tag}
                    checked={selectedDays.indexOf(tag) > -1}
                    onChange={(checked) => handleCheckDays(tag, checked)}
                  >
                    {tag}
                  </CheckableTag>
                ))}
              </div>
            </div>
          </div>
        </div>

        {getDietComponent()}

        <div className="flex justify-space-between align-center flex-1">
          <div className="wp45">
            <FormItem
              label={formatMessage(messages.start_date)}
              className="flex-grow-1 full-width mt10 ant-date-custom-ap-date "
            >
              {getFieldDecorator(START_DATE, {
                initialValue: moment(),
                rules: [
                  {
                    required: true,
                    message: formatMessage(messages.requiredStartDate),
                  },
                ],
              })(
                <DatePicker
                  className="wp100 h53"
                  disabledDate={this.disabledStartDate}
                />
              )}
            </FormItem>
          </div>

          <div className="wp45">
            <FormItem
              label={formatMessage(messages.end_date)}
              className="flex-grow-1 full-width mt10 ant-date-custom-ap-date  "
            >
              {getFieldDecorator(
                END_DATE,
                {}
              )(
                <DatePicker
                  className="wp100 h53"
                  disabledDate={this.disabledStartDate}
                />
              )}
            </FormItem>
          </div>
        </div>
        <FormItem
          label={formatMessage(messages.what_not_to_do)}
          className="full-width mt10 ant-date-custom-ap-date  "
        >
          {getFieldDecorator(WHAT_NOT_TO_DO, {})(<TextArea className="mb20" />)}
        </FormItem>
      </Form>
    );
  }
}

export default injectIntl(DietFieldsFrom);
