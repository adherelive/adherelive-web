import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Form, Input, Tag } from "antd";
import { DAYS } from "../../../../constant";

const { Item: FormItem } = Form;
const { CheckableTag } = Tag;

const FIELD_NAME = "repeat_days";

class SelectedDays extends Component {
  constructor(props) {
    super(props);
    const { event: { data: { repeatDays = [] } = {} } = {} } = props;
    this.state = {
      selectedDays: repeatDays,
    };
  }

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

  formatMessage = (data) => this.props.intl.formatMessage(data);

  handleCheckDays = (tag, checked) => {
    const {
      form: { getFieldValue },
    } = this.props;
    const selectedDays = getFieldValue(FIELD_NAME) || [];
    const nextSelectedTags = checked
      ? [...selectedDays, tag]
      : selectedDays.filter((t) => t !== tag);
    this.setState({ selectedDays: nextSelectedTags });
    const {
      form: { setFieldsValue, validateFields },
    } = this.props;
    setFieldsValue({ [FIELD_NAME]: nextSelectedTags });
    validateFields();
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    let selectedDays = getFieldValue(FIELD_NAME) || [];
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
            initialValue: selectedDays,
          })(<Input />)}
        </FormItem>
        <div className="flex-shrink-1 flex justify-space-evenly select-days">
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
    );
  }
}

const Field = injectIntl(SelectedDays);

export default {
  field_name: FIELD_NAME,
  render: (props) => <Field {...props} />,
};
