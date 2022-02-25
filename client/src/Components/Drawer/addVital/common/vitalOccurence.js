import React, { Component } from "react";
import { injectIntl } from "react-intl";

import throttle from "lodash-es/throttle";

import Form from "antd/es/form";
import Select from "antd/es/select";
import Spin from "antd/es/spin";
import message from "antd/es/message";

const { Item: FormItem } = Form;
const { Option } = Select;

const FIELD_NAME = "repeat_interval_id";

class VitalOccurence extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vitals: {},
      fetchingVitals: false,
    };
  }

  componentDidMount() {
    this.getStagesOption();
  }

  getStagesOption = () => {
    if (!this.state.fetchingVitals) {
      const { getVitalOccurence } = this.props;
      getVitalOccurence().then((res) => {
        const { status = false } = res;
        if (status) {
          this.setState({ fetchingVitals: true });
        }
      });
    } else {
    }
  };

  getParentNode = (t) => t.parentNode;

  render() {
    const {
      form: { getFieldDecorator, getFieldError, isFieldTouched },
      repeat_intervals,
    } = this.props;

    const { fetchingVitals } = this.state;

    const { getStagesOption, getParentNode, handleVitalSearch } = this;

    const options = Object.keys(repeat_intervals).map((id) => {
      const { text = "" } = repeat_intervals[id] || {};
      return (
        <Option key={id} value={id}>
          {text}
        </Option>
      );
    });

    // if (!program_has_medication_stage || (!!purpose && !!!getInitialValue())) {
    //   return null;
    // }

    // const error = isFieldTouched(FIELD_NAME) && getFieldError(FIELD_NAME);

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
            notFoundContent={
              !fetchingVitals ? <Spin size="small" /> : "No match found"
            }
            className="drawer-select"
            placeholder="Select Occurence"
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
            {options}
          </Select>
        )}
      </FormItem>
    );
  }
}

const Field = injectIntl(VitalOccurence);

export default {
  field_name: FIELD_NAME,
  render: (props) => <Field {...props} />,
};
