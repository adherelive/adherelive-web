import React, { Component, Fragment } from "react";
import { Select, Form, Radio, Icon } from "antd";
import { injectIntl } from "react-intl";
import messages from "../message";
import moment from "moment";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const { Item: FormItem } = Form;

const AFTER_WAKEUP = "1";
const BEFORE_BREAKFAST = "2";
const AFTER_BREAKFAST = "3";
const BEFORE_LUNCH = "4";
const AFTER_LUNCH = "5";
const BEFORE_EVENING_SNACK = "6";
const AFTER_EVENING_SNACK = "7";
const BEFORE_DINNER = "8";
const AFTER_DINNER = "9";
const BEFORE_SLEEP = "10";

const BEFORE_MEALS_ARRAY_OD = [BEFORE_BREAKFAST];
const AFTER_MEALS_ARRAY_OD = [AFTER_BREAKFAST];
const BEFORE_MEALS_ARRAY_BD = [BEFORE_BREAKFAST, BEFORE_LUNCH];
const AFTER_MEALS_ARRAY_BD = [AFTER_BREAKFAST, AFTER_LUNCH];
const BEFORE_MEALS_ARRAY_TDS = [BEFORE_BREAKFAST, BEFORE_LUNCH, BEFORE_DINNER];
const AFTER_MEALS_ARRAY_TDS = [AFTER_BREAKFAST, AFTER_LUNCH, AFTER_DINNER];

const ALL_OPTIONS_ARRAY = [AFTER_WAKEUP,BEFORE_BREAKFAST,AFTER_BREAKFAST,BEFORE_LUNCH,
  AFTER_LUNCH,BEFORE_EVENING_SNACK,AFTER_EVENING_SNACK,BEFORE_DINNER,AFTER_DINNER,BEFORE_SLEEP];

const { Option } = Select;

const FIELD_NAME = "when_to_take";

let key_field = 1;

