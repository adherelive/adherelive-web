import React, { Component, Fragment } from "react";
import { Select, Form } from "antd";
import { injectIntl } from "react-intl";
import { MEDICINE_UNITS, MEDICINE_TYPE } from "../../../../constant";
// import chooseMedicationField from "./medicationStage";
import chooseMedicationField from "./medicine";

const FIELD_NAME = "unit";

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
    const {
      purpose,
      event: { data = {} } = {},
      form: { getFieldValue },
      medicines,
    } = this.props;
    let medicine = getFieldValue(chooseMedicationField.field_name);
    let { basic_info: { type: medType = "" } = {} } = medicines[medicine] || {};

    let initialValue = MEDICINE_UNITS.MG;

    if (medType === MEDICINE_TYPE.INJECTION) {
      initialValue = MEDICINE_UNITS.ML;
    }

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
      isFieldTouched,
      //getFieldValue
    } = form;
    const error = isFieldTouched(FIELD_NAME) && getFieldError(FIELD_NAME);

    const { getInitialValue } = this;

    return (
      <Fragment>
        <FormItem validateStatus={error ? "error" : ""} help={error || ""}>
          {getFieldDecorator(FIELD_NAME, {
            rules: [
              {
                required: true,
                message: "Select Strength Unit",
              },
            ],
            initialValue: getInitialValue(),
          })(
            <div></div>
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
