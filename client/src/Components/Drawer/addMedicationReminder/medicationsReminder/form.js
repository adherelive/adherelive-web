import React, { Component, Fragment } from "react";
import { Form, Button, Input, message, Radio } from "antd";
import moment from "moment";
import participantsField from "../common/participants";
import startTimeField from "../common/startTime";
import notesField from "../common/notes";
import RepeatFields from "../common/repeatFields";

import repeatField from "../common/repeatType";
import repeatIntervalField from "../common/repeatInterval";
import repeatDaysField from "../common/selectedDays";
import startDateField from "../common/startDate";
import endDateField from "../common/endDate";
import chooseMedicationField from "../common/medicationStage";
import medicineStrengthField from "../common/medicineStrength";
import criticalMedicationField from "../common/criticalMedication";
import medicineStrengthUnitField from "../common/medicationStrengthUnit";
import medicineQuantityField from "../common/medicineQuantity";
import whenToTakeMedicineField from "../common/whenTotakeMedicaine";
import medicationReminderStageField from "../common/medicationStage";

import CalendarTimeSelection from "../calendarTimeSelection";

import messages from "../message";
import { hasErrors, isNumber } from "../../../../Helper/validation";
import { REPEAT_TYPE, USER_CATEGORY, MEDICINE_TYPE } from "../../../../constant";
const InputGroup = Input.Group;
const { Item: FormItem } = Form;

const UNIT_FIELD = 'unit';


const UNIT_ML = 'ml';

const UNIT_MG = 'mg';


