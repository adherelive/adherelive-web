import React, { Component, Fragment } from "react";
import { Select, Form } from "antd";
import dropDownIcon from "../../../../Assets/images/material-icons-black-arrow-drop-down.svg";
import { injectIntl } from "react-intl";

const FIELD_NAME = "unit";

const DropDownIcon = <img src={dropDownIcon} alt="d" className="w24 h24" />;

const units = [
  { key: "mg", value: "mg" },
  { key: "ml", value: "ml" },
];
const { Option } = Select;
const { Item: FormItem } = Form;

class MedicationStrengthUnit extends Component {
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

  getParentNode = (t) => t.parentNode;

  getUnitOption = () => {
    return units.map((unit, index) => {
      return (
        <Option key={index} value={unit.key}>
          {unit.value}
        </Option>
      );
    });
  };

  getInitialValue = () => {
    const { purpose, event: { data = {} } = {} } = this.props;
    let initialValue = "mg";

    if (purpose) {
      initialValue = data[FIELD_NAME];
    }

    return initialValue;
  };

  render() {
    const {
      form,
      medications,
      payload: { id: medication_id } = {},
      medicationData = {},
    } = this.props;
    const {
      getFieldDecorator,
      getFieldError,
      isFieldTouched,
      //getFieldValue
    } = form;

    let { basic_info: { details: { unit } = {} } = {} } =
      medications[medication_id] || {};
    let { schedule_data: { unit: Unit = "" } = {} } = medicationData;

    if (Unit) {
      unit = Unit;
    }
    const error = isFieldTouched(FIELD_NAME) && getFieldError(FIELD_NAME);

    const { getInitialValue } = this;

    return (
      <Fragment>
        <FormItem
          className=""
          validateStatus={error ? "error" : ""}
          help={error || ""}
        >
          {getFieldDecorator(FIELD_NAME, {
            rules: [
              {
                // required: true,
                // message: "Select Strength Unit"
              },
            ],
            initialValue: unit ? unit : "mg",
          })(
            <div />
            // <Select
            //   className="wp100"
            //   placeholder=""
            //   showSearch
            //   autoComplete="off"
            //   optionFilterProp="children"
            //   // suffixIcon={DropDownIcon}
            //   filterOption={(input, option) =>
            //     option.props.children
            //       .toLowerCase()
            //       .indexOf(input.toLowerCase()) >= 0
            //   }
            //   getPopupContainer={this.getParentNode}
            // >
            //   {this.getUnitOption()}
            // </Select>
          )}
        </FormItem>
      </Fragment>
    );
    // }
  }
}

const Field = injectIntl(MedicationStrengthUnit);

export default {
  field_name: FIELD_NAME,
  render: (props) => <Field {...props} />,
};
