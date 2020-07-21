import React, { Component } from "react";
import { injectIntl } from "react-intl";

import throttle from "lodash-es/throttle";

import Form from "antd/es/form";
import Select from "antd/es/select";
import Spin from "antd/es/spin";
import message from "antd/es/message";

import dropDownIcon from "../../../../Assets/images/material-icons-black-arrow-drop-down.svg";

const { Item: FormItem } = Form;
const { Option } = Select;

const FIELD_NAME = "medicine_id";
const DEFAULT = "DEFAULT";

const DropDownIcon = <img src={dropDownIcon} alt="d" className="w24 h24" />;

class MedicationStage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      medicines: {},
      fetchingMedicines: false
    };

    this.handleMedicineSearch = throttle(this.handleMedicineSearch.bind(this), 2000);
  }

  getStagesOption = () => {
    const { medicines = {} } = this.props;
    let medicationStagesOption = [];

    return Object.keys(medicines).map(id => {
      const { basic_info: { name, type } = {} } = medicines[id] || {};
      return (
        <Option key={id} value={id}>
          {name}
        </Option>
      );
    });

    // medicationStagesOption = medicationStages.map(stage => {
    //   const { id, name } = stage;
    //   return (
    //     <Option key={id} value={id}>
    //       {name}
    //     </Option>
    //   );
    // });
    // medicationStagesOption.push(
    //   <Option key={DEFAULT} value={DEFAULT}>
    //     {"Default"}
    //   </Option>
    // );

    // return medicationStagesOption;
  };

  // getInitialValue = () => {
  //   const { purpose, event: { data = {} } = {} } = this.props;
  //   let initialValue;
  //   if (purpose) {
  //     initialValue = data[FIELD_NAME];
  //   }
  //   return initialValue;
  // };

  getParentNode = t => t.parentNode;

  async handleMedicineSearch(data) {
    try {
      console.log("1892379263 data --> ", data);
      if (data) {
        const { searchMedicine } = this.props;
        this.setState({ fetchingMedicines: true });
        const response = await searchMedicine(data);
        const { status, payload: { data: responseData, message } = {} } = response;
        if (status) {
          // const { medicines = {} } = responseData;
          // const medicineList = {};
          // Object.keys(medicines).forEach(id => {
          //   medicineList[id] = medicines[id];
          // });
          // this.setState({ medicines: medicineList, fetchingMedicines: false });
          this.setState({ fetchingMedicines: false });
        } else {
          this.setState({ fetchingMedicines: false });
        }
      } else {
        this.setState({ fetchingMedicines: false });
      }
    } catch (err) {
      console.log("err", err);
      message.warn("Something wen't wrong. Please try again later");
      this.setState({ fetchingMedicines: false });
    }
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldError, isFieldTouched },
      program_has_medication_stage,
      purpose
    } = this.props;

    const { fetchingMedicines } = this.state;

    const { getStagesOption, getInitialValue, getParentNode, handleMedicineSearch } = this;

    // if (!program_has_medication_stage || (!!purpose && !!!getInitialValue())) {
    //   return null;
    // }

    console.log("827312 field name --> ", FIELD_NAME);

    const error = isFieldTouched(FIELD_NAME) && getFieldError(FIELD_NAME);

    return (
      <FormItem>
        {getFieldDecorator(FIELD_NAME, {
          // rules: [
          //   {
          //     required: true,
          //     message: "Select a medicine"
          //   }
          // ]
        })(
          <Select
            onSearch={handleMedicineSearch}
            notFoundContent={fetchingMedicines ? <Spin size="small" /> : 'No match'}
            className="drawer-select"
            placeholder="Choose Medicine"
            showSearch

            defaultActiveFirstOption={true}
            // onFocus={() => handleMedicineSearch("")}
            autoComplete="off"
            // onFocus={() => handleMedicineSearch("")}
            optionFilterProp="children"
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
