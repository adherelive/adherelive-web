import React, { Component, Fragment } from "react";
import { Form, Button } from "antd";
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
import medicineStrengthUnitField from "../common/medicationStrengthUnit";
import medicineQuantityField from "../common/medicineQuantity";
import whenToTakeMedicineField from "../common/whenTotakeMedicaine";
import medicationReminderStageField from "../common/medicationStage";

import CalendarTimeSelection from "../calendarTimeSelection";

import messages from "../message";
import { hasErrors, isNumber } from "../../../../Helper/validation";
import { REPEAT_TYPE, USER_CATEGORY } from "../../../../constant";

const { Item: FormItem } = Form;

class AddMedicationReminderForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {
      form: { validateFields },
      currentUser: {
        basicInfo: { _id, category },
        programId = []
      },
      fetchMedicationStages,
      fetchProgramProducts
    } = this.props;
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

    const repeat = getFieldValue(repeatField.field_name);

    let repeatInterval = getFieldValue(repeatIntervalField.field_name);

    if (repeatValue) {
      repeatInterval = repeatValue;
    }

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

  onChangeEventStartTime = startTime => {};

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
    if (endDate) {
      return current && current < endDate;
    }
  };

  onEndDateChange = () => {};

  onStartTimeChange = () => {};

  onEndTimeChange = () => {};

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
      addMedicationReminder
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        let data_to_submit = {};
        const startTime = values[startTimeField.field_name];
        const startDate = values[startDateField.field_name];
        const endDate = values[endDateField.field_name];
        const repeatDays = values[repeatDaysField.field_name];
        data_to_submit = {
          ...values,
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

        addMedicationReminder(data_to_submit);
      }
    });
  };

  onPatientChange = () => {
    const {
      form: { setFieldsValue },
      fetchProgramProducts,
      fetchMedicationStages
    } = this.props;

    const otherUser = this.getOtherUser();

    if (otherUser) {
      const {
        basicInfo: { _id },
        programId = []
      } = otherUser;
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
      setFieldsValue({ [chooseMedicationField.field_name]: null });
    }
  };

  getFooter = () => {
    const {
      form: { getFieldsError },
      requesting
    } = this.props;
    const { formatMessage, handleCancel } = this;

    return (
      <div className="footer">
        <div className="flex align-items-center justify-content-end h100 mr24">
          <Button className="iqvia-btn cancel mr16" onClick={handleCancel}>
            {formatMessage(messages.cancel)}
          </Button>
          <FormItem className="m0">
            <Button
              className="iqvia-btn"
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
      onPatientChange
    } = this;

    const {
      form: { getFieldValue }
    } = this.props;

    const otherUser = this.getOtherUser();

    const startTime = getFieldValue(startTimeField.field_name);
    let endTime;

    if (startTime && startTime.isValid) {
      endTime = startTime.clone().add("minutes", 3);
    }

    const startDate = getFieldValue(startDateField.field_name);

    return (
      <Fragment>
        <Form className="event-form" onSubmit={addMedicationReminder}>
          {participantsField.render({
            ...this.props,
            otherUser,
            onPatientChange
          })}

          {medicationReminderStageField.render({
            ...this.props,
            ...this.state
          })}

          {chooseMedicationField.render({ ...this.props, otherUser })}

          <div className="flex column ">
            <div className="flex align-items-center">
              <div className="wp50  flex-1 mr8">
                {medicineStrengthField.render(this.props)}
              </div>
              <div className="wp50 flex-1 ml8 align-self-end">
                {medicineStrengthUnitField.render(this.props)}
              </div>
            </div>
          </div>

          {medicineQuantityField.render(this.props)}

          {whenToTakeMedicineField.render(this.props)}

          <RepeatFields
            {...this.props}
            adjustEventOnStartDateChange={adjustEventOnStartDateChange}
            disabledEndDate={disabledEndDate}
            disabledStartDate={disabledStartDate}
            adjustEndDate={adjustEndDate}
          />

          <div className="flex align-items-center justify-content-space-between">
            {startTimeField.render({ ...this.props, onChangeEventStartTime })}
          </div>

          {notesField.render(this.props)}

          {getFooter()}
        </Form>
        <CalendarTimeSelection
          className="calendar-section"
          eventEndTime={endTime}
          eventStartTime={startTime}
          onEventDurationChange={onEventDurationChange}
          startDate={startDate}
          onStartDateChange={onStartDateChange}
          disabledStartDate={disabledStartDate}
          onPrev={onPrev}
          onNext={onNext}
          bookedEvents={[]}
          otherUser={otherUser}
        />
      </Fragment>
    );
  }
}

export default AddMedicationReminderForm;
