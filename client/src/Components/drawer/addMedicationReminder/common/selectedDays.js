import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Form, Input, Tag } from "antd";
import messages from "../message";
import { DAYS } from "../../../../constant";

const { Item: FormItem } = Form;
const { CheckableTag } = Tag;

const FIELD_NAME = "repeatDays";

class SelectedDays extends Component {
  constructor(props) {
    super(props);
    const { event: { data: { repeatDays = [] } = {} } = {} } = this.props;
    this.state = {
      selectedDays: repeatDays
    };
  }

  componentDidMount() {
    const {
      form: { validateFields }
    } = this.props;
    validateFields();
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
      form: { getFieldDecorator }
    } = this.props;

    const { selectedDays } = this.state;
    const { handleCheckDays, formatMessage } = this;

    return (
      <div className="mb20">
        <div className="mb8">
          <span className="form-label">
            Repeats
          </span>
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
        <div className="flex select-days">
          {DAYS.map(tag => (
            <CheckableTag
              className="flex-1"
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
