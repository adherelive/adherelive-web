import React, { Component, Fragment } from "react";
import { Select, Form, Radio, Icon } from "antd";
// import { MinusCircleOutlined } from "@ant-design/icons";
import { injectIntl } from "react-intl";
import dropDownIcon from "../../../../Assets/images/material-icons-black-arrow-drop-down.svg";
import messages from "../message";
import { MEDICATION_TIMING } from "../../../../constant";
// import WhenToTakeForm from "./whenToTakeSelectForm";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

// const DropDownIcon = <img src={dropDownIcon} alt="d" className="w24 h24" />;
const { Item: FormItem } = Form;
// const when = [
//   { key: "Before BreakFast", value: "Before BreakFast" },
//   { key: "After BreakFast", value: "After BreakFast" },
//   { key: "Before Lunch", value: "Before Lunch" },
//   { key: "After Lunch", value: "After Lunch" },
//   { key: "Before Dinner", value: "Before Dinner" },
//   { key: "After Dinner", value: "After Dinner" },
// ];
const { Option } = Select;

const FIELD_NAME = "when_to_take";

let key_field = 1;

class WhenToTakeMedication extends Component {
  constructor(props) {
    super(props);
    // const { medication_details } = props;
    // const { timings } = medication_details || {};
    let statusList = {};
    Object.keys(MEDICATION_TIMING).forEach((id) => {
      const { text, time } = MEDICATION_TIMING[id];
      statusList[id] = `${text} (${time})`;
    });

    let total_status = Object.keys(statusList);
    this.state = {
      count: [0],
      remaining_timing: {},
      selected_timing_overall: [],
      status: statusList,
      total_status,
    };
  }

  componentDidMount() {
    const {
      form: { validateFields },
      // medication_details: { timings = {} } = {},
    } = this.props;
    validateFields();
    this.setState({
      // count: [1],
      selected_timing: {},
    });
  }

  componentDidUpdate(prevProps) {
    const { medication_details } = this.props;
    const { medication_details: prev_medication_details } = prevProps;

   
    if (
      Object.keys(medication_details).length !==
      Object.keys(prev_medication_details).length
    ) {
      const { timings } = medication_details || {};
      this.setState({
        // count: [timings],
        remaining_timing: { ...timings },
      });
    }
  }

  componentWillUnmount() {
    const {
      form: { validateFields },
    } = this.props;
    validateFields();
  }

  formatMessage = (data) => this.props.intl.formatMessage(data);

  getParentNode = (t) => t.parentNode;

  getUpdatedList = (k) => {
    const {
      selected_timing = {},
      total_status,
      selected_timing_overall = [],
    } = this.state;

    
    let current_status = [];

    Object.keys(selected_timing).forEach((id) => {
      if (id === `${k}`) {
        current_status.push(selected_timing[id]);
      } else {
      }
    });

    // const { getFieldValue } = this.props.form;
    // const selected = getFieldValue(`${FIELD_NAME}[${k}]`) || [];

    const remaining_status = total_status.filter(
      (s) => !selected_timing_overall.includes(s)
    );

    const all_timings = [...current_status, ...remaining_status];

    let uniqueTimings = [];
    all_timings.forEach((timing) => {
      if (!uniqueTimings.includes(timing)) {
        uniqueTimings.push(timing);
      }
    });

    return uniqueTimings;
  };

  getUnitOption = (k) => {
    const {  status } = this.state;
    const { getUpdatedList } = this;
    const getList = getUpdatedList(k);

    return getList.map((id) => {
      const text = status[id];
      return (
        <Option key={`s-${k}.${id}`} value={id}>
          {text}
        </Option>
      );
    });
  };

  // onAddMoreClick = (e) => {
  //   e.preventDefault();
  //   const { medication_details: { timings } = {} } = this.props;
  //   const { count, remaining_timing, selected_timing } = this.state;
  //   if (count.length === Object.keys(timings).length) {
  //     return null;
  //   }

  //   let updatedOptions = {};
  //   Object.keys(remaining_timing).forEach((id) => {
  //     if (parseInt(id) !== selected_timing) {
  //       updatedOptions[id] = { ...timings[id] };
  //     }
  //   });

  //   this.setState({
  //     count: [...count, remaining_timing],
  //     remaining_timing: { ...updatedOptions },
  //   });
  // };

  // deleteOnClick = (e) => {
  //   e.preventDefault();
  //   const id = e.target.value;
  //   const { medication_details: { timings = {} } = {} } = this.props;
  //   const { count, remaining_timing } = this.state;
  //   const updatedCount = count.filter((id, index) => {
  //   });
  //   this.setState({
  //     // count: [...updatedCount],
  //     remaining_timing: { ...remaining_timing, [`${id}`]: timings[id] },
  //   });
  // };

  // getSelectRender = () => {
  //   const { timings, selected_timing, count } = this.state;
  //   let selectComp = [];
  //   // todo: WIP
  //   count.forEach((select_options, index) => {
  //     selectComp = Object.keys(select_options).map((id) => {
  //       const { text, time } = select_options[id] || {};
  //       const content = `${text} (${time})`;
  //       return (
  //         <Option key={`${id}-${index}-when-to-take`} value={id}>
  //           {content}
  //         </Option>
  //       );
  //     });
  //   });

  //   return selectComp;
  // };

