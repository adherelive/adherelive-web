import React, { Component, Fragment } from "react";
import { Form, Button, message } from "antd";
import moment from "moment";
import messages from "../message";
import { hasErrors, isNumber } from "../../../../Helper/validation";
import vitalNameField from "../common/vitalName";
import repeatField from "../common/repeatType";
import repeatDaysField from "../common/selectedDays";
import repeatIntervalField from "../common/repeatInterval";
import vitalOccurenceField from "../common/vitalOccurence";
import instructions from "../common/instructions";
import RepeatFields from "../common/repeatFields";
import startDateField from "../common/startDate";
import endDateField from "../common/endDate";
import startTimeField from "../common/startTime";
import {
  REPEAT_TYPE,
  USER_CATEGORY,
  DAYS_NUMBER,
  DAYS,
  ALTERNATE_DAYS,
} from "../../../../constant";

const { Item: FormItem } = Form;

class AddvitalsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.scrollToTop();
    const {
      form: { validateFields },
      // currentUser: {
      //   basicInfo: { _id, category },
      //   programId = []
      // },
      fetchMedicationStages,
      fetchProgramProducts,
    } = this.props;
    const { programId } = [];
    const { _id } = "23";
    const { category } = "PATIENT";
    validateFields();

    if (category === USER_CATEGORY.PATIENT) {
      fetchProgramProducts(programId[0]);
      fetchMedicationStages(_id).then((response) => {
        const { status, payload } = response;
        if (status) {
          const {
            data: { medicationStages = [], program_has_medication_stage } = {},
          } = payload;
          if (medicationStages.length > 0) {
            this.setState({
              medicationStages: medicationStages,
              program_has_medication_stage,
            });
          } else {
            this.setState({
              medicationStages: [],
              program_has_medication_stage,
            });
          }
        }
      });
    }
  }

  scrollToTop = () => {
    let antForm = document.getElementsByClassName("Form")[0];
    let antDrawerBody = antForm.parentNode;
    let antDrawerWrapperBody = antDrawerBody.parentNode;
    antDrawerBody.scrollIntoView(true);
    antDrawerWrapperBody.scrollTop -= 200;
  };
  formatMessage = (data) => this.props.intl.formatMessage(data);

  handleCancel = (e) => {
    if (e) {
      e.preventDefault();
    }
    const { close } = this.props;
    close();
  };

  getFooter = () => {
    const {
      form: { getFieldsError },
      requesting,
    } = this.props;
    const { formatMessage } = this;

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

  getNewEndDate = (repeatValue) => {
    const {
      form: { getFieldValue },
    } = this.props;

    let repeat = getFieldValue(repeatField.field_name);

    let selectedDays = getFieldValue(repeatDaysField.field_name);
    let repeatInterval = getFieldValue(repeatIntervalField.field_name);

    if (repeatValue) {
      repeatInterval = repeatValue;
    }

    // if(!repeat){

    // }

    const startDate = getFieldValue(startDateField.field_name);
    let startDateDay = startDate
      ? moment(startDate).format("ddd")
      : moment().format("ddd");
    let startDayNumber = DAYS_NUMBER[startDateDay];
    let dayDiffPos = 0;
    let dayDiffNeg = 0;
    let daysToAdd = 0;
    if (selectedDays.length) {
      // if (selectedDays.length === 1) {
      //   selectedDays = [selectedDays];
      // }
      // selectedDays = selectedDays.split(',');
      for (let day of selectedDays) {
        let dayNo = DAYS_NUMBER[day];
        let dayDiff = dayNo - startDayNumber;

        dayDiffPos =
          dayDiffPos === 0 && dayDiff > 0
            ? dayDiff
            : dayDiff > 0 && dayDiff < dayDiffPos
            ? dayDiff
            : dayDiffPos;
        dayDiffNeg =
          dayDiffNeg === 0 && dayDiff < 0
            ? dayDiff
            : dayDiff < 0 && Math.abs(dayDiff) > Math.abs(dayDiffNeg)
            ? dayDiff
            : dayDiffNeg;
      }

      daysToAdd = dayDiffPos ? dayDiffPos : 7 + dayDiffNeg;
    }

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

    if (!newEndDate) {
      newEndDate = startDateCopy;
    }

    return moment(newEndDate).add(daysToAdd, "days");
  };

  adjustEndDate = (repeatValue) => {
    const {
      form: { setFieldsValue },
    } = this.props;
    const endDate = this.getNewEndDate(repeatValue);
    if (endDate) {
      setFieldsValue({ [endDateField.field_name]: endDate });
    }
  };

  adjustEventOnStartDateChange = (prevDate) => {
    const {
      form: { getFieldValue, setFieldsValue, validateFields },
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
      [startTimeField.field_name]: newEventStartTime,
    });
    // this.adjustEndDate();
    validateFields([startTimeField.field_name]);
  };

  disabledStartDate = (current) => {
    // Can not select days before today
    return current && current <= moment().subtract({ day: 1 });
  };

  disabledEndDate = (current) => {
    const endDate = this.getNewEndDate();
    if (endDate) {
      return current && current < endDate;
    }
  };

  setEndDateOneWeek = (e) => {
    e.preventDefault();
    const {
      form: { setFieldsValue, getFieldValue },
    } = this.props;

    const startDate = getFieldValue(startDateField.field_name);
    let newEndDate = moment(startDate).add(1, "week");
    setFieldsValue({
      [endDateField.field_name]: newEndDate,
    });
  };

  setRepeatEveryDay = (e) => {
    e.preventDefault();
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({
      [repeatDaysField.field_name]: DAYS,
    });
  };

  setRepeatAlternateDay = (e) => {
    e.preventDefault();
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({
      [repeatDaysField.field_name]: ALTERNATE_DAYS,
    });
  };

  setEndDateTwoWeek = (e) => {
    e.preventDefault();
    const {
      form: { setFieldsValue, getFieldValue },
    } = this.props;

    const startDate = getFieldValue(startDateField.field_name);
    let newEndDate = moment(startDate).add(2, "week");
    setFieldsValue({
      [endDateField.field_name]: newEndDate,
    });
  };

  setEndDateLongTime = (e) => {
    e.preventDefault();
    const {
      form: { setFieldsValue },
    } = this.props;

    setFieldsValue({
      [endDateField.field_name]: null,
    });
  };

  render() {
    const {
      adjustEventOnStartDateChange,
      disabledStartDate,
      disabledEndDate,
      adjustEndDate,
      setEndDateOneWeek,
      setEndDateTwoWeek,
      setEndDateLongTime,
      setRepeatEveryDay,
      setRepeatAlternateDay,
      formatMessage,
    } = this;

    const {
      form: { getFieldValue },
      medicines,
    } = this.props;

    return (
      <Fragment>
        <Form className="event-form pb80 wp100 Form">
          <div className="flex direction-row flex-grow-1">
            <label
              htmlFor="vital_template"
              className="form-label"
              title="Vital"
            >
              {formatMessage(messages.vitals)}
            </label>

            <div className="star-red">*</div>
          </div>
          {vitalNameField.render({ ...this.props })}
          <div className="flex direction-row flex-grow-1">
            <label
              htmlFor="vital_template"
              className="form-label"
              title="Vital"
            >
              {formatMessage(messages.occurence)}
            </label>

            <div className="star-red">*</div>
          </div>
          {vitalOccurenceField.render({ ...this.props })}
          <RepeatFields
            {...this.props}
            formatMessage={formatMessage}
            adjustEventOnStartDateChange={adjustEventOnStartDateChange}
            disabledEndDate={disabledEndDate}
            disabledStartDate={disabledStartDate}
            adjustEndDate={adjustEndDate}
            setEndDateOneWeek={setEndDateOneWeek}
            setRepeatEveryDay={setRepeatEveryDay}
            setEndDateTwoWeek={setEndDateTwoWeek}
            setRepeatAlternateDay={setRepeatAlternateDay}
            setEndDateLongTime={setEndDateLongTime}
          />
          {instructions.render(this.props)}
        </Form>
      </Fragment>
    );
  }
}

export default AddvitalsForm;
