import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Form, Select } from "antd";

import dropDownIcon from "../../../../Assets/images/material-icons-black-arrow-drop-down.svg";
import { REPEAT_OPTION, REPEAT_TYPE } from "../../../../constant";

const DropDownIcon = <img src={dropDownIcon} alt="d" className="w24 h24" />;

const FIELD_NAME = "repeat";
const { Item: FormItem } = Form;
const { Option } = Select;

class RepeatType extends Component {
  getParentNode = (t) => t.parentNode;

  formatMessage = (data) => this.props.intl.formatMessage(data);

  getRepeatOption = () => {
    return REPEAT_OPTION.map((value, index) => {
      return (
        <Option key={index} value={value.key}>
          {value.label}
        </Option>
      );
    });
  };

  getInitialValue = () => {
    const { purpose, series, event } = this.props;
    if (purpose && series) {
      const { data: { repeat } = {} } = event;
      return repeat;
    }
    return REPEAT_TYPE.NONE;
  };

  render() {
    const {
      form: { getFieldDecorator },
      adjustEndDate,
      purpose,
      series,
    } = this.props;
    const { getParentNode, getRepeatOption, getInitialValue } = this;

    return (
      <FormItem
        className="flex-1 align-self-end"
        style={{ display: series === false ? "none" : "" }}
      >
        {getFieldDecorator(FIELD_NAME, {
          initialValue: getInitialValue(),
        })(
          <Select
            className="full-width"
            placeholder=""
            showSearch
            disabled={!!purpose && !series}
            autoComplete="off"
            optionFilterProp="children"
            suffixIcon={DropDownIcon}
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            getPopupContainer={getParentNode}
            onBlur={adjustEndDate}
          >
            {getRepeatOption()}
          </Select>
        )}
      </FormItem>
    );
  }
}

const Field = injectIntl(RepeatType);

export default {
  field_name: FIELD_NAME,
  render: (props) => <Field {...props} />,
};
