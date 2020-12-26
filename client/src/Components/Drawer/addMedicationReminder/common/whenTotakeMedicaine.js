import React, { Component, Fragment } from "react";
import { Select, Form, Radio, Icon } from "antd";
// import { MinusCircleOutlined } from "@ant-design/icons";
import { injectIntl } from "react-intl";
import dropDownIcon from "../../../../Assets/images/material-icons-black-arrow-drop-down.svg";
import messages from "../message";
// import WhenToTakeForm from "./whenToTakeSelectForm";
import moment from "moment";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

// const DropDownIcon = <img src={dropDownIcon} alt="d" className="w24 h24" />;
const { Item: FormItem } = Form;

const AFTER_WAKEUP="1";
const BEFORE_BREAKFAST = "2";
const AFTER_BREAKFAST = "3";
const BEFORE_LUNCH = "4";
const AFTER_LUNCH = "5";
const BEFORE_EVENING_TEA = "6";
const AFTER_EVENING_TEA = "7";
const BEFORE_DINNER = "8";
const AFTER_DINNER = "9";
const BEFORE_SLEEP = "10";

const BEFORE_MEALS_ARRAY_OD = [BEFORE_BREAKFAST];
const AFTER_MEALS_ARRAY_OD = [AFTER_BREAKFAST];
const BEFORE_MEALS_ARRAY_BD = [BEFORE_BREAKFAST,BEFORE_LUNCH];
const AFTER_MEALS_ARRAY_BD = [AFTER_BREAKFAST,AFTER_LUNCH];
const BEFORE_MEALS_ARRAY_TDS = [BEFORE_BREAKFAST,BEFORE_LUNCH,BEFORE_DINNER];
const AFTER_MEALS_ARRAY_TDS = [AFTER_BREAKFAST,AFTER_LUNCH,AFTER_DINNER];

const { Option } = Select;

const FIELD_NAME = "when_to_take";

let key_field = 1;

