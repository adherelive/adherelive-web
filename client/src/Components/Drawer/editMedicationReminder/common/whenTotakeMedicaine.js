import React, { Component, Fragment } from "react";
import { Select, Form, Radio, Icon } from "antd";
import { injectIntl } from "react-intl";
import messages from "../message";
import moment from "moment";

import { WHEN_TO_TAKE_BUTTONS } from "../../addMedicationReminder/common/whenTotakeMedicaine";
import { WHEN_TO_TAKE_ABBR_TYPES } from "../../../../constant";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const { Item: FormItem } = Form;

export const AFTER_WAKEUP = "1";
export const BEFORE_BREAKFAST = "2";
export const AFTER_BREAKFAST = "3";
export const BEFORE_LUNCH = "4";
export const WITH_LUNCH = "5";
export const AFTER_LUNCH = "6";
export const BEFORE_EVENING_SNACK = "7";
export const AFTER_EVENING_SNACK = "8";
export const BEFORE_DINNER = "9";
export const WITH_DINNER = "10";
export const AFTER_DINNER = "11";
export const BEFORE_SLEEP = "12";

const BEFORE_MEALS_ARRAY_OD = [BEFORE_BREAKFAST];
const AFTER_MEALS_ARRAY_OD = [AFTER_BREAKFAST];
const BEFORE_MEALS_ARRAY_BD = [BEFORE_BREAKFAST, BEFORE_LUNCH];
const AFTER_MEALS_ARRAY_BD = [AFTER_BREAKFAST, AFTER_LUNCH];
const BEFORE_MEALS_ARRAY_TDS = [BEFORE_BREAKFAST, BEFORE_LUNCH, BEFORE_DINNER];
const AFTER_MEALS_ARRAY_TDS = [AFTER_BREAKFAST, AFTER_LUNCH, AFTER_DINNER];

const ALL_OPTIONS_ARRAY = [
  AFTER_WAKEUP,
  BEFORE_BREAKFAST,
  AFTER_BREAKFAST,
  BEFORE_LUNCH,
  WITH_LUNCH,
  AFTER_LUNCH,
  BEFORE_EVENING_SNACK,
  AFTER_EVENING_SNACK,
  BEFORE_DINNER,
  WITH_DINNER,
  AFTER_DINNER,
  BEFORE_SLEEP,
];

const { Option } = Select;

const FIELD_NAME = "when_to_take";
const FIELD_NAME_ABBR = "when_to_take_abbr";

let key_field = 1;