const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class AddMedicationReminderForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {
      form: { validateFields },
      // currentUser: {
      //   basicInfo: { _id, category },
      //   programId = []
      // },
      fetchMedicationStages,
      fetchProgramProducts
    } = this.props;
    const { programId } = [];
    const { _id } = "23";
    const { category } = "PATIENT";
    validateFields();

    if (category === USER_CATEGORY.PATIENT) {
      fetchProgramProducts(programId[0]);
      fetchMedicationStages(_id).then(response => {
        const { status, payload } = response;
        if (status) {
          const {
            data: { medicationStages = [], program_has_medication_stage } = {}
          } = payload;
          if (medicationStages.length > 0) {
            this.setState({
              medicationStages: medicationStages,
              program_has_medication_stage
            });
          } else {
            this.setState({
              medicationStages: [],
              program_has_medication_stage
            });
          }
        }
      });
    }
  }

  formatMessage = data => this.props.intl.formatMessage(data);

  handleCancel = e => {
    if (e) {
      e.preventDefault();
    }
    const { close } = this.props;
    close();
  };

  getNewEndDate = repeatValue => {
    const {
      form: { getFieldValue }
    } = this.props;

    let repeat = getFieldValue(repeatField.field_name);

    let repeatInterval = getFieldValue(repeatIntervalField.field_name);

    if (repeatValue) {
      repeatInterval = repeatValue;
    }

    // if(!repeat){

    // }

    console.log('3647823651783265818347========>', repeatInterval, repeat);
    const startDate = getFieldValue(startDateField.field_name);

    let newEndDate;

    const startDateCopy = startDate.clone().endOf("day");

    const res = isNumber(repeatInterval);
    if (repeat === REPEAT_TYPE.DAILY || res.valid === true) {
      switch (repeat) {
        case REPEAT_TYPE.DAILY: {
          newEndDate = startDateCopy.add(1, "d");
          break;
        }
        case REPEAT_TYPE.WEEKLY: {
          newEndDate = startDateCopy.add(res.value, "w");
          break;
        }
        case REPEAT_TYPE.MONTHLY: {
          newEndDate = startDateCopy.add(res.value, "M");
          break;
        }
        case REPEAT_TYPE.YEARLY: {
          newEndDate = startDateCopy.add(res.value, "y");
          break;
        }
        default:
          break;
      }
    }

    console.log('3647823651783265818347========>', newEndDate);
    if (!newEndDate) {

      newEndDate = startDateCopy.add(1, "d");
    }

    return newEndDate;
  };

  adjustEndDate = repeatValue => {
    const {
      form: { setFieldsValue }
    } = this.props;
    const endDate = this.getNewEndDate(repeatValue);
    if (endDate) {
      setFieldsValue({ [endDateField.field_name]: endDate });
    }
  };

  adjustEventOnStartDateChange = prevDate => {
    const {
      form: { getFieldValue, setFieldsValue, validateFields }
    } = this.props;

    const eventStartTime = getFieldValue(startTimeField.field_name);

    if (prevDate.isSame(eventStartTime, "date")) {
      return;
    }

    const startDate = getFieldValue(startDateField.field_name);

    const newMonth = startDate.get("month");
    const newDate = startDate.get("date");
    const newYear = startDate.get("year");

    let newEventStartTime;

    if (eventStartTime) {
      newEventStartTime = eventStartTime
        .clone()
        .set({ month: newMonth, year: newYear, date: newDate });
    }

    setFieldsValue({
      [startTimeField.field_name]: newEventStartTime
    });
    this.adjustEndDate();
    validateFields([startTimeField.field_name]);
  };

  onChangeEventStartTime = startTime => { };

  onStartDateChange = currentDate => {
    const {
      form: { setFieldsValue }
    } = this.props;

    if (currentDate && currentDate.isValid) {
      setFieldsValue({ [startDateField.field_name]: currentDate });
      this.adjustEventOnStartDateChange();
    }
  };

  disabledStartDate = current => {
    // Can not select days before today
    return current && current <= moment().subtract({ day: 1 });
  };

  disabledEndDate = current => {
    const endDate = this.getNewEndDate();
    console.log('3647823651783265818347', endDate);
    if (endDate) {
      return current && current < endDate;
    }
  };

  onEndDateChange = () => { };

  onStartTimeChange = () => { };

  onEndTimeChange = () => { };

  onEventDurationChange = (start, end) => {
    const {
      form: { setFieldsValue, validateFields }
    } = this.props;
    setFieldsValue({
      [startTimeField.field_name]: start
    });
    validateFields([startTimeField.field_name]);
  };

  onPrev = () => {
    const {
      form: { getFieldValue, setFieldsValue }
    } = this.props;
    const startDate = getFieldValue(startDateField.field_name);
    if (startDate !== null) {
      const newStartDate = startDate.clone().subtract(1, "days");
      setFieldsValue({ [startDateField.field_name]: newStartDate });
      this.adjustEventOnStartDateChange();
    }
  };

  onNext = () => {
    const {
      form: { getFieldValue, setFieldsValue }
    } = this.props;
    const startDate = getFieldValue(startDateField.field_name);
    if (startDate !== null) {
      const newStartDate = startDate.clone().add(1, "days");
      setFieldsValue({ [startDateField.field_name]: newStartDate });
      this.adjustEventOnStartDateChange();
    }
  };

  getOtherUser = () => {
    const {
      form: { getFieldValue },
      members = []
    } = this.props;
    let otherUser;

    const otherUserId = getFieldValue(participantsField.field_name);
    const n = members.length;
    for (let i = 0; i < n; i++) {
      const member = members[i] || {};
      const {
        basicInfo: { _id }
      } = member;
      if (otherUserId === _id) {
        otherUser = member;
        break;
      }
    }

    return otherUser;
  };

  addMedicationReminder = e => {
    e.preventDefault();
    const {
      form: { validateFields },
      addMedicationReminder,
      payload: { patient_id = "2" } = {}
    } = this.props;
    validateFields(async (err, values) => {
      if (!err) {
        console.log("9127619237 values ---> ", values);
        let data_to_submit = {};
        const startTime = values[startTimeField.field_name];
        const startDate = values[startDateField.field_name];
        const endDate = values[endDateField.field_name];
        const repeatDays = values[repeatDaysField.field_name];
        const critical = values[criticalMedicationField.field_name];
        data_to_submit = {
          ...values,
          id: patient_id,

          repeat: "weekly",
          critical: critical,
          [startTimeField.field_name]:
            startTime && startTime !== null
              ? startTime.startOf("minute").toISOString()
              : startTime,
          [startDateField.field_name]:
            startDate && startDate !== null
              ? startDate
                .clone()
                .startOf("day")
                .toISOString()
              : startDate,
          [endDateField.field_name]:
            endDate && endDate !== null
              ? endDate
                .clone()
                .endOf("day")
                .toISOString()
              : endDate
        };

        if (repeatDays) {
          data_to_submit = {
            ...data_to_submit,
            [repeatDaysField.field_name]: repeatDays.split(",")
          };

        }
        try {
          const response = await addMedicationReminder(data_to_submit);
          const { status, payload: { message: msg } = {} } = response;
          if (status === true) {
            message.success(msg);
          } else {
            message.error(msg);
          }
        } catch (error) {
          console.log("add medication reminder ui error -----> ", error);
        }
      }
    });
  };

  // onPatientChange = () => {
  //   const {
  //     form: { setFieldsValue },
  //     fetchProgramProducts,
  //     fetchMedicationStages
  //   } = this.props;

  //   const otherUser = this.getOtherUser();

  //   if (otherUser) {
  //     const {
  //       basicInfo: { _id },
  //       programId = []
  //     } = otherUser;
  //     fetchProgramProducts(programId[0]);
  //     fetchMedicationStages(_id).then(response => {
  //       const { status, payload } = response;
  //       if (status) {
  //         const {
  //           data: { medicationStages = [], program_has_medication_stage } = {}
  //         } = payload;
  //         if (medicationStages.length > 0) {
  //           this.setState({
  //             medicationStages: medicationStages,
  //             program_has_medication_stage
  //           });
  //         } else {
  //           this.setState({
  //             medicationStages: [],
  //             program_has_medication_stage
  //           });
  //         }
  //       }
  //     });
  //     setFieldsValue({ [chooseMedicationField.field_name]: null });
  //   }
  // };

  getFooter = () => {
    const {
      form: { getFieldsError },
      requesting
    } = this.props;
    const { formatMessage, handleCancel } = this;

    return (
      <div className="footer">
        <div className="flex fr h100">
          <FormItem className="m0">
            <Button
              className="ant-btn ant-btn-primary pr30 pl30 mt46"
              type="primary"
              htmlType="submit"
              loading={requesting}
              disabled={hasErrors(getFieldsError())}
            >
              {formatMessage(messages.addMedicationReminder)}
            </Button>
          </FormItem>
        </div>
      </div>
    );
  };

  setUnit = e => {
    e.preventDefault();
    const {
      form: { setFieldsValue, getFieldValue }
    } = this.props;
    console.log('738467386587346578234625834 called', getFieldValue(UNIT_FIELD), e.target.value);

    setFieldsValue({ [UNIT_FIELD]: e.target.value });
  };

  setUnitByMedicineType = unit => {
    const {
      form: { setFieldsValue, getFieldValue }
    } = this.props;
    setFieldsValue({ [UNIT_FIELD]: unit });

  }

  render() {
    const {
      getFooter,
      disabledEndDate,
      disabledStartDate,
      adjustEndDate,
      onChangeEventStartTime,
      adjustEventOnStartDateChange,
      onEventDurationChange,
      onPrev,
      onNext,
      onStartDateChange,
      addMedicationReminder,
      onPatientChange,
      formatMessage,
      setUnit,
      setUnitByMedicineType
    } = this;

    const {
      form: { getFieldValue },
      medicines
    } = this.props;

    const otherUser = this.getOtherUser();

    const startTime = getFieldValue(startTimeField.field_name);

    let medicineUnit = getFieldValue(medicineStrengthUnitField.field_name);


    console.log('478562897346578925782935', medicineUnit);

    let endTime;

    if (startTime && startTime.isValid) {
      endTime = startTime.clone().add("minutes", 3);
    }

    const startDate = getFieldValue(startDateField.field_name);

    return (
      <Fragment>
        <Form className="event-form pb80 wp100">
          {/* {participantsField.render({
            ...this.props,
            otherUser,
            onPatientChange
          })}

          {medicationReminderStageField.render({
            ...this.props,
            ...this.state
          })} */}

          {chooseMedicationField.render({ ...this.props, otherUser })}
          {criticalMedicationField.render(this.props)}


          {/* <div className="flex align-items-end justify-content-space-between">
            <label
              for="dose"
              className="form-label flex-grow-1"
              title="Dose"
            >
              {formatMessage(messages.dose)}
            </label>
          </div> */}

          <div className="flex align-items-end justify-content-space-between">
            <label
              for="dose"
              className="form-label flex-grow-1"
              title="Dose"
            >
              {formatMessage(messages.dose)}
            </label>
            {/* <div className="label-color fontsize12 mb8">
              
            </div> */}
            <div className="mg-ml-radio-group flex-grow-0">
              <RadioGroup
                size="small"
                className="mg-ml flex justify-content-end"
              >
                <RadioButton value={UNIT_ML} className={medicineUnit !== 'ml' ? `unselected-text` : ''} onClick={setUnit}>ml</RadioButton>
                <RadioButton value={UNIT_MG} className={medicineUnit !== 'mg' ? `unselected-text` : ''} onClick={setUnit}>mg</RadioButton>
              </RadioGroup>
            </div>
          </div>
          {/* <span className="form-label flex-grow-1">Dose</span> */}
          <InputGroup compact>
            {medicineStrengthField.render(this.props)}
            {medicineStrengthUnitField.render(this.props)}
          </InputGroup>

          {medicineUnit !== 'ml' && (<div id="quantity">{medicineQuantityField.render(this.props)}</div>)}

          <div id="timing">{whenToTakeMedicineField.render(this.props)}</div>

          <RepeatFields
            {...this.props}
            adjustEventOnStartDateChange={adjustEventOnStartDateChange}
            disabledEndDate={disabledEndDate}
            disabledStartDate={disabledStartDate}
            adjustEndDate={adjustEndDate}
          />

          {/*{getFooter()}*/}
        </Form>
      </Fragment>
    );
  }
}

export default AddMedicationReminderForm;