class WhenToTakeMedication extends Component {
  constructor(props) {
    super(props);
    const { medication_details = {}} = props;
    const { timings = {} } = medication_details || {};
    let statusList = {};
    Object.keys(timings).forEach((id) => {
      const { text, time } = timings[id];
      statusList[id] = `${text} (${moment(time).format("hh:mm A")})`;
    });

    let total_status = Object.keys(statusList);
    this.state = {
      count: [0],
      remaining_timing: {},
      selected_timing_overall: [],
      status: statusList,
      total_status,
      nugget_selected:null
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

  componentDidUpdate(prevProps,prevState) {
    const { medication_details } = this.props;
    const { medication_details: prev_medication_details } = prevProps;
    const { form } = this.props;
    const { getFieldValue, setFieldsValue } = form;
    

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

    const keys = getFieldValue("keys") || [];
    const {nugget_selected} = this.state;


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
    const { status } = this.state;
    const { getUpdatedList } = this;
    // const  getList = getUpdatedList(k);
    const { medication_details ={}} = this.props;
    const { timings = {}} = medication_details || {};
    let getList =[];
    Object.keys(timings).forEach((id) => {
      getList.push(id);
    });

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

    const { form } = this.props;
    const { getFieldValue, setFieldsValue } = form;
    const { selected_timing = {}  } = this.state;
    // const keys = new Set([...selected_timing_overall, value]);
    
    const updatedSelectTiming = {
      ...selected_timing,
      [select_box_id]: value,
    };
    this.setState({
        selected_timing: updatedSelectTiming,
      });

      this.handleRadioButtonChange();
     
  };


  handleRadioButtonChange = () => {

    const { form } = this.props;
    const {nugget_selected} = this.state;
    const { getFieldValue, setFieldsValue } = form;
    const keys = getFieldValue("keys");
    let check = [];

    if(nugget_selected === 1){
      if(keys.length === 1){check = BEFORE_MEALS_ARRAY_OD}
      else if(keys.length === 2){check = BEFORE_MEALS_ARRAY_BD}
      else if(keys.length === 3){check = BEFORE_MEALS_ARRAY_TDS}
    }else if(nugget_selected === 2){
      if(keys.length === 1){check = AFTER_MEALS_ARRAY_OD}
      else if(keys.length === 2){check = AFTER_MEALS_ARRAY_BD}
      else if(keys.length === 3){check = AFTER_MEALS_ARRAY_TDS}
    }

    let flag =true;

    const seletedValues = Object.values(getFieldValue([FIELD_NAME]))[0];
    seletedValues.forEach(eachVal => {
      if(!check.includes(eachVal)){
        flag = false;
      }   
    });

    if(flag === false){
      this.setState({nugget_selected:null})
    }
  }

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
    const { total_status,nugget_selected } = this.state;
    // return total_status[k];
    return k;
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
      setFieldsValue
    } = form;

    const {nugget_selected} = this.state;



    getFieldDecorator("keys", {
      initialValue: count.map((id, index) => id),
    });
    let keys = getFieldValue("keys");
    let initialValuesArray ;
    // const error = isFieldTouched(FIELD_NAME) && getFieldError(FIELD_NAME);

    
    if(keys.length === 1){
      keys = [0]
      initialValuesArray= AFTER_MEALS_ARRAY_OD;
    }
    else if(keys.length === 2){
      keys = [0,1]
      initialValuesArray= AFTER_MEALS_ARRAY_BD;
    }
    else if(keys.length === 3){
      keys = [0,1,2]
      initialValuesArray= AFTER_MEALS_ARRAY_TDS;
    }


    
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
                {

                getFieldDecorator(`${FIELD_NAME}[${k}]`, {
                  rules: [
                    {
                      required: true,
                      message: "Select The Time",
                    },
                  ],
                  initialValue: getInitialValue(initialValuesArray[k])
                  
                })

                (
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
            {/* {keys.length > 1 && (
              <div className="wp20 hp100 flex justify-center align-center">
                <Icon
                  className="hp100"
                  type="minus-circle-o"
                  onClick={() => this.remove(k)}
                />
              </div>
            )} */}
          </div>
        </Fragment>
      );
    });
  };

  onClickOd = () => {

    const { form } = this.props;
    const {
      setFieldsValue
    } = form;

    const { selected_timing } = this.state;
    const keys = form.getFieldValue("keys");
    if (keys.length === 3) {
      this.remove(keys[2]);
      this.remove(keys[1]);
    } else if (keys.length === 2) {
      this.remove(keys[1]);
    }

    this.setState({nugget_selected:null});
    setFieldsValue({
      keys:[0]
    });
    setFieldsValue({[FIELD_NAME]:AFTER_MEALS_ARRAY_OD});

  }
  onClickBd = () => {

    const { form } = this.props;
    const {
      setFieldsValue
    } = form;

    const { selected_timing } = this.state;
    const keys = form.getFieldValue("keys");
    if (keys.length === 3) {
      this.remove(keys[2]);
    } else if (keys.length === 1) {
      this.add();
    }
    this.setState({nugget_selected:null});
    setFieldsValue({
      keys:[0,1]
    });
    setFieldsValue({[FIELD_NAME]:AFTER_MEALS_ARRAY_BD});
  }

  onClickTds = () => {

    const { form } = this.props;
    const {
      setFieldsValue
    } = form;

    const { selected_timing } = this.state;
    const keys = form.getFieldValue("keys");
    if (keys.length === 2) {
      this.add();
    } else if (keys.length === 1) {
      this.add();
      this.add();
    }
    this.setState({nugget_selected:null});
    setFieldsValue({
      keys:[0,1,2]
    });
    setFieldsValue({[FIELD_NAME]:AFTER_MEALS_ARRAY_TDS});
  }

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

  setAllMealsBefore = ()=> {
    const { form } = this.props;
    const { getFieldValue, setFieldsValue } = form;
    const keys = getFieldValue("keys") || [];
    this.setState({nugget_selected:1});
    if(keys.length === 1){
      setFieldsValue({
        keys:[0]
      });
      setFieldsValue({[FIELD_NAME]:BEFORE_MEALS_ARRAY_OD})
    }
    else if(keys.length === 2){
      setFieldsValue({
        keys:[0,1]
      });
      setFieldsValue({[FIELD_NAME]:BEFORE_MEALS_ARRAY_BD})}
    else if(keys.length === 3){
      setFieldsValue({
        keys:[0,1,2]
      });
      setFieldsValue({[FIELD_NAME]:BEFORE_MEALS_ARRAY_TDS})}
  }

  setAllMealsAfter = ()=> {
    const { form } = this.props;
    const { getFieldValue, setFieldsValue } = form;
    const keys = getFieldValue("keys") || [];
    this.setState({nugget_selected:2});
    if(keys.length === 1){
      setFieldsValue({
        keys:[0]
      });
      setFieldsValue({[FIELD_NAME]:AFTER_MEALS_ARRAY_OD})}
    else if(keys.length === 2){
      setFieldsValue({
        keys:[0,1]
      });
      setFieldsValue({[FIELD_NAME]:AFTER_MEALS_ARRAY_BD})}
    else if(keys.length === 3){
      setFieldsValue({
        keys:[0,1,2]
      });
      setFieldsValue({[FIELD_NAME]:AFTER_MEALS_ARRAY_TDS})}
  }



  render() {

    const { form } = this.props;
    const {
      getFormItems,
      formatMessage,
      onClickOd,
      onClickBd,
      onClickTds
    } = this;
    const {
      isFieldTouched,
      getFieldError,
      getFieldValue
    } = form;
    const keys = getFieldValue("keys") || [];
    // const error = isFieldTouched(FIELD_NAME) && getFieldError(FIELD_NAME);

    // const { getInitialValue } = this;
 
    const {nugget_selected} = this.state;

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
          {/* <div className="flex-grow-0">
            <RadioGroup size="small" className="flex justify-content-end">
              <RadioButton value={1} onClick={this.add}>
                {formatMessage(messages.add_more_text)}
              </RadioButton>
            </RadioGroup>
          </div> */}
        </div>
        <RadioGroup
          className="flex justify-content-end radio-formulation mb10"
          buttonStyle="solid"
        >
          <RadioButton value={1} checked={keys.length === 1} onClick={onClickOd} >{this.formatMessage(messages.od)}</RadioButton>
          <RadioButton value={2} checked={keys.length === 2} onClick={onClickBd}>{this.formatMessage(messages.bd)}</RadioButton>
          <RadioButton value={3} checked={keys.length === 3} onClick={onClickTds}>{this.formatMessage(messages.tds)}</RadioButton>
        </RadioGroup>

        {getFormItems()}

        <RadioGroup
          className="flex justify-content-end radio-formulation mb10"
          buttonStyle="solid"
          value={nugget_selected}
        >
          <RadioButton value={1}  checked={nugget_selected === 1} onClick={this.setAllMealsBefore} >Before Meals</RadioButton>
          <RadioButton value={2}  checked={nugget_selected === 2}  onClick={this.setAllMealsAfter} >After Meals</RadioButton>
        </RadioGroup>

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
