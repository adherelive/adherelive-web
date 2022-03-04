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

  componentDidMount() {
    this.handleVitalSearch("");
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
      if (data) {
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
      } else {
        this.setState({ fetchingVitals: false });
      }
    } catch (err) {
      console.log("err", err);
      message.warn("Something wen't wrong. Please try again later");
      this.setState({ fetchingVitals: false });
    }
  }

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

  handleVitalChange = (id) => {
    const { form: { setFieldsValue, getFieldValue } = {}, enableSubmit } =
      this.props;

    const temp_id = parseInt(id);
    setFieldsValue({ [FIELD_NAME]: temp_id });
    enableSubmit();
  };

  render() {
    const {
      form: {
        getFieldDecorator,
        setFieldsValue,
        getFieldError,
        isFieldTouched,
      },
      setFormulation,
      payload: { id: vital_id, canViewDetails = false } = {},
      vitals,
      vital_templates,
    } = this.props;
    const { basic_info: { vital_template_id } = {} } = vitals[vital_id] || {};

    const { fetchingVitals } = this.state;

    const {
      getVitalsOption,
      handleVitalChange,
      getParentNode,
      handleVitalSearch,
      handleVitals,
    } = this;

    // if (!program_has_medication_stage || (!!purpose && !!!getInitialValue())) {
    //   return null;
    // }

    const { basic_info: { name = "" } = {} } =
      vital_templates[vital_template_id] || {};
    const { vitalData = {} } = this.props;
    const { vital_template_id: existing_vital_template_id = "" } =
      vitalData || {};

    return (
      <FormItem>
        {getFieldDecorator(FIELD_NAME, {
          initialValue: existing_vital_template_id
            ? existing_vital_template_id.toString()
            : name,
        })(
          <Select
            onFocus={vitalData ? handleVitals : null}
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
            onChange={vitalData ? handleVitalChange : null}
            getPopupContainer={getParentNode}
            disabled={
              canViewDetails || (!canViewDetails && vitalData ? false : true)
            }
          >
            {vitalData ? getVitalsOption() : null}
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
