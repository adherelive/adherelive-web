import React, { Component } from "react";
import { Select, Form } from "antd";
import { injectIntl } from "react-intl";
import { MEDICINE_UNITS } from "../../../../constant";
import messages from "../message";

import unitField from "./medicationStrengthUnit";

const FIELD_NAME = "formulation";

const { Option, OptGroup } = Select;
const { Item: FormItem } = Form;

class Formulation extends Component {
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

  formatMessage = (data) => this.props.intl.formatMessage(data);

  setUnitMg = () => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ [unitField.field_name]: MEDICINE_UNITS.MG });
  };

  setUnitMl = () => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ [unitField.field_name]: MEDICINE_UNITS.ML });
  };

  getStringFormat = (str) => {
    return str
      ? `${str.charAt(0).toUpperCase()}${str.substring(1, str.length)}`
      : "";
  };

  getOptions = (items, category) => {
    const { getStringFormat } = this;

    return items.map((item) => {
      const { name, defaultUnit, id } = item || {};
      // console.log("825345234623546423748",{id,type:typeof(id)})

      const strId = id.toString();
      return (
        <Option
          key={`${category}:${defaultUnit}:${name}`}
          value={strId}
          title={name}
        >
          {getStringFormat(name)}
        </Option>
      );
    });
  };

  getFormulationOptions = () => {
    const { medication_details: { medicine_type } = {} } = this.props;
    const { getOptions, getStringFormat } = this;

    return Object.keys(medicine_type).map((id) => {
      const { items, name } = medicine_type[id] || {};

      return (
        <OptGroup label={getStringFormat(name)}>
          {getOptions(items, id)}
        </OptGroup>
      );
    });
  };

  handleSelect = (...args) => {
    const { setUnitMg, setUnitMl } = this;
    const { key = "" } = args[1] || {};

    const formulationUnit = key ? key.split(":")[1] : null;

    switch (formulationUnit) {
      case MEDICINE_UNITS.MG:
        setUnitMg();
        break;
      case MEDICINE_UNITS.ML:
        setUnitMl();
        break;
      default:
        break;
    }
  };

  render() {
    const {
      form,
      payload: { id: medication_id, canViewDetails = false } = {},
      medications,
      medicationData = {},
    } = this.props;
    const { getFormulationOptions, handleSelect } = this;

    const { getFieldDecorator, getFieldError, isFieldTouched } = form;
    const error = isFieldTouched(FIELD_NAME) && getFieldError(FIELD_NAME);
    let { basic_info: { details: { medicine_type = "" } = {} } = {} } =
      medications[medication_id] || {};
    const { schedule_data: { medicine_type: medType = "" } = {} } =
      medicationData;

    if (medType) {
      medicine_type = medType;
    }

    return (
      <div className="mb20 select-days-form-content">
        <div className="flex row">
          <span className="form-label">
            {this.formatMessage(messages.formulation)}
          </span>
          <div className="star-red">*</div>
        </div>
        <FormItem validateStatus={error ? "error" : ""} help={error || ""}>
          {getFieldDecorator(FIELD_NAME, {
            initialValue: medicine_type,
          })(
            <Select
              className="full-width"
              placeholder=""
              showSearch
              autoComplete="off"
              optionFilterProp="children"
              suffixIcon={null}
              // filterOption={(input, option) =>
              //   option.props.children
              //     .toLowerCase()
              //     .indexOf(input.toLowerCase()) >= 0
              // }
              getPopupContainer={this.getParentNode}
              onSelect={handleSelect}
              disabled={canViewDetails}
            >
              {getFormulationOptions()}
            </Select>
          )}
        </FormItem>
      </div>
    );
  }
}

const Field = injectIntl(Formulation);

export default {
  field_name: FIELD_NAME,
  render: (props) => <Field {...props} />,
};
