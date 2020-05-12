import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Form, Select } from "antd";

import dropDownIcon from "../../../../Assets/images/material-icons-black-arrow-drop-down.svg";

const { Item: FormItem } = Form;
const { Option } = Select;

const FIELD_NAME = "medication_stage";
const DEFAULT = "DEFAULT";

const DropDownIcon = <img src={dropDownIcon} alt="d" className="w24 h24" />;

class MedicationStage extends Component {
  getStagesOption = () => {
    const { medicationStages = [] } = this.props;
    let medicationStagesOption = [];

    medicationStagesOption = medicationStages.map(stage => {
      const { id, name } = stage;
      return (
        <Option key={id} value={id}>
          {name}
        </Option>
      );
    });
    medicationStagesOption.push(
      <Option key={DEFAULT} value={DEFAULT}>
        {"Default"}
      </Option>
    );

    return medicationStagesOption;
  };

  getInitialValue = () => {
    const { purpose, event: { data = {} } = {} } = this.props;
    let initialValue;
    if (purpose) {
      initialValue = data[FIELD_NAME];
    }
    return initialValue;
  };

  getParentNode = t => t.parentNode;

  render() {
    const {
      form: { getFieldDecorator, getFieldError, isFieldTouched },
      program_has_medication_stage,
      purpose
    } = this.props;

    const { getStagesOption, getInitialValue, getParentNode } = this;

    // if (!program_has_medication_stage || (!!purpose && !!!getInitialValue())) {
    //   return null;
    // }

    const error = isFieldTouched(FIELD_NAME) && getFieldError(FIELD_NAME);

    return (
      <FormItem validateStatus={error ? "error" : ""} help={error || ""}>
        {getFieldDecorator(FIELD_NAME, {
          rules: [
            {
              required: true,
              message: "Choose Medicine"
            }
          ],
          initialValue: getInitialValue()
        })(
          <Select
            className=""
            placeholder="Choose Medicine"
            disabled={!!purpose}
            showSearch
            autoComplete="off"
            optionFilterProp="children"
            suffixIcon={DropDownIcon}
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            getPopupContainer={getParentNode}
          >
            {getStagesOption()}
          </Select>
        )}
      </FormItem>
    );
  }
}

const Field = injectIntl(MedicationStage);

export default {
  field_name: FIELD_NAME,
  render: props => <Field {...props} />
};