class WhenToTakeMedication extends Component {
  constructor(props) {
    super(props);
    const { medication_details = {} } = props;
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
      selected_timing: {},
      nugget_selected: null,
    };
  }

  componentDidMount() {
    const {
      form: { validateFields },
    } = this.props;
    const { setWhenToTakeInitialValues, formatWhenToTakeButtons } = this;
    validateFields();
    setWhenToTakeInitialValues();
    formatWhenToTakeButtons();
  }

  formatWhenToTakeButtons = () => {
    const {
      formatMessage,
      onClickOd,
      onClickBd,
      onClickTds,
      onCLickSos,
      getKeys,
    } = this;
    this.WHEN_TO_TAKE_BUTTONS = { ...WHEN_TO_TAKE_BUTTONS };

    const keys = getKeys();
    Object.keys(WHEN_TO_TAKE_BUTTONS).forEach((index) => {
      const { id, whenToTakeCount } = WHEN_TO_TAKE_BUTTONS[index] || {};

      let additionalData = {};

      // set initial value for button
      // if(keys.length === whenToTakeCount) {
      //   getFieldDecorator(FIELD_NAME_ABBR, {
      //     initialValue: id
      //   });
      // }

      switch (whenToTakeCount) {
        case WHEN_TO_TAKE_BUTTONS.OD.whenToTakeCount:
          additionalData = {
            setter: onClickOd,
            text: formatMessage(messages.od),
          };
          break;
        case WHEN_TO_TAKE_BUTTONS.BD.whenToTakeCount:
          additionalData = {
            setter: onClickBd,
            text: formatMessage(messages.bd),
          };
          break;
        case WHEN_TO_TAKE_BUTTONS.TDS.whenToTakeCount:
          additionalData = {
            setter: onClickTds,
            text: formatMessage(messages.tds),
          };
          break;
        case WHEN_TO_TAKE_BUTTONS.SOS.whenToTakeCount:
          additionalData = {
            setter: onCLickSos,
            text: formatMessage(messages.sos),
          };
          break;
        default:
          break;
      }

      this.WHEN_TO_TAKE_BUTTONS[index] = {
        ...this.WHEN_TO_TAKE_BUTTONS[index],
        ...additionalData,
      };
    });
  };

  setWhenToTakeInitialValues = () => {
    const {
      medications,
      medicationData = {},
      payload: { id: medication_id } = {},
      addMedication,
      // editMedication,
      form: { getFieldDecorator } = {},
    } = this.props;
    let { basic_info: { details: { when_to_take = [] } = {} } = {} } =
      medications[medication_id] || {};

    let statusList = {};

    when_to_take.forEach((id, index) => {
      statusList[index] = id;
    });

    if (addMedication) {
      statusList[0] = ["4"];
      when_to_take = ["4"];
    }

    let { schedule_data: { when_to_take: frequency = [] } = {} } =
      medicationData;

    if (when_to_take.length === 1) {
      if (when_to_take[0] === BEFORE_MEALS_ARRAY_OD[0]) {
        this.setState({ nugget_selected: 1 });
      } else if (when_to_take[0] === AFTER_MEALS_ARRAY_OD[0]) {
        this.setState({ nugget_selected: 2 });
      }
      getFieldDecorator(FIELD_NAME_ABBR, {
        initialValue: WHEN_TO_TAKE_BUTTONS.OD.id,
      });
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
      getFieldDecorator(FIELD_NAME_ABBR, {
        initialValue: WHEN_TO_TAKE_BUTTONS.BD.id,
      });
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
      getFieldDecorator(FIELD_NAME_ABBR, {
        initialValue: WHEN_TO_TAKE_BUTTONS.TDS.id,
      });
    } else if (when_to_take.length === 0) {
      getFieldDecorator(FIELD_NAME_ABBR, {
        initialValue: WHEN_TO_TAKE_BUTTONS.SOS.id,
      });
    }

    if (frequency.length) {
      statusList[0] = frequency[0];
      when_to_take = frequency;
    }

    this.setState({
      selected_timing: statusList,
      selected_timing_overall: [...when_to_take],
    });
  };

  getKeys = () => this.props.form.getFieldValue("keys");

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
    // let getList = getUpdatedList(k);
    const getList = ALL_OPTIONS_ARRAY;

    return getList.map((id) => {
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
      [select_box_id]: value,
    };
    this.setState({
      selected_timing: updatedSelectTiming,
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
    seletedValues.forEach((eachVal) => {
      if (!check.includes(eachVal)) {
        flag = false;
      }
    });

    if (flag === false) {
      this.setState({ nugget_selected: null });
    }
  };

  handleDeselect = (value) => {
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

    let selectedTimingUpdate = {};
    Object.keys(selected_timing).forEach((id) => {
      if (k !== parseInt(id)) {
        selectedTimingUpdate[k] = selected_timing[k] || {};
      }
    });

    this.setState({
      selected_timing_overall: selected_timing_overall.filter((field) => {
        return selected !== field;
      }),
      // selected_timing: selectedTimingUpdate,
    });
    const keys = getFieldValue("keys");

    setFieldsValue({
      keys: keys.filter((key) => key !== k),
    });
  };

  getInitialValue = (k) => {
    const { total_status, nugget_selected } = this.state;

    return total_status[k];
  };

  getFormItems = () => {
    const {
      form,
      medications,
      payload: { id: medication_id, canViewDetails = false } = {},
      medicationData = {},
      addMedication,
      editMedication,
    } = this.props;
    // const { count } = this.state;
    const { handleSelect, handleDeselect, getInitialValue, formatMessage } =
      this;
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;

    let keysTemp = getFieldValue("keys");

    const { nugget_selected } = this.state;

    let { basic_info: { details: { when_to_take = [] } = {} } = {} } =
      medications[medication_id] || {};
    let {
      schedule_data: { when_to_take: frequency = [] } = {},
      details: { when_to_take: frequency2 = [] } = {},
    } = medicationData;

    if (frequency.length) {
      when_to_take = frequency;
    }

    if (frequency2.length) {
      when_to_take = frequency2;
    }

    if (addMedication) {
      when_to_take = ["4"];
    }

    getFieldDecorator("keys", {
      initialValue: when_to_take.map((id, index) => parseInt(id) - 1),
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

    if (editMedication) {
      const { templatePage = false } = medicationData || {};
      if (templatePage && keysTemp) {
        keys = keysTemp;
      } else if (keysTemp) {
        keys = keysTemp;
      }
    }

    if (keys.length === 0) {
      return (
        <div className="pt10 pb10 fs16 fw600">
          {formatMessage(messages.sosMessage)}
        </div>
      );
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
                      message: "Select The Time",
                    },
                  ],

                  initialValue:
                    nugget_selected && initialValuesArray[k]
                      ? initialValuesArray[k]
                      : getInitialValue(k),
                })(
                  <Select
                    className="wp100 drawer-select"
                    autoComplete="off"
                    placeholder={formatMessage(messages.select_timing)}
                    onSelect={(value) => handleSelect(value, k)}
                    onDeselect={handleDeselect}
                    suffixIcon={null}
                    disabled={canViewDetails}
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
    const { form, enableSubmit } = this.props;
    const { setFieldsValue } = form;

    // const { selected_timing } = this.state;
    const { getKeys, WHEN_TO_TAKE_BUTTONS } = this;

    // const keys = form.getFieldValue("keys");

    const keys = getKeys();
    if (keys.length === 3) {
      this.remove(keys[2]);
      this.remove(keys[1]);
    } else if (keys.length === 2) {
      this.remove(keys[1]);
    }

    this.setState({ nugget_selected: null });
    setFieldsValue({
      keys: [0],
    });
    setFieldsValue({
      [FIELD_NAME]: AFTER_MEALS_ARRAY_OD,
      [FIELD_NAME_ABBR]: WHEN_TO_TAKE_BUTTONS.OD.id,
    });
    enableSubmit();
  };
  onClickBd = () => {
    const { form, enableSubmit } = this.props;
    const { setFieldsValue } = form;

    // const { selected_timing } = this.state;

    const { getKeys, WHEN_TO_TAKE_BUTTONS } = this;
    // const keys = form.getFieldValue("keys");
    const keys = getKeys();
    if (keys.length === 3) {
      this.remove(keys[2]);
    } else if (keys.length === 1) {
      this.add();
    }
    this.setState({ nugget_selected: null });
    setFieldsValue({
      keys: [0, 1],
    });
    setFieldsValue({
      [FIELD_NAME]: AFTER_MEALS_ARRAY_BD,
      [FIELD_NAME_ABBR]: WHEN_TO_TAKE_BUTTONS.BD.id,
    });
    enableSubmit();
  };

  onClickTds = () => {
    const { form, enableSubmit } = this.props;
    const { setFieldsValue } = form;
    const { WHEN_TO_TAKE_BUTTONS, getKeys } = this;
    const keys = getKeys();
    // const keys = form.getFieldValue("keys");
    if (keys.length === 2) {
      this.add();
    } else if (keys.length === 1) {
      this.add();
      this.add();
    }
    this.setState({ nugget_selected: null });
    setFieldsValue({
      keys: [0, 1, 2],
      [FIELD_NAME]: AFTER_MEALS_ARRAY_TDS,
      [FIELD_NAME_ABBR]: WHEN_TO_TAKE_BUTTONS.TDS.id,
    });
    enableSubmit();
  };

  onCLickSos = () => {
    const { form: { setFieldsValue } = {}, enableSubmit } = this.props;
    const { WHEN_TO_TAKE_BUTTONS } = this;
    // const {getKeys} = this;

    // const keys = getKeys();
    // if (keys.length === 2) {
    //   this.add();
    // } else if (keys.length === 1) {
    //   this.add();
    //   this.add();
    // }
    // this.setState({nugget_selected:null});
    setFieldsValue({
      keys: [],
      [FIELD_NAME]: [],
      [FIELD_NAME_ABBR]: WHEN_TO_TAKE_BUTTONS.SOS.id,
    });
    enableSubmit();
    // setFieldsValue({[FIELD_NAME]:AFTER_MEALS_ARRAY_TDS});
  };

  setAllMealsBefore = (e) => {
    e.preventDefault();
    const { form, enableSubmit } = this.props;
    const { getFieldValue, setFieldsValue } = form;
    const keys = getFieldValue("keys") || [];
    this.setState({ nugget_selected: 1 });

    if (keys.length === 1) {
      setFieldsValue(
        {
          keys: [0],
        },
        async () => {
          setFieldsValue({ [FIELD_NAME]: BEFORE_MEALS_ARRAY_OD });
          enableSubmit();
        }
      );
    } else if (keys.length === 2) {
      setFieldsValue(
        {
          keys: [0, 1],
        },
        async () => {
          setFieldsValue({ [FIELD_NAME]: BEFORE_MEALS_ARRAY_BD });
          enableSubmit();
        }
      );
    } else if (keys.length === 3) {
      setFieldsValue(
        {
          keys: [0, 1, 2],
        },
        async () => {
          setFieldsValue({ [FIELD_NAME]: BEFORE_MEALS_ARRAY_TDS });
          enableSubmit();
        }
      );
    }
  };

  setAllMealsAfter = (e) => {
    e.preventDefault();
    const { form, enableSubmit } = this.props;
    const { getFieldValue, setFieldsValue } = form;
    const keys = getFieldValue("keys") || [];
    this.setState({ nugget_selected: 2 });

    if (keys.length === 1) {
      setFieldsValue(
        {
          keys: [0],
        },
        async () => {
          setFieldsValue({ [FIELD_NAME]: AFTER_MEALS_ARRAY_OD });
          enableSubmit();
        }
      );
    } else if (keys.length === 2) {
      setFieldsValue(
        {
          keys: [0, 1],
        },
        async () => {
          setFieldsValue({ [FIELD_NAME]: AFTER_MEALS_ARRAY_BD });
          enableSubmit();
        }
      );
    } else if (keys.length === 3) {
      setFieldsValue(
        {
          keys: [0, 1, 2],
        },
        async () => {
          setFieldsValue({ [FIELD_NAME]: AFTER_MEALS_ARRAY_TDS });
          enableSubmit();
        }
      );
    }
  };

  add = () => {
    const { form } = this.props;
    const { selected_timing, selected_timing_overall } = this.state;
    const keys = form.getFieldValue("keys");
    const lastKey = keys[keys.length - 1];
    const nextKeys = keys.concat(lastKey + 1);
    form.setFieldsValue({
      keys: nextKeys,
    });
    key_field++;
    this.setState({
      selected_timing_overall: [
        ...selected_timing_overall,
        this.getInitialValue(lastKey + 1),
      ],
      selected_timing: {
        ...selected_timing,
        [lastKey + 1]: this.getInitialValue(lastKey + 1),
      },
    });
  };

  getRadioOptions = () => {
    const { WHEN_TO_TAKE_BUTTONS = {}, getKeys } = this;
    const keys = getKeys();

    return Object.keys(WHEN_TO_TAKE_BUTTONS).map((index) => {
      const { id, setter, text, whenToTakeCount } =
        WHEN_TO_TAKE_BUTTONS[index] || {};

      return (
        <RadioButton
          value={id}
          checked={keys.length === whenToTakeCount}
          onClick={setter}
          className="mb10"
        >
          {text}
        </RadioButton>
      );
    });
  };

  getWhenToTakeButtons = () => {
    const {
      form: { getFieldDecorator } = {},
      payload = {},
      medications,
      medicationData: templateMedication = null,
    } = this.props;
    const { WHEN_TO_TAKE_BUTTONS = {}, getRadioOptions } = this;
    const { id: medication_id = null, canViewDetails = false } = payload || {};
    const {
      basic_info: {
        details: { when_to_take_abbr: existingWhenToTake = null } = {},
      } = {},
    } = medications[medication_id] || {};

    let whenToTake = null;

    if (templateMedication) {
      // console.log("327546235423786479812742376 templateMedication",{templateMedication,props:this.props});

      // const {
      //   schedule_data,
      //   details
      // } = templateMedication || {};

      const { schedule_data: { when_to_take_abbr } = {} } =
        templateMedication || {};

      whenToTake = when_to_take_abbr;

      // let {
      //   schedule_data: {when_to_take:schedule_data_when_to_take=[], when_to_take_abbr : schedule_data_when_to_take_abbr='' } = {},
      //   details: {when_to_take:details_when_to_take=[], when_to_take_abbr : details_when_to_take_abbr='' } = {}
      // } = templateMedication;

      // when_to_take_abbr=schedule_data_when_to_take_abbr ? schedule_data_when_to_take_abbr : details_when_to_take_abbr ;
      // schedule_data_when_to_take = schedule_data_when_to_take ? schedule_data_when_to_take : details_when_to_take;

      // if(!when_to_take_abbr){
      //   if(schedule_data_when_to_take.length ===1){
      //     when_to_take_abbr = WHEN_TO_TAKE_ABBR_TYPES.OD;
      //   }
      //   else if(schedule_data_when_to_take.length ===2){
      //     when_to_take_abbr = WHEN_TO_TAKE_ABBR_TYPES.BD;
      //   }
      //   else if(schedule_data_when_to_take.length ===3){
      //     when_to_take_abbr = WHEN_TO_TAKE_ABBR_TYPES.TD;
      //   }
      //   else if(schedule_data_when_to_take.length ===0){
      //     when_to_take_abbr = WHEN_TO_TAKE_ABBR_TYPES.SOS;
      //   }
      // }
    }

    if (!existingWhenToTake) {
      if (!whenToTake) {
        const keys = this.getKeys() || [];
        if (keys.length) {
          whenToTake = `${keys.length}`;
        } else {
          whenToTake = WHEN_TO_TAKE_ABBR_TYPES.SOS;
        }
      }
    } else {
      whenToTake = existingWhenToTake;
    }

    // if(!whenToTake && !existingWhenToTake) {
    //   whenToTake = WHEN_TO_TAKE_ABBR_TYPES.OD;
    // } else {
    //   console.log("873189273 here", {existingWhenToTake, whenToTake});
    //   whenToTake = existingWhenToTake;
    // }

    // console.log("763425462387947230942",{props:this.props,payload,when_to_take_abbr});

    // const keys = getKeys();
    if (Object.keys(WHEN_TO_TAKE_BUTTONS).length > 0) {
      return (
        <Fragment>
          {getFieldDecorator(FIELD_NAME_ABBR, {
            initialValue: whenToTake,
          })(
            <RadioGroup
              className="flex justify-content-end radio-formulation flex-wrap"
              buttonStyle="solid"
              disabled={canViewDetails}
            >
              {getRadioOptions()}
            </RadioGroup>
          )}
        </Fragment>
      );
    } else {
      return null;
    }
  };

  render() {
    const { form } = this.props;
    const {
      getFormItems,
      formatMessage,
      // onClickOd,
      // onClickBd,
      // onClickTds,
      getWhenToTakeButtons,
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

        {/*<RadioGroup*/}
        {/*  className="flex justify-content-end radio-formulation mb10"*/}
        {/*  buttonStyle="solid"*/}
        {/*>*/}
        {/*  <RadioButton*/}
        {/*    value={1}*/}
        {/*    checked={keys.length === 1}*/}
        {/*    onClick={onClickOd}*/}
        {/*  >*/}
        {/*    {this.formatMessage(messages.od)}*/}
        {/*  </RadioButton>*/}
        {/*  <RadioButton*/}
        {/*    value={2}*/}
        {/*    checked={keys.length === 2}*/}
        {/*    onClick={onClickBd}*/}
        {/*  >*/}
        {/*    {this.formatMessage(messages.bd)}*/}
        {/*  </RadioButton>*/}
        {/*  <RadioButton*/}
        {/*    value={3}*/}
        {/*    checked={keys.length === 3}*/}
        {/*    onClick={onClickTds}*/}
        {/*  >*/}
        {/*    {this.formatMessage(messages.tds)}*/}
        {/*  </RadioButton>*/}
        {/*</RadioGroup>*/}

        {getWhenToTakeButtons()}

        {getFormItems()}

        {/* {keys.length !== 0 && (
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
        )} */}
      </Fragment>
    );
    // }
  }
}

const Field = injectIntl(WhenToTakeMedication);

export default {
  fieLd_name: FIELD_NAME,
  field_name_abbr: FIELD_NAME_ABBR,
  render: (props) => <Field {...props} />,
};
