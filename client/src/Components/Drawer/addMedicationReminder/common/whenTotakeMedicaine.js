import React, { Component, Fragment } from "react";
import { Select, Form } from "antd";
import { injectIntl } from "react-intl";
import dropDownIcon from "../../../../Assets/images/material-icons-black-arrow-drop-down.svg";

const DropDownIcon = <img src={dropDownIcon} alt="d" className="w24 h24" />;
const { Item: FormItem } = Form;
const when = [
  { key: "Before BreakFast", value: "Before BreakFast" },
  { key: "After BreakFast", value: "After BreakFast" },
  { key: "Before Lunch", value: "Before Lunch" },
  { key: "After Lunch", value: "After Lunch" },
  { key: "Before Dinner", value: "Before Dinner" },
  { key: "After Dinner", value: "After Dinner" }
];
const { Option } = Select;

const FIELD_NAME = "when_to_take";

class WhenToTakeMedication extends Component {
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

  getParentNode = t => t.parentNode;

  getUnitOption = () => {
    return when.map((unit, index) => {
      return (
        <Option key={index} value={unit.key}>
          {unit.value}
        </Option>
      );
    });
  };

  getInitialValue = () => {
    const { purpose, event: { data = {} } = {} } = this.props;
    let initialValue = "Before BreakFast";
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
      isFieldTouched
      //getFieldValue
    } = form;
    // console.log("act,", activityType, activityModeOption, activityMode);
    const error = isFieldTouched(FIELD_NAME) && getFieldError(FIELD_NAME);

    const { getInitialValue } = this;

    return (
      <Fragment>
        <FormItem
          className="flex-1 align-self-end"
          validateStatus={error ? "error" : ""}
        >
          {getFieldDecorator(FIELD_NAME, {
            rules: [
              {
                required: true,
                message: "Select The Time"
              }
            ],
            initialValue: getInitialValue()
          })(
            <Select
              className="full-width"
              placeholder=""
              showSearch
              autoComplete="off"
              optionFilterProp="children"
              suffixIcon={DropDownIcon}
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              getPopupContainer={this.getParentNode}
            >
              {this.getUnitOption()}
            </Select>
          )}
        </FormItem>
      </Fragment>
    );
    // }
  }
}

const Field = injectIntl(WhenToTakeMedication);

export default {
  fieLd_name: FIELD_NAME,
  render: props => <Field {...props} />
};