class WhenToTakeMedication extends Component {
  constructor(props) {
    super(props);
    const { medication_details = {} } = props;
    const { timings = {} } = medication_details || {};
    let statusList = {};
    Object.keys(timings).forEach(id => {
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
      selected_timing: {},
      nugget_selected: null
    };
  }

  componentDidMount() {
    const {
      form: { validateFields }
    } = this.props;
    const { setWhenToTakeInitialValues } = this;
    validateFields();
    setWhenToTakeInitialValues();
  }

  setWhenToTakeInitialValues = () => {

    const {
      medications,
      medicationData = {},
      payload: { id: medication_id } = {},
      addMedication
    } = this.props;
    let { basic_info: { details: { when_to_take = [] } = {} } = {} } =
      medications[medication_id] || {};

    let statusList = {};

    when_to_take.forEach((id, index) => {
      statusList[index] = id;
    });

    let {
      schedule_data: { when_to_take: frequency = [] } = {}
    } = medicationData;

    if (when_to_take.length === 1) {
      if (when_to_take[0] === BEFORE_MEALS_ARRAY_OD[0]) {
        this.setState({ nugget_selected: 1 });
      } else if (when_to_take[0] === AFTER_MEALS_ARRAY_OD[0]) {
        this.setState({ nugget_selected: 2 });
      }
    } else if (when_to_take.length === 2) {
      if (
        when_to_take[0] === BEFORE_MEALS_ARRAY_BD[0] &&
        when_to_take[1] === BEFORE_MEALS_ARRAY_BD[1]
      ) {
        this.setState({ nugget_selected: 1 });
      } else if (
        when_to_take[0] === BEFORE_MEALS_ARRAY_BD[0] &&
        when_to_take[1] === BEFORE_MEALS_ARRAY_BD[1]
      ) {
        this.setState({ nugget_selected: 2 });
      }
    } else if (when_to_take.length === 3) {
      if (
        when_to_take[0] === BEFORE_MEALS_ARRAY_TDS[0] &&
        when_to_take[1] === BEFORE_MEALS_ARRAY_TDS[1] &&
        when_to_take[2] === BEFORE_MEALS_ARRAY_TDS[2]
      ) {
        this.setState({ nugget_selected: 1 });
      } else if (
        when_to_take[0] === AFTER_MEALS_ARRAY_TDS[0] &&
        when_to_take[1] === AFTER_MEALS_ARRAY_TDS[1] &&
        when_to_take[2] === AFTER_MEALS_ARRAY_TDS[2]
      ) {
        this.setState({ nugget_selected: 2 });
      }
    }

    if (frequency.length) {
      statusList[0] = frequency[0];
      when_to_take = frequency;
    }
    if (addMedication) {
      statusList[0] = ["4"];
      when_to_take = ["4"];
    }
    this.setState({
      selected_timing: statusList,
      selected_timing_overall: [...when_to_take]
    });
  };

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
        remaining_timing: { ...timings }
      });
    }
  }

  componentWillUnmount() {
    const {
      form: { validateFields }
    } = this.props;
    validateFields();
  }

  formatMessage = data => this.props.intl.formatMessage(data);

  getParentNode = t => t.parentNode;

  getUpdatedList = k => {
    const {
      selected_timing = {},
      total_status,
      selected_timing_overall = []
    } = this.state;

    let current_status = [];

    Object.keys(selected_timing).forEach(id => {
      if (id === `${k}`) {
        current_status.push(selected_timing[id]);
      } else {
      }
    });


    const remaining_status = total_status.filter(
      s => !selected_timing_overall.includes(s)
    );

    const all_timings = [...current_status, ...remaining_status];

    let uniqueTimings = [];
    all_timings.forEach(timing => {
      if (!uniqueTimings.includes(timing)) {
        uniqueTimings.push(timing);
      }
    });

    return uniqueTimings;
  };

  getUnitOption = k => {
    const { status } = this.state;
    const { getUpdatedList } = this;
    // let getList = getUpdatedList(k);
    const getList = ALL_OPTIONS_ARRAY;

    return getList.map(id => {
      const text = status[id];
      return (
        <Option key={`s-${k}.${id}`} value={id}>
          {text}
        </Option>
      );
    });
  };

  handleSelect = (value, select_box_id) => {
    const { selected_timing = {} } = this.state;
    // const keys = new Set([...selected_timing_overall, value]);
    const updatedSelectTiming = {
      ...selected_timing,
      [select_box_id]: value
    };
    this.setState({
      selected_timing: updatedSelectTiming
    });
    this.handleRadioButtonChange();
  };

  handleRadioButtonChange = () => {
    const { form } = this.props;
    const { nugget_selected } = this.state;
    const { getFieldValue, setFieldsValue } = form;
    const keys = getFieldValue("keys");
    let check = [];

    if (nugget_selected === 1) {
      if (keys.length === 1) {
        check = BEFORE_MEALS_ARRAY_OD;
      } else if (keys.length === 2) {
        check = BEFORE_MEALS_ARRAY_BD;
      } else if (keys.length === 3) {
        check = BEFORE_MEALS_ARRAY_TDS;
      }
    } else if (nugget_selected === 2) {
      if (keys.length === 1) {
        check = AFTER_MEALS_ARRAY_OD;
      } else if (keys.length === 2) {
        check = AFTER_MEALS_ARRAY_BD;
      } else if (keys.length === 3) {
        check = AFTER_MEALS_ARRAY_TDS;
      }
    }

    let flag = true;

    const seletedValues = Object.values(getFieldValue([FIELD_NAME]))[0];
    seletedValues.forEach(eachVal => {
      if (!check.includes(eachVal)) {
        flag = false;
      }
    });

    if (flag === false) {
      this.setState({ nugget_selected: null });
    }
  };

  handleDeselect = value => {
    // const updateField = selected_timing_overall.filter(
    //   (field) => field !== value
    // );
    this.setState({
      // selected_timing_overall: updateField
    });
  };

  remove = k => {
    const { selected_timing_overall, selected_timing } = this.state;
    const { form } = this.props;
    const { getFieldValue, setFieldsValue } = form;
    const selected = getFieldValue(`${FIELD_NAME}[${k}]`) || [];

    let selectedTimingUpdate = {};
    Object.keys(selected_timing).forEach(id => {
      if (k !== parseInt(id)) {
        selectedTimingUpdate[k] = selected_timing[k] || {};
      }
    });

    this.setState({
      selected_timing_overall: selected_timing_overall.filter(field => {
        return selected !== field;
      })
      // selected_timing: selectedTimingUpdate,
    });
    const keys = getFieldValue("keys");

    setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  };

  getInitialValue = k => {
    const { total_status, nugget_selected } = this.state;

    return total_status[k];
  };

  getFormItems = () => {
    const {
      form,
      medications,
      payload: { id: medication_id } = {},
      medicationData = {},
      addMedication
    } = this.props;
    // const { count } = this.state;
    const {
      handleSelect,
      handleDeselect,
      getInitialValue,
      formatMessage
    } = this;
    const {
      getFieldDecorator,
      getFieldValue
    } = form;

    const { nugget_selected } = this.state;

    let { basic_info: { details: { when_to_take = [] } = {} } = {} } =
      medications[medication_id] || {};
    let {
      schedule_data: { when_to_take: frequency = [] } = {}
    } = medicationData;

    if (frequency.length) {
      when_to_take = frequency;
    }
    if (addMedication) {
      when_to_take = ["4"];
    }
    getFieldDecorator("keys", {
      initialValue: when_to_take.map((id, index) => parseInt(id) - 1)
    });
    let keys = getFieldValue("keys");

    let initialValuesArray = [];

    if (nugget_selected) {
      if (frequency.length === 1) {
        keys = [0];
      } else if (frequency.length === 2) {
        keys = [0, 1];
      } else if (frequency.length === 3) {
        keys = [0, 1, 2];
      }

      initialValuesArray = frequency;
    }

    return keys.map((k, index) => {
      return (
        <Fragment>
          <div className="flex direction-row justify-space-between align-center mb24">
            <div key={`random${k}`} className="wp100">
              <FormItem className="flex-1 mb0">
                {getFieldDecorator(`${FIELD_NAME}[${k}]`, {
                  rules: [
                    {
                      required: true,
                      message: "Select The Time"
                    }
                  ],

                  initialValue:
                    nugget_selected && initialValuesArray[k]
                      ? initialValuesArray[k]
                      : getInitialValue(k)
                })(
                  <Select
                    className="wp100 drawer-select"
                    autoComplete="off"
                    placeholder={formatMessage(messages.select_timing)}
                    onSelect={value => handleSelect(value, k)}
                    onDeselect={handleDeselect}
                    suffixIcon={null}
                  >
                    {this.getUnitOption(k)}
                  </Select>
                )}
              </FormItem>
            </div>
          
          </div>
        </Fragment>
      );
    });
  };

  onClickOd = () => {
    const { form } = this.props;
    const { setFieldsValue } = form;

    const { selected_timing } = this.state;
    const keys = form.getFieldValue("keys");
    if (keys.length === 3) {
      this.remove(keys[2]);
      this.remove(keys[1]);
    } else if (keys.length === 2) {
      this.remove(keys[1]);
    }

    this.setState({ nugget_selected: null });
    setFieldsValue({
      keys: [0]
    });
    setFieldsValue({ [FIELD_NAME]: AFTER_MEALS_ARRAY_OD });
  };
  onClickBd = () => {
    const { form } = this.props;
    const { setFieldsValue } = form;

    const { selected_timing } = this.state;
    const keys = form.getFieldValue("keys");
    if (keys.length === 3) {
      this.remove(keys[2]);
    } else if (keys.length === 1) {
      this.add();
    }
    this.setState({ nugget_selected: null });
    setFieldsValue({
      keys: [0, 1]
    });
    setFieldsValue({ [FIELD_NAME]: AFTER_MEALS_ARRAY_BD });
  };

  onClickTds = () => {
    const { form } = this.props;
    const { setFieldsValue } = form;

    const { selected_timing } = this.state;
    const keys = form.getFieldValue("keys");
    if (keys.length === 2) {
      this.add();
    } else if (keys.length === 1) {
      this.add();
      this.add();
    }
    this.setState({ nugget_selected: null });
    setFieldsValue({
      keys: [0, 1, 2],
      [FIELD_NAME]: AFTER_MEALS_ARRAY_TDS
    });

  };

  setAllMealsBefore = e => {

    e.preventDefault();
    const { form, enableSubmit } = this.props;
    const { getFieldValue, setFieldsValue } = form;
    const keys = getFieldValue("keys") || [];
    this.setState({ nugget_selected: 1 });



    if (keys.length === 1) {
      setFieldsValue({
        keys: [0],
      },async()=>{
        setFieldsValue({[FIELD_NAME]:BEFORE_MEALS_ARRAY_OD
        })
        enableSubmit();

      });
    } else if (keys.length === 2) {
      setFieldsValue({
        keys: [0, 1],
      },async()=>{
        setFieldsValue({[FIELD_NAME]:BEFORE_MEALS_ARRAY_BD
        })
        enableSubmit();

      });
    } else if (keys.length === 3) {
      setFieldsValue({
        keys: [0, 1, 2],
      },async()=>{
        setFieldsValue({[FIELD_NAME]:BEFORE_MEALS_ARRAY_TDS
        })
        enableSubmit();

      });
    }
  
  };

  setAllMealsAfter = e => {

    e.preventDefault();
    const { form, enableSubmit } = this.props;
    const { getFieldValue, setFieldsValue } = form;
    const keys = getFieldValue("keys") || [];
    this.setState({ nugget_selected: 2 });


    if (keys.length === 1) {
      setFieldsValue({
        keys: [0],
      },async()=>{
        setFieldsValue({[FIELD_NAME]:AFTER_MEALS_ARRAY_OD
        })
        enableSubmit();
      });


    } else if (keys.length === 2) {
      setFieldsValue({
        keys: [0, 1],
      },async()=>{
        setFieldsValue({[FIELD_NAME]:AFTER_MEALS_ARRAY_BD
        })
        enableSubmit();
      });

    } else if (keys.length === 3) {
      setFieldsValue({
        keys: [0, 1, 2],
      },async()=>{
        setFieldsValue({[FIELD_NAME]:AFTER_MEALS_ARRAY_TDS
        })
        enableSubmit();
      });
    }
  };

  add = () => {
    const { form } = this.props;
    const { selected_timing, selected_timing_overall } = this.state;
    const keys = form.getFieldValue("keys");
    const lastKey = keys[keys.length - 1];
    const nextKeys = keys.concat(lastKey + 1);
    form.setFieldsValue({
      keys: nextKeys
    });
    key_field++;
    this.setState({
      selected_timing_overall: [
        ...selected_timing_overall,
        this.getInitialValue(lastKey + 1)
      ],
      selected_timing: {
        ...selected_timing,
        [lastKey + 1]: this.getInitialValue(lastKey + 1)
      }
    });
  };

  render() {
    const { form } = this.props;
    const {
      getFormItems,
      formatMessage,
      onClickOd,
      onClickBd,
      onClickTds
    } = this;
    const { getFieldValue } = form;
    const keys = getFieldValue("keys") || [];
    // const error = isFieldTouched(FIELD_NAME) && getFieldError(FIELD_NAME);
    // const { getInitialValue } = this;

    const { nugget_selected } = this.state;

    return (
      <Fragment>
        <div className="flex align-items-end justify-content-space-between">
          <div className="flex row flex-grow-1">
            <label htmlFor="quantity" className="form-label " title="Quantity">
              {formatMessage(messages.timing)}
            </label>

            <div className="star-red">*</div>
          </div>
          
        </div>

        <RadioGroup
          className="flex justify-content-end radio-formulation mb10"
          buttonStyle="solid"
        >
          <RadioButton
            value={1}
            checked={keys.length === 1}
            onClick={onClickOd}
          >
            {this.formatMessage(messages.od)}
          </RadioButton>
          <RadioButton
            value={2}
            checked={keys.length === 2}
            onClick={onClickBd}
          >
            {this.formatMessage(messages.bd)}
          </RadioButton>
          <RadioButton
            value={3}
            checked={keys.length === 3}
            onClick={onClickTds}
          >
            {this.formatMessage(messages.tds)}
          </RadioButton>
        </RadioGroup>
        {getFormItems()}

        <RadioGroup
          className="flex justify-content-end radio-formulation mb10"
          buttonStyle="solid"
          value={nugget_selected}
        >
          <RadioButton
            value={1}
            checked={nugget_selected === 1}
            onClick={this.setAllMealsBefore}
          >
            Before Meals
          </RadioButton>
          <RadioButton
            value={2}
            checked={nugget_selected === 2}
            onClick={this.setAllMealsAfter}
          >
            After Meals
          </RadioButton>
        </RadioGroup>
      </Fragment>
    );
    // }
  }
}

const Field = injectIntl(WhenToTakeMedication);

export default {
  fieLd_name: FIELD_NAME,
  render: props => <Field {...props} />
};
