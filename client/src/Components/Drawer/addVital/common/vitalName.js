import React, { Component } from "react";
import { injectIntl } from "react-intl";

import throttle from "lodash-es/throttle";

import Form from "antd/es/form";
import Select from "antd/es/select";
import Spin from "antd/es/spin";
import message from "antd/es/message";

const { Item: FormItem } = Form;
const { Option } = Select;

const FIELD_NAME = "vital_template_id";

class VitalName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vitals: {},
      fetchingVitals: false,
    };

    this.handleVitalSearch = throttle(this.handleVitalSearch.bind(this), 2000);
  }

  getVitalsOption = () => {
    const { vital_templates = {} } = this.props;
    // let medicationStagesOption = [];
    return Object.keys(vital_templates).map((id) => {
      const { basic_info: { name } = {} } = vital_templates[id] || {};
      return (
        <Option key={id} value={id}>
          {name}
        </Option>
      );
    });
  };

  getParentNode = (t) => t.parentNode;

  async handleVitalSearch(data) {
    try {
      // if (data) {
      const { searchVital } = this.props;
      this.setState({ fetchingVitals: true });
      const response = await searchVital(data);
      const { status, payload: { data: responseData, message } = {} } =
        response;
      if (status) {
        this.setState({ fetchingVitals: false });
      } else {
        this.setState({ fetchingVitals: false });
      }
      // } else {
      //   this.setState({ fetchingVitals: false });
      // }
    } catch (err) {
      console.log("err", err);
      message.warn("Something wen't wrong. Please try again later");
      this.setState({ fetchingVitals: false });
    }
  }

  handleVitals = () => {
    const { searchVital } = this.props;
    searchVital("");
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldError, isFieldTouched },
      setFormulation,
    } = this.props;

    const { fetchingVitals } = this.state;

    const { getVitalsOption, getParentNode, handleVitalSearch, handleVitals } =
      this;

    return (
      <FormItem>
        {getFieldDecorator(FIELD_NAME, {
          // rules: [
          //   {
          //     required: true,
          //     message: "Select a vital"
          //   }
          // ]
        })(
          <Select
            onFocus={handleVitals}
            onSearch={handleVitalSearch}
            notFoundContent={
              fetchingVitals ? <Spin size="small" /> : "No match found"
            }
            className="drawer-select"
            placeholder="Select Vital"
            showSearch
            defaultActiveFirstOption={true}
            autoComplete="off"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            getPopupContainer={getParentNode}
          >
            {getVitalsOption()}
          </Select>
        )}
      </FormItem>
    );
  }
}

const Field = injectIntl(VitalName);

export default {
  field_name: FIELD_NAME,
  render: (props) => <Field {...props} />,
};