  handleSelect = (value, select_box_id) => {
    const {  selected_timing = {} } = this.state;
    // const keys = new Set([...selected_timing_overall, value]);
    const updatedSelectTiming = {
      ...selected_timing,
      [select_box_id]: value,
    };
    this.setState(
      {
        // selected_timing_overall: [...keys],
        selected_timing: updatedSelectTiming,
      },
      () => {
      
      }
    );
  };

  handleDeselect = (value) => {
    // const { selected_timing_overall } = this.state;
    // const updateField = selected_timing_overall.filter(
    //   (field) => field !== value
    // );
    this.setState({
      // selected_timing_overall: updateField
    });
  };

  remove = (k) => {
    const { selected_timing_overall, selected_timing } = this.state;
    const { form } = this.props;
    const { getFieldValue, setFieldsValue } = form;
    const selected = getFieldValue(`${FIELD_NAME}[${k}]`) || [];

    let updatedSelectedTimings = {};
    Object.keys(selected_timing).forEach(id => {
      if (id !== `${k}`) {
        updatedSelectedTimings[id] = selected_timing[id];
      }
    });

    this.setState({
      selected_timing_overall: selected_timing_overall.filter(
        (field) => {
          return selected === field;
        }
      ),
      selected_timing: { ...updatedSelectedTimings }
    });
    const keys = getFieldValue("keys");

    setFieldsValue({
      keys: keys.filter((key) => key !== k),
    });
  };

  getInitialValue = (k) => {
    const { total_status } = this.state;
    // const value = status[k+1];
    return total_status[k];
    };

  getFormItems = () => {
    const { form } = this.props;
    const { count } = this.state;
    const {
      handleSelect,
      handleDeselect,
      getInitialValue,
      formatMessage,
    } = this;
    const {
      getFieldDecorator,
      // getFieldError,
      // isFieldTouched,
      getFieldValue,
    } = form;

    

    getFieldDecorator("keys", {
      initialValue: count.map((id, index) => id),
    });
    const keys = getFieldValue("keys");

    // const error = isFieldTouched(FIELD_NAME) && getFieldError(FIELD_NAME);
    return keys.map((k, index) => {
      return (
        <Fragment>
          {/* <FormList>
          {(fields, { add, remove }) => {
            return (
              {fields.map(fiels)}
            );
          }}
          </FormList> */}
          <div className="flex direction-row justify-space-between align-center mb24">
            <div key={`random${k}`} className="wp100">
              <FormItem
                className="flex-1 mb0"
              >
                {getFieldDecorator(`${FIELD_NAME}[${k}]`, {
                  rules: [
                    {
                      required: true,
                      message: "Select The Time",
                    },
                  ],
                  initialValue: getInitialValue(k),
                })(
                  <Select
                    className="wp100 drawer-select"
                    autoComplete="off"
                    placeholder={formatMessage(messages.select_timing)}
                    onSelect={(value) => handleSelect(value, k)}
                    onDeselect={handleDeselect}
                    suffixIcon={null}
                  >
                    {this.getUnitOption(k)}
                  </Select>
                )}
              </FormItem>
            </div>
            {keys.length > 1 && (
              <div className="wp20 hp100 flex justify-center align-center">
                {/* <Tooltip mouseEnterDelay={0.5} placement="bottom" title={formatMessage(messages.delete_text)}> */}
                <Icon
                  className="hp100"
                  type="minus-circle-o"
                  onClick={() => this.remove(k)}
                />
                {/* </Tooltip> */}
              </div>
            )}
          </div>
        </Fragment>
      );
    });
  };

  add = () => {
    const { form } = this.props;
    const { selected_timing } = this.state;
    const keys = form.getFieldValue("keys");
    let whenToTakeValues = {};
    keys.forEach(id => {
      whenToTakeValues[id] = form.getFieldValue(`${FIELD_NAME}[${id}]`);
    });
    const nextKeys = keys.concat(key_field);
    form.setFieldsValue({
      keys: nextKeys,
      // [`Fields[${id_checklist_field}]`]: null,
      // [`Status[${id_checklist_field}]`]: null
    });

    const updatedSelectedTimings = { ...selected_timing, ...whenToTakeValues };

    key_field++;
    this.setState({
      selected_timing_overall: Object.keys(updatedSelectedTimings).map(
        (id) => updatedSelectedTimings[id]
      ),
      selected_timing: updatedSelectedTimings
    });
  };

  render() {
    const { form } = this.props;
    const {
      getFormItems,
      formatMessage,
    } = this;
    const {
      isFieldTouched,
      getFieldError,
      //getFieldValue
    } = form;
    // const error = isFieldTouched(FIELD_NAME) && getFieldError(FIELD_NAME);


    // const { getInitialValue } = this;

    return (
      <Fragment>
        <div className="flex align-items-end justify-content-space-between">
          <div className='flex row flex-grow-1'>
            <label
              htmlFor="quantity"
              className="form-label "
              title="Quantity"
            >
              {formatMessage(messages.timing)}
            </label>

            <div className="star-red">*</div>
          </div>
          {/* <div className="label-color fontsize12 mb8">
              
            </div> */}
          <div className="flex-grow-0">
            <RadioGroup size="small" className="flex justify-content-end">
              <RadioButton value={1} onClick={this.add}>
                {formatMessage(messages.add_more_text)}
              </RadioButton>
            </RadioGroup>
          </div>
        </div>

        {getFormItems()}
      </Fragment>
    );
    // }
  }
}

const Field = injectIntl(WhenToTakeMedication);

export default {
  fieLd_name: FIELD_NAME,
  render: (props) => <Field {...props} />,
};
