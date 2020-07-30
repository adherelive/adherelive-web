import React, { Component } from "react";
import { injectIntl } from "react-intl";

import throttle from "lodash-es/throttle";

import Form from "antd/es/form";
import Select from "antd/es/select";
import Spin from "antd/es/spin";
import message from "antd/es/message";


const { Item: FormItem } = Form;
const { Option } = Select;

const FIELD_NAME = "medicine_id";
class MedicationStage extends Component {
  constructor(props) {
    super(props);
    const { medicines } = props;
    this.state = {
      medicines,
      fetchingMedicines: false
    };

    this.handleMedicineSearch = throttle(this.handleMedicineSearch.bind(this), 1000);
  }

  componentDidMount() {
  }

  getStagesOption = () => {
    const { medications, payload: { id: medication_id } = {} } = this.props;
    let medicationStagesOption = [];
    const { medicines } = this.props;

    // const { basic_info: { details: { medicine_id } = {} } = {} } = medications[medication_id] || {};

    console.log("918239813 medicines --> ", medicines);

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
      const { searchMedicine } = this.props;
      this.setState({ fetchingMedicines: true });
      const response = await searchMedicine(data);
      const{status}=response;
      if (status) {
        this.setState({ fetchingMedicines: false });
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
      medications,
      medicationData,
      payload: { id: medication_id } = {},
    } = this.props;

    let { basic_info: { details: { medicine_id } = {} } = {} } = medications[medication_id] || {};


    const { medicine_id: medicineId = '' } = medicationData || {};
    if (medicineId) {
      medicine_id = medicineId.toString();
    }
    console.log("2387128371923 medicine_id --> ", medicine_id, typeof (medication_id));

    const { fetchingMedicines } = this.state;

    const { getStagesOption, getInitialValue, getParentNode, handleMedicineSearch } = this;

    // if (!program_has_medication_stage || (!!purpose && !!!getInitialValue())) {
    //   return null;
    // }

    const error = isFieldTouched(FIELD_NAME) && getFieldError(FIELD_NAME);

    return (
      <FormItem>
        {getFieldDecorator(FIELD_NAME, {
          initialValue: medicine_id ? medicine_id.toString() : null
        })(
          <Select
            onSearch={handleMedicineSearch}
            notFoundContent={fetchingMedicines ? <Spin size="small" /> : 'No match found'}
            className="drawer-select"
            placeholder="Choose Medicine"
            showSearch
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
