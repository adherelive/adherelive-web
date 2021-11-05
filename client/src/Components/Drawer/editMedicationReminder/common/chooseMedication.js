import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Select, Form } from "antd";
import dropDownIcon from "../../../../Assets/images/material-icons-black-arrow-drop-down.svg";

import { USER_CATEGORY } from "../../../../constant";

const DropDownIcon = <img src={dropDownIcon} alt="d" className="w24 h24" />;

const FIELD_NAME = "medicine";
const { Item: FormItem } = Form;
const { Option } = Select;

class ChooseMedication extends Component {
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

  getMedicationOption = () => {
    const {
      products = {},
      programs = {},
      otherUser: {
        programId: otherUserProgramId = [],
        basicInfo: { category: otherUserCategory } = {},
      } = {},
      currentUser: {
        programId: currentUserProgramId = [],
        basicInfo: { category: currentUserCategory } = {},
      } = {},
    } = this.props;

    let programId;

    if (currentUserCategory === USER_CATEGORY.PATIENT) {
      programId = currentUserProgramId[0];
    } else if (otherUserCategory === USER_CATEGORY.PATIENT) {
      programId = otherUserProgramId[0];
    }

    let options = [];

    if (programId) {
      const { products: productIds = [] } = programs[programId] || {};
      productIds.forEach((productId) => {
        const { name, _id } = products[productId] || {};
        if (_id) {
          options.push(
            <Option key={_id} value={_id}>
              {name}
            </Option>
          );
        }
      });
    }
    return options;
  };

  getParentNode = (t) => t.parentNode;

  getInitialValue = () => {
    const { purpose, event: { data = {} } = {} } = this.props;
    let initialValue;
    if (purpose) {
      initialValue = data[FIELD_NAME];
    }
    return initialValue;
  };

  render() {
    const { form, purpose, medicationData } = this.props;
    const {
      getFieldDecorator,
      getFieldError,
      isFieldTouched,
      //getFieldValue
    } = form;
    const error = isFieldTouched(FIELD_NAME) && getFieldError(FIELD_NAME);

    const { medicine_id = "" } = medicationData || {};
    const { getMedicationOption, getInitialValue } = this;

    return (
      <Fragment>
        <FormItem
          label="Medication"
          className="flex-1 align-self-end"
          validateStatus={error ? "error" : ""}
          help={error || ""}
        >
          {getFieldDecorator(FIELD_NAME, {
            rules: [
              {
                required: true,
                message: "Select a Medicine",
              },
            ],
            initialValue: medicine_id ? medicine_id : getInitialValue(),
          })(
            <Select
              className="full-width"
              placeholder="Choose Medication"
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
              getPopupContainer={this.getParentNode}
            >
              {getMedicationOption()}
            </Select>
          )}
        </FormItem>
      </Fragment>
    );
    // }
  }
}

const Field = injectIntl(ChooseMedication);

export default {
  field_name: FIELD_NAME,
  render: (props) => <Field {...props} />,
};
