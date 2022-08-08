import { Drawer } from "antd";
import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import {
  MEDICATION_TIMING,
  DAYS_TEXT_NUM_SHORT,
  EVENT_TYPE,
  MEDICATION_TIMING_HOURS,
  MEDICATION_TIMING_MINUTES,
  TABLET,
  SYRUP,
  MEDICINE_UNITS,
  USER_CATEGORY,
} from "../../../constant";
import moment from "moment";
import message from "antd/es/message";
import Icon from "antd/es/icon";
import Button from "antd/es/button";
import EditMedicationReminder from "../../../Containers/Drawer/editMedicationReminder";
import EditAppointmentDrawer from "../../../Containers/Drawer/editAppointment";
import EditVitalDrawer from "../../../Containers/Drawer/editVitals";
import EditDietDrawer from "../../../Containers/Drawer/editDiet";
import EditWorkoutDrawer from "../../../Containers/Drawer/editWorkout";

import confirm from "antd/es/modal/confirm";
import TabletIcon from "../../../Assets/images/tabletIcon3x.png";
import InjectionIcon from "../../../Assets/images/injectionIcon3x.png";
import SyrupIcon from "../../../Assets/images/pharmacy.png";
import uuid from "react-uuid";
import messages from "./message";
import Input from "antd/es/input";
import { Switch } from "antd";
import Footer from "../footer";

class TemplatePageCreateDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showInner: false,
      medications: {},
      appointments: {},
      vitals: {},
      diets: {},
      workouts: {},
      medicationKeys: [],
      appointmentKeys: [],
      vitalKeys: [],
      dietKeys: [],
      workoutKeys: [],
      innerFormKey: "",
      innerFormType: "",
      name: "",
      showAddMedicationInner: false,
      showAddAppointmentInner: false,
      showAddVitalInner: false,
      showAddDietInner: false,
      showAddWorkoutInner: false,
      showAreYouSureModal: false,
      submitting: false,
      isDietVisible: false,
      isWorkoutVisible: false,
      templateIsPrivate: false,
    };
  }

  componentDidMount() {}

  formatMessage = (data) => this.props.intl.formatMessage(data);

  showInnerForm = (innerFormType, innerFormKey) => () => {
    if (innerFormType === EVENT_TYPE.DIET) {
      this.setState({ isDietVisible: true });
    } else if (innerFormType === EVENT_TYPE.WORKOUT) {
      this.setState({ isWorkoutVisible: true });
    }
    this.setState({ innerFormType, innerFormKey, showInner: true });
  };

  onCloseInner = () => {
    this.setState({
      showInner: false,
      isDietVisible: false,
      isWorkoutVisible: false,
    });
  };

  showAddMedication = () => {
    this.setState({ showAddMedicationInner: true });
  };

  closeAddMedication = () => {
    this.setState({ showAddMedicationInner: false });
  };

  showAddAppointment = () => {
    this.setState({ showAddAppointmentInner: true });
  };

  closeAddAppointment = () => {
    this.setState({ showAddAppointmentInner: false });
  };

  showAddVital = () => {
    this.setState({ showAddVitalInner: true });
  };

  closeAddVital = () => {
    this.setState({ showAddVitalInner: false });
  };

  showAddDiet = () => {
    this.setState({
      showAddDietInner: true,
      isDietVisible: true,
    });
  };

  closeAddDiet = () => {
    this.setState({
      showAddDietInner: false,
      isDietVisible: false,
    });
  };

  showAddWorkout = () => {
    this.setState({
      showAddWorkoutInner: true,
      isWorkoutVisible: true,
    });
  };

  closeAddWorkout = () => {
    this.setState({
      showAddWorkoutInner: false,
      isWorkoutVisible: false,
    });
  };

  deleteMedication = (key) => () => {
    let { medications = {}, medicationKeys = [] } = this.state;
    delete medications[key];
    medicationKeys.splice(medicationKeys.indexOf(key), 1);
    this.setState({ medications, medicationKeys });
  };

  deleteAppointment = (key) => () => {
    let { appointments = {}, appointmentKeys = [] } = this.state;
    delete appointments[key];
    appointmentKeys.splice(appointmentKeys.indexOf(key), 1);
    this.setState({ appointments, appointmentKeys });
  };

  deleteVital = (key) => () => {
    let { vitals = {}, vitalKeys = [] } = this.state;
    delete vitals[key];
    vitalKeys.splice(vitalKeys.indexOf(key), 1);
    this.setState({ vitals, vitalKeys });
  };

  deleteDiet = (key) => () => {
    let { diets = {}, dietKeys = [] } = this.state;
    delete diets[key];
    dietKeys.splice(dietKeys.indexOf(key), 1);
    this.setState({ diets, dietKeys });
  };

  deleteWorkout = (key) => () => {
    let { workouts = {}, workoutKeys = [] } = this.state;
    delete workouts[key];
    workoutKeys.splice(workoutKeys.indexOf(key), 1);
    this.setState({ workouts, workoutKeys });
  };

  deleteEntry = () => {
    let {
      appointments = {},
      appointmentKeys = [],
      medications = {},
      diets = {},
      workouts = {},
      medicationKeys = [],
      vitals = {},
      vitalKeys = [],
      dietKeys = [],
      workoutKeys = [],
      innerFormType = "",
      innerFormKey = "",
    } = this.state;

    if (innerFormType == EVENT_TYPE.MEDICATION_REMINDER) {
      delete medications[innerFormKey];
      medicationKeys.splice(medicationKeys.indexOf(innerFormKey), 1);
    } else if (innerFormType == EVENT_TYPE.APPOINTMENT) {
      delete appointments[innerFormKey];
      appointmentKeys.splice(appointmentKeys.indexOf(innerFormKey), 1);
    } else if (innerFormType == EVENT_TYPE.VITALS) {
      delete vitals[innerFormKey];
      vitalKeys.splice(vitalKeys.indexOf(innerFormKey), 1);
    } else if (innerFormType == EVENT_TYPE.DIET) {
      delete diets[innerFormKey];
      dietKeys.splice(dietKeys.indexOf(innerFormKey), 1);
    } else if (innerFormType == EVENT_TYPE.WORKOUT) {
      delete workouts[innerFormKey];
      workoutKeys.splice(workoutKeys.indexOf(innerFormKey), 1);
    }

    this.setState({
      appointments,
      appointmentKeys,
      medications,
      medicationKeys,
      vitals,
      vitalKeys,
      diets,
      dietKeys,
      workouts,
      workoutKeys,
      templateEdited: true,
    });
    this.onCloseInner();
  };

  setTemplateName = (event) => {
    this.setState({ name: event.target.value, templateEdited: true });
  };

  validateData = (
    medicationsData,
    appointmentsData,
    vitalsData,
    dietData,
    workoutData,
    name
  ) => {
    if (!name) {
      message.error(this.formatMessage(messages.giveName));
      return false;
    }

    for (let medication of medicationsData) {
      const {
        medicine_id = "",
        schedule_data: {
          unit = "",
          repeat = "",
          duration = null,
          quantity = "",
          strength = "",
          repeat_days = [],
          when_to_take = [],
          when_to_take_abbr = "",
          medicine_type = "",
          description = "",
        } = {},
      } = medication || {};

      // console.log("198623861283 check", {
      //    condition: !medicine_id || !unit || !repeat || (unit !== MEDICINE_UNITS.ML && !quantity) ||  !repeat_days.length ||
      //        !medicine_type || (!duration && duration !== null) || !strength  || !when_to_take.length,
      //     otherCondition: unit !== MEDICINE_UNITS.ML && !quantity,
      //     medicine_id,
      //     unit,
      //     repeat,
      //     quantity,
      //     repeat_days,
      //     medicine_type,
      //     strength,
      //     duration,
      //     when_to_take
      // });

      if (
        !medicine_id ||
        !unit ||
        !repeat ||
        (unit !== MEDICINE_UNITS.ML && !quantity) ||
        (when_to_take.length > 0 && !repeat_days.length) ||
        !medicine_type ||
        (!duration && duration !== null) ||
        !strength
      ) {
        //    console.log("8932648723648723462387",{flag1:!medicine_type,flag2:(!duration && duration !== null),flag3:!strength});
        message.error("Medication Error");
        return false;
      }
    }

    for (let appointment of appointmentsData) {
      const {
        reason = "",
        time_gap = null,
        details: {
          date = "",
          critical = "",
          description = "",
          appointment_type = "",
          type_description = "",
        } = {},
        provider_id = "",
        provider_name = "",
      } = appointment || {};

      if (
        !reason ||
        (!time_gap && time_gap !== null) ||
        !date ||
        !appointment_type ||
        !type_description ||
        !provider_id
      ) {
        message.error(this.formatMessage(messages.appointmentError));

        return false;
      }
    }

    for (let vital of vitalsData) {
      const {
        vital_template_id,
        details: {
          duration,
          description,
          repeat_days,
          repeat_interval_id,
        } = {},
      } = vital;

      if (
        !vital_template_id ||
        (!duration && duration !== null) ||
        !vital_template_id ||
        !repeat_days ||
        !repeat_interval_id
      ) {
        message.error(this.formatMessage(messages.vitalError));

        return false;
      }
    }

    for (let diet of dietData) {
      const {
        name = "",
        duration = null,
        details: { repeat_days = [], diet_food_groups = {} } = {},
      } = diet;

      if (
        repeat_days.length === 0 ||
        !name ||
        Object.keys(diet_food_groups).length === 0
      ) {
        message.error(this.formatMessage(messages.dietError));

        return false;
      }
    }

    for (let workout of workoutData) {
      const {
        name = "",
        duration = null,
        time = null,
        details: { repeat_days = [], workout_exercise_groups = {} } = {},
      } = workout;

      if (
        !time ||
        repeat_days.length === 0 ||
        !name ||
        Object.keys(workout_exercise_groups).length === 0
      ) {
        message.error(this.formatMessage(messages.workoutError));

        return false;
      }
    }

    return true;
  };

  onSubmit = async () => {
    let {
      medications = {},
      appointments = {},
      vitals = {},
      diets = {},
      workouts = {},
      name = "",
    } = this.state;
    const { createCareplanTemplate, close, authenticated_category } =
      this.props;
    let medicationsData = Object.values(medications);
    let appointmentsData = Object.values(appointments);
    let vitalsData = Object.values(vitals);
    let dietData = Object.values(diets);
    let workoutData = Object.values(workouts);
    let is_public_in_provider = this.state.templateIsPrivate === true ? 1 : 0;

    if (
      authenticated_category === USER_CATEGORY.HSP &&
      Object.keys(medications).length
    ) {
      message.error(this.formatMessage(messages.medicationAccessError));
      return;
    }

    let validate = this.validateData(
      medicationsData,
      appointmentsData,
      vitalsData,
      dietData,
      workoutData,
      name
    );
    if (validate) {
      try {
        this.setState({ submitting: true });
        const response = await createCareplanTemplate({
          medicationsData,
          appointmentsData,
          vitalsData,
          dietData,
          workoutData,
          name,
          is_public_in_provider,
        });
        const {
          payload: { data = {}, message: res_msg = "" },
          status,
          statusCode,
        } = response || {};
        if (status) {
          message.success(res_msg);
          this.setState({
            showInner: false,
            medications: {},
            appointments: {},
            vitals: {},
            diets: {},
            workouts: {},
            medicationKeys: [],
            appointmentKeys: [],
            vitalKeys: [],
            dietKeys: [],
            workoutKeys: [],
            innerFormKey: "",
            innerFormType: "",
            name: "",
            showAddMedicationInner: false,
            showAddAppointmentInner: false,
            showAddVitalInner: false,
            showAddDietInner: false,
            showWorkoutInner: false,
            showAreYouSureModal: false,
          });
          close();
        } else {
          message.error(res_msg);
        }
        this.setState({ submitting: false });
      } catch (error) {
        console.log("error -->", error);
        this.setState({ submitting: false });
        message.warn(error);
      }
    }
  };

  warnNote = () => {
    return (
      <div className="pt16">
        <p className="red">
          <span className="fw600">{this.formatMessage(messages.note)}</span>
          {` : ${this.formatMessage(messages.warnMessage)}`}
        </p>
      </div>
    );
  };

  handleCloseWarning = () => {
    const { warnNote } = this;
    const { close } = this.props;

    confirm({
      title: `${this.formatMessage(messages.closeMessage)}`,
      content: <div>{warnNote()}</div>,
      onOk: async () => {
        this.setState({
          showInner: false,
          medications: {},
          appointments: {},
          vitals: {},
          diets: {},
          workouts: {},
          medicationKeys: [],
          appointmentKeys: [],
          vitalKeys: [],
          dietKeys: [],
          workoutKeys: [],
          innerFormKey: "",
          innerFormType: "",
          name: "",
          showAddMedicationInner: false,
          showAddAppointmentInner: false,
          showAddVitalInner: false,
          showAddDietInner: false,
          showAddWorkoutInner: false,
          showAreYouSureModal: false,
        });

        close();
      },
      onCancel() {},
    });
  };

  onClose = () => {
    const { close } = this.props;
    const {
      name = "",
      medicationKeys = [],
      appointmentKeys = [],
      vitalKeys = [],
      dietKeys = [],
      workoutKeys = [],
    } = this.state;
    if (
      name ||
      medicationKeys.length ||
      appointmentKeys.length ||
      vitalKeys.length ||
      dietKeys.length ||
      workoutKeys.length
    ) {
      this.handleCloseWarning();
      return;
    }

    this.setState({
      showInner: false,
      medications: {},
      appointments: {},
      vitals: {},
      diets: {},
      workouts: {},
      medicationKeys: [],
      appointmentKeys: [],
      vitalKeys: [],
      dietKeys: [],
      workoutKeys: [],
      innerFormKey: "",
      innerFormType: "",
      name: "",
      showAddMedicationInner: false,
      showAddAppointmentInner: false,
      showAddVitalInner: false,
      showAddDietInner: false,
      showAddWorkoutInner: false,
      showAreYouSureModal: false,
    });

    close();
  };

  onChangeTemplateShare = (checked) => {
    console.log(`switch to ${checked}`);
    this.setState({
      templateIsPrivate: !this.state.templateIsPrivate,
    });
  };

  renderTemplateDetails = () => {
    const {
      medications = {},
      appointments = {},
      vitals = {},
      diets = {},
      workouts = {},
      medicationKeys = [],
      appointmentKeys = [],
      vitalKeys = [],
      dietKeys = [],
      workoutKeys = [],
      carePlanTemplateIds = [],
    } = this.state;

    const {
      care_plan_templates = {},
      repeat_intervals = {},
      vital_templates = {},
      medicines = {},
      doctor_provider_id,
    } = this.props;

    console.log(doctor_provider_id);

    return (
      <div className="template-block">
        <div className="wp100 flex direction-row align-center ">
          <div className="form-category-headings-ap mr0-I">
            {this.formatMessage(messages.name_text)}
          </div>
          <div className="star-red fs22">*</div>
        </div>

        <div className="wp100 flex align-center justify-space-between">
          <Input
            placeholder={this.formatMessage(messages.namePlaceholder)}
            className={"form-inputs wp100 "}
            onChange={this.setTemplateName}
            style={{ width: "100%", alignSelf: "flex-start" }}
            required={true}
          />
        </div>

        <div className="wp100 flex align-center justify-space-between">
          <div className="form-category-headings-ap ">{"Medications"}</div>
          {medicationKeys.length > 0 ? (
            <div className="add-more" onClick={this.showAddMedication}>
              {this.formatMessage(messages.addMore)}
            </div>
          ) : (
            <div className="add-more" onClick={this.showAddMedication}>
              {this.formatMessage(messages.add)}
            </div>
          )}
        </div>

        {medicationKeys.map((key) => {
          let {
            medicine_id = "",
            schedule_data: {
              start_date = moment(),
              unit = "",
              repeat = "",
              duration = null,
              quantity = "",
              strength = "",
              repeat_days = [],
              when_to_take = "",
              medicine_type = "",
              when_to_take_abbr = "",
            } = {},
          } = medications[key];

          const { basic_info: { name: medicine = "" } = {} } =
            medicines[medicine_id] || {};

          when_to_take.sort();
          let nextDueTime = moment().format("HH:MM A");
          let closestWhenToTake = 0;
          let minDiff = 0;

          const date = moment();
          const dow = date.day();
          let dayNum = dow;

          if (
            typeof DAYS_TEXT_NUM_SHORT[dow] !== "undefined" &&
            !repeat_days.includes(DAYS_TEXT_NUM_SHORT[dow])
          ) {
            while (
              typeof DAYS_TEXT_NUM_SHORT[dayNum] !== "undefined" &&
              !repeat_days.includes(DAYS_TEXT_NUM_SHORT[dayNum])
            ) {
              if (dayNum > 7) {
                dayNum = 1;
              } else {
                dayNum++;
              }
            }
            start_date = moment().isoWeekday(dayNum);
          }

          if (moment(start_date).isSame(moment(), "D")) {
            if (when_to_take.length > 0) {
              for (let wtt of when_to_take) {
                let newMinDiff = moment()
                  .set({
                    hour: MEDICATION_TIMING_HOURS[wtt],
                    minute: MEDICATION_TIMING_MINUTES[wtt],
                  })
                  .diff(moment());
                minDiff =
                  minDiff === 0 && newMinDiff > 0
                    ? newMinDiff
                    : newMinDiff > 0 && newMinDiff < minDiff
                    ? newMinDiff
                    : minDiff;
                closestWhenToTake =
                  minDiff === newMinDiff ? wtt : closestWhenToTake;
              }
            }
          }
          let medTimingsToShow = "";

          if (when_to_take.length > 0) {
            for (let wtt in when_to_take) {
              let timing_temp = MEDICATION_TIMING[when_to_take[wtt]];
              let txt = "";
              let time_temp = "";
              if (timing_temp) {
                txt = MEDICATION_TIMING[when_to_take[wtt]].text;
                time_temp = MEDICATION_TIMING[when_to_take[wtt]].time;
              }
              medTimingsToShow += `${txt} `;
              medTimingsToShow += `(${time_temp})${
                wtt < when_to_take.length - 1 ? ", " : ""
              }`;
            }
          }
          console.log("0237127301 closestWhenToTake", closestWhenToTake);

          // todo: change later when re-fractoring

          let nextDue = null;

          if (when_to_take.length > 0) {
            nextDueTime =
              MEDICATION_TIMING[closestWhenToTake ? closestWhenToTake : "4"]
                .time;
            nextDue = moment(start_date).isSame(moment(), "D")
              ? `Today at ${nextDueTime}`
              : `${moment(start_date).format("D MMM")} at ${
                  MEDICATION_TIMING[when_to_take[0]].time
                }`;
          } else {
            nextDue = this.formatMessage(messages.sosMessage);
          }

          return (
            <div className="flex wp100 flex-grow-1 align-center" key={key}>
              <div className="drawer-block">
                <div className="flex direction-row justify-space-between align-center">
                  <div className="flex align-center">
                    <div className="form-headings-ap">
                      {medicine ? medicine : "MEDICINE"}
                    </div>
                    {medicine_type && (
                      <img
                        src={
                          medicine_type === TABLET
                            ? TabletIcon
                            : medicine_type === SYRUP
                            ? SyrupIcon
                            : InjectionIcon
                        }
                        className={"medication-image-tablet"}
                      />
                    )}
                  </div>

                  <Icon
                    type="edit"
                    className="ml20"
                    style={{ color: "#4a90e2" }}
                    theme="filled"
                    onClick={this.showInnerForm(
                      EVENT_TYPE.MEDICATION_REMINDER,
                      key
                    )}
                  />
                </div>

                <div className="drawer-block-description">
                  {medTimingsToShow}
                </div>
                <div className="drawer-block-description">{`Next due: ${nextDue}`}</div>
              </div>
            </div>
          );
        })}

        <div className="wp100 flex align-center justify-space-between">
          <div className="form-category-headings-ap align-self-start">
            {this.formatMessage(messages.appointments)}
          </div>
          {appointmentKeys.length > 0 ? (
            <div className="add-more" onClick={this.showAddAppointment}>
              {this.formatMessage(messages.addMore)}
            </div>
          ) : (
            <div className="add-more" onClick={this.showAddAppointment}>
              {this.formatMessage(messages.add)}
            </div>
          )}
        </div>
        {appointmentKeys.map((key) => {
          let {
            reason = "",
            details: { description = "", date = "" } = {},
            time_gap = "",
          } = appointments[key];

          return (
            <div className="flex wp100 flex-grow-1 align-center" key={key}>
              <div className="drawer-block">
                <div className="flex direction-row justify-space-between align-center">
                  <div className="form-headings-ap">{reason}</div>
                  <Icon
                    type="edit"
                    className="ml20"
                    style={{ color: "#4a90e2" }}
                    theme="filled"
                    onClick={this.showInnerForm(EVENT_TYPE.APPOINTMENT, key)}
                  />
                </div>
                <div className="drawer-block-description">
                  {date
                    ? `After ${moment(date).diff(moment(), "days") + 1} days`
                    : time_gap
                    ? `After ${time_gap} days`
                    : ""}
                </div>
                <div className="drawer-block-description">{`Notes:${description}`}</div>
              </div>
            </div>
          );
        })}

        <div className="wp100 flex align-center justify-space-between">
          <div className="form-category-headings-ap align-self-start">
            {this.formatMessage(messages.actions)}
          </div>
          {vitalKeys.length > 0 ? (
            <div className="add-more" onClick={this.showAddVital}>
              {this.formatMessage(messages.addMore)}
            </div>
          ) : (
            <div className="add-more" onClick={this.showAddVital}>
              {this.formatMessage(messages.add)}
            </div>
          )}
        </div>
        {vitalKeys.map((key) => {
          const {
            vital_template_id = "",
            details: {
              duration = null,
              description = "",
              repeat_days = [],
              repeat_interval_id = "",
            } = {},
          } = vitals[key];

          const { basic_info: { name: vital_name = "" } = {} } =
            vital_templates[vital_template_id];
          const repeatObj = repeat_intervals[repeat_interval_id];
          const vital_repeat = repeatObj["text"];

          return (
            <div className="flex wp100 flex-grow-1 align-center" key={key}>
              <div className="drawer-block">
                <div className="flex direction-row justify-space-between align-center">
                  <div className="form-headings-ap">{vital_name}</div>
                  <Icon
                    type="edit"
                    className="ml20"
                    style={{ color: "#4a90e2" }}
                    theme="filled"
                    onClick={this.showInnerForm(EVENT_TYPE.VITALS, key)}
                  />
                </div>
                <div className="drawer-block-description">{vital_repeat}</div>
                <div className="drawer-block-description">{`Repeat: ${repeat_days}`}</div>
              </div>
            </div>
          );
        })}

        <div className="wp100 flex align-center justify-space-between">
          <div className="form-category-headings-ap align-self-start">
            {this.formatMessage(messages.diets)}
          </div>
          {dietKeys.length > 0 ? (
            <div className="add-more" onClick={this.showAddDiet}>
              {this.formatMessage(messages.addMore)}
            </div>
          ) : (
            <div className="add-more" onClick={this.showAddDiet}>
              {this.formatMessage(messages.add)}
            </div>
          )}
        </div>
        {dietKeys.map((key) => {
          const {
            name = "",
            total_calories = 0,
            duration = null,
            details: { repeat_days = [] } = {},
          } = diets[key] || {};

          const repeat = repeat_days.length ? repeat_days.toString() : "";

          return (
            <div className="flex wp100 flex-grow-1 align-center" key={key}>
              <div className="drawer-block">
                <div className="flex direction-row justify-space-between align-center">
                  <div className="form-headings-ap">{name}</div>
                  <Icon
                    type="edit"
                    className="ml20"
                    style={{ color: "#4a90e2" }}
                    theme="filled"
                    onClick={this.showInnerForm(EVENT_TYPE.DIET, key)}
                  />
                </div>
                <div className="drawer-block-description">{`${
                  total_calories ? total_calories : "--"
                }${" "}Cal`}</div>
                <div className="drawer-block-description">{`Repeat: ${repeat}`}</div>
              </div>
            </div>
          );
        })}

        <div className="wp100 flex align-center justify-space-between">
          <div className="form-category-headings-ap align-self-start">
            {this.formatMessage(messages.workouts)}
          </div>
          {workoutKeys.length > 0 ? (
            <div className="add-more" onClick={this.showAddWorkout}>
              {this.formatMessage(messages.addMore)}
            </div>
          ) : (
            <div className="add-more" onClick={this.showAddWorkout}>
              {this.formatMessage(messages.add)}
            </div>
          )}
        </div>
        {workoutKeys.map((key) => {
          const {
            name = "",
            total_calories = 0,
            duration = null,
            details: { repeat_days = [] } = {},
          } = workouts[key] || {};

          const repeat = repeat_days.length ? repeat_days.toString() : "";

          return (
            <div className="flex wp100 flex-grow-1 align-center" key={key}>
              <div className="drawer-block">
                <div className="flex direction-row justify-space-between align-center">
                  <div className="form-headings-ap">{name}</div>
                  <Icon
                    type="edit"
                    className="ml20"
                    style={{ color: "#4a90e2" }}
                    theme="filled"
                    onClick={this.showInnerForm(EVENT_TYPE.WORKOUT, key)}
                  />
                </div>
                <div className="drawer-block-description">{`${
                  total_calories ? total_calories : "--"
                }${" "}Cal`}</div>
                <div className="drawer-block-description">{`Repeat: ${repeat}`}</div>
              </div>
            </div>
          );
        })}
        {/* AKSHAY NEW CODE IMPLEMENTATION */}
        {doctor_provider_id !== null && (
          <Fragment>
            {" "}
            <div className="template-share-swicth">
              <p
                className={
                  !this.state.templateIsPrivate
                    ? "private-text active-text"
                    : "private-text"
                }
              >
                Private
              </p>
              <Switch
                checked={this.state.templateIsPrivate}
                onChange={this.onChangeTemplateShare}
              />
              <p
                className={
                  this.state.templateIsPrivate
                    ? "public-text active-text"
                    : "public-text"
                }
              >
                Public
              </p>
            </div>
            <div className="tepmale-share-note">
              {" "}
              {!this.state.templateIsPrivate ? (
                <p>Note : This template is visible for the doctor itself</p>
              ) : (
                <p>
                  Note : This template is visible to all doctors within provider
                </p>
              )}
            </div>
          </Fragment>
        )}
      </div>
    );
  };

  editMedication = (data) => {
    let { medications = {}, innerFormKey = "" } = this.state;
    let { medicines } = this.props;
    let newMedication = medications[innerFormKey];
    const {
      end_date = "",
      medicine_id = "",
      quantity = 0,
      repeat = "",
      repeat_days = [],
      start_date = "",
      start_time = "",
      strength = "",
      unit = "",
      description = "",
      medicine_type = "",
      when_to_take = ["3"],
      when_to_take_abbr = "",
    } = data;

    console.log("98871632254238987821835362854623548", { data });

    const { basic_info: { name = "", type = "" } = {} } =
      medicines[medicine_id];

    let duration = moment(end_date).diff(moment(start_date), "days");
    if (!end_date) {
      duration = null;
    }

    newMedication = {
      medicine_id,

      schedule_data: {
        unit,
        repeat,
        duration,
        quantity,
        strength,
        repeat_days,
        when_to_take,
        medicine_type,
        description,
        when_to_take_abbr,
      },
    };
    medications[innerFormKey] = newMedication;
    this.setState({ medications, templateEdited: true }, () => {
      this.onCloseInner();
    });
  };

  editVital = (data) => {
    let { vitals = {}, innerFormKey = "" } = this.state;
    let { vital_templates = {} } = this.props;
    let newVital = vitals[innerFormKey] || {};
    const {
      end_date = "",
      vital_template_id = "",
      repeat_days = [],
      start_date = "",
      repeat_interval_id = "",
      description = "",
    } = data;

    const { basic_info: { name = "" } = {} } =
      vital_templates[vital_template_id];
    let vitalExist = false;

    let duration = moment(end_date).diff(moment(start_date), "days");
    if (!end_date) {
      duration = null;
    }

    for (let key of Object.keys(vitals)) {
      let { vital_template_id: vId = "" } = vitals[key];
      const vital = vitals[key];
      if (
        parseInt(vital_template_id) === parseInt(vId) &&
        key.toString() !== innerFormKey.toString()
      ) {
        vitalExist = true;
      }
    }

    const s_date = moment(start_date);
    let e_date = "";
    if (end_date === null) {
      e_date = end_date;
    } else {
      e_date = moment(end_date);
    }
    if (vitalExist) {
      message.error(this.formatMessage(messages.vitalExist));
    } else {
      vitals[innerFormKey] = {
        vital_template_id,
        details: {
          duration,
          description,
          repeat_days,
          repeat_interval_id,
        },
      };

      this.setState({ vitals, templateEdited: true }, () => {
        this.onCloseInner();
        // this.props.dispatchClose();
      });
    }
  };

  editAppointment = (data) => {
    const { appointments = {}, innerFormKey = "" } = this.state;

    let {
      date = {},
      description = "",
      end_time = {},
      id = "",
      critical,
      type = "",
      type_description = "",
      radiology_type = "",
      provider_id = 0,
      provider_name = "",
      participant_two = {},
      start_time = {},
      treatment_id = "",
      reason = "",
    } = data;

    let newAppointment = appointments[innerFormKey];

    const today = moment();
    const selectedDate = date;
    let diff = selectedDate.diff(today, "days");
    const time_gap = typeof diff === "number" ? diff + 1 : 0;

    if (!date || !start_time || !end_time) {
      message.error(this.formatMessage(messages.appointmentError));
      return;
    }

    newAppointment = {
      reason,
      time_gap,
      details: {
        date,
        critical,
        description,
        appointment_type: type,
        type_description,
        radiology_type,
      },
      provider_id,
      provider_name,
    };

    appointments[innerFormKey] = newAppointment;
    this.setState({ appointments, templateEdited: true }, () => {
      this.onCloseInner();
    });
  };

  addMedication = (data) => {
    const {
      end_date = "",
      medicine_id = "",
      medicine_type = "",
      quantity = 0,
      repeat = "",
      repeat_days = [],
      start_date = "",
      start_time = "",
      strength = "",
      unit = "",
      description = "",
      when_to_take = ["3"],
      when_to_take_abbr = "",
    } = data;

    let { medications = {}, medicationKeys = [] } = this.state;
    let { medicines } = this.props;
    let newMedication = {};
    const { basic_info: { name = "", type = "" } = {} } =
      medicines[medicine_id] || {};

    let duration = moment(end_date).diff(moment(start_date), "days");
    if (!end_date) {
      duration = null;
    }

    newMedication = {
      medicine_id,
      schedule_data: {
        unit,
        repeat,
        duration,
        quantity,
        strength,
        repeat_days,
        when_to_take,
        medicine_type,
        description,
        when_to_take_abbr,
      },
    };
    let key = uuid();
    let medicineExist = false;
    for (let medication of Object.values(medications)) {
      let { medicine_id: medId = 1 } = medication;
      if (parseInt(medicine_id) === parseInt(medId)) {
        medicineExist = true;
      }
    }

    if (medicineExist) {
      message.error(this.formatMessage(messages.medicationExist));
    } else {
      medicationKeys.push(key);
      medications[key] = newMedication;
      this.setState(
        { medications, medicationKeys, templateEdited: true },
        () => {
          this.closeAddMedication();
        }
      );
    }
  };

  addVital = (data) => {
    const { vital_templates = {} } = this.props;
    let newVital = {};
    let { vitals = {}, vitalKeys = [] } = this.state;

    const {
      end_date = "",
      vital_template_id = "",
      repeat_days = [],
      start_date = "",
      repeat_interval_id = "",
      description = "",
    } = data;

    const { basic_info: { name = "" } = {} } =
      vital_templates[vital_template_id];

    let duration = moment(end_date).diff(moment(start_date), "days");
    if (!end_date) {
      duration = null;
    }

    let key = uuid();
    let vitalExist = false;
    for (let vital of Object.values(vitals)) {
      let { vital_template_id: vId = "" } = vital;
      if (parseInt(vital_template_id) === parseInt(vId)) {
        vitalExist = true;
      }
    }

    if (vitalExist) {
      message.error(this.formatMessage(messages.vitalExist));
    } else {
      vitalKeys.push(key);
      vitals[key] = {
        vital_template_id,
        details: {
          duration,
          description,
          repeat_days,
          repeat_interval_id,
        },
      };
      this.setState({ vitals, vitalKeys, templateEdited: true }, () => {
        this.closeAddVital();
      });
    }
  };

  addAppointment = (data) => {
    let { appointments = {}, appointmentKeys = [] } = this.state;
    let key = uuid();
    let {
      date = {},
      description = "",
      end_time = {},
      critical,
      type = "",
      type_description = "",
      radiology_type = "",
      provider_id = 0,
      provider_name = "",
      start_time = {},
      reason = "",
    } = data;
    let newAppointment = {};

    const today = moment();
    const selectedDate = date;
    let diff = selectedDate.diff(today, "days");
    const time_gap = typeof diff === "number" ? diff + 1 : 0;

    if (!date || !start_time || !end_time) {
      message.error(this.formatMessage(messages.appointmentError));
      return;
    }

    newAppointment = {
      reason,
      time_gap,
      details: {
        date,
        critical,
        description,
        appointment_type: type,
        type_description,
        radiology_type,
      },
      provider_id,
      provider_name,
    };

    appointments[key] = newAppointment;
    appointmentKeys.push(key);
    this.setState(
      { appointments, appointmentKeys, templateEdited: true },
      () => {
        this.closeAddAppointment();
      }
    );
  };

  addDiet = (data) => {
    let { diets = {}, dietKeys = [] } = this.state;

    const {
      name = "",
      repeat_days = [],
      total_calories = 0,
      diet_food_groups = {},
      start_date = "",
      end_date = "",
      not_to_do = "",
    } = data;

    let key = uuid();

    let dietNameExists = false;
    for (let diet of Object.values(diets)) {
      let { name: existing_name = "" } = diet;
      if (name === existing_name) {
        dietNameExists = true;
      }
    }

    let duration = moment(end_date).diff(moment(start_date), "days") || null;
    if (!end_date) {
      duration = null;
    }

    if (dietNameExists) {
      message.error(this.formatMessage(messages.dietNameExist));
    } else {
      dietKeys.push(key);
      diets[key] = {
        name,
        total_calories,
        duration,
        details: {
          repeat_days,
          not_to_do,
          diet_food_groups,
        },
      };

      this.setState({ diets, dietKeys, templateEdited: true }, () => {
        this.closeAddDiet();
      });
    }
  };

  editDiet = (data) => {
    let { diets = {}, innerFormKey = "" } = this.state;

    const {
      name = "",
      repeat_days = [],
      total_calories = 0,
      diet_food_groups = {},
      start_date = "",
      end_date = "",
      not_to_do = "",
    } = data;

    let dietNameExists = false;
    for (let dietKey in diets) {
      const diet = diets[dietKey];
      let { name: existing_name = "" } = diet;
      if (name === existing_name && dietKey !== innerFormKey) {
        dietNameExists = true;
      }
    }

    let duration = moment(end_date).diff(moment(start_date), "days") || null;
    if (!end_date) {
      duration = null;
    }

    if (dietNameExists) {
      message.error(this.formatMessage(messages.dietNameExist));
    } else {
      diets[innerFormKey] = {
        name,
        total_calories,
        duration,
        details: {
          repeat_days,
          not_to_do,
          diet_food_groups,
        },
      };

      this.setState({ diets, templateEdited: true }, () => {
        this.onCloseInner();
      });
    }
  };

  addWorkout = (data) => {
    let { workouts = {}, workoutKeys = [] } = this.state;

    const {
      name = "",
      repeat_days = [],
      total_calories = 0,
      workout_exercise_groups = {},
      start_date = "",
      end_date = "",
      not_to_do = "",
      time = null,
    } = data;

    let key = uuid();

    let workoutNameExists = false;
    for (let workout of Object.values(workouts)) {
      let { name: existing_name = "" } = workout;
      if (name === existing_name) {
        workoutNameExists = true;
      }
    }

    let duration = moment(end_date).diff(moment(start_date), "days") || null;
    if (!end_date) {
      duration = null;
    }

    if (workoutNameExists) {
      message.error(this.formatMessage(messages.workoutNameExist));
    } else {
      workoutKeys.push(key);
      workouts[key] = {
        name,
        total_calories,
        duration,
        time,
        details: {
          repeat_days,
          not_to_do,
          workout_exercise_groups,
        },
      };

      this.setState({ workouts, workoutKeys, templateEdited: true }, () => {
        this.closeAddWorkout();
      });
    }
  };

  editWorkout = (data) => {
    let { workouts = {}, innerFormKey = "" } = this.state;

    const {
      name = "",
      repeat_days = [],
      total_calories = 0,
      workout_exercise_groups = {},
      start_date = "",
      end_date = "",
      not_to_do = "",
      time = null,
    } = data;

    let workoutNameExists = false;
    for (let workoutKey in workouts) {
      const workout = workouts[workoutKey];
      let { name: existing_name = "" } = workout;
      if (name === existing_name && workoutKey !== innerFormKey) {
        workoutNameExists = true;
      }
    }

    let duration = moment(end_date).diff(moment(start_date), "days") || null;
    if (!end_date) {
      duration = null;
    }

    if (workoutNameExists) {
      message.error(this.formatMessage(messages.workoutNameExist));
    } else {
      workouts[innerFormKey] = {
        name,
        total_calories,
        duration,
        time,
        details: {
          repeat_days,
          not_to_do,
          workout_exercise_groups,
        },
      };

      this.setState({ workouts, templateEdited: true }, () => {
        this.onCloseInner();
      });
    }
  };

  render() {
    let {
      showInner,
      innerFormType,
      innerFormKey,
      medications,
      showAddMedicationInner,
      appointments,
      vitals,
      diets,
      workouts,
      showAddAppointmentInner,
      showAddVitalInner,
      showAddDietInner,
      showAddWorkoutInner,
      name,
      submitting = false,
      medicationKeys = [],
      appointmentKeys = [],
      vitalKeys = [],
      dietKeys = [],
      workoutKeys = [],
      isDietVisible = false,
      isWorkoutVisible = false,
    } = this.state;
    const { onClose, renderTemplateDetails } = this;
    let medicationData =
      innerFormKey && innerFormType == EVENT_TYPE.MEDICATION_REMINDER
        ? medications[innerFormKey]
        : {};

    let appointmentData =
      innerFormKey && innerFormType == EVENT_TYPE.APPOINTMENT
        ? appointments[innerFormKey]
        : {};
    let vitalData =
      innerFormKey && innerFormType == EVENT_TYPE.VITALS
        ? vitals[innerFormKey]
        : {};
    let dietData =
      innerFormKey && innerFormType == EVENT_TYPE.DIET
        ? diets[innerFormKey]
        : {};
    let workoutData =
      innerFormKey && innerFormType == EVENT_TYPE.WORKOUT
        ? workouts[innerFormKey]
        : {};

    console.log("673246238462834628346827364872634872634872", {
      innerFormKey,
      innerFormType,
    });
    const { visible = false, close } = this.props;

    if (medicationData) {
      medicationData.templatePage = true;
    }

    if (visible !== true) {
      return null;
    }

    // const submitButtonProps = {
    //     disabled:!name || (!medicationKeys.length && !appointmentKeys.length && !vitalKeys.length)
    // }

    return (
      <Fragment>
        <Drawer
          title={this.formatMessage(messages.templateTitle)}
          placement="right"
          // closable={false}
          maskClosable={false}
          headerStyle={{
            position: "sticky",
            zIndex: "9999",
            top: "0px",
          }}
          // onClose={onClose}
          onClose={this.onClose}
          width={"35%"}
          visible={visible}
        >
          {renderTemplateDetails()}

          {/* edit */}

          {innerFormKey && innerFormType == EVENT_TYPE.MEDICATION_REMINDER && (
            <EditMedicationReminder
              medicationData={medicationData}
              medicationVisible={showInner}
              editMedication={this.editMedication}
              hideMedication={this.onCloseInner}
              deleteMedicationOfTemplate={this.deleteEntry}
            />
          )}

          {innerFormKey && innerFormType == EVENT_TYPE.APPOINTMENT && (
            <EditAppointmentDrawer
              appointmentData={appointmentData}
              appointmentVisible={showInner}
              editAppointment={this.editAppointment}
              hideAppointment={this.onCloseInner}
              deleteAppointmentOfTemplate={this.deleteEntry}
            />
          )}

          {innerFormKey && innerFormType == EVENT_TYPE.VITALS && (
            <EditVitalDrawer
              vitalData={vitalData}
              vitalVisible={showInner}
              editVital={this.editVital}
              hideVital={this.onCloseInner}
              deleteVitalOfTemplate={this.deleteEntry}
            />
          )}

          {innerFormKey && innerFormType == EVENT_TYPE.DIET && (
            <EditDietDrawer
              dietData={dietData}
              dietVisible={showInner}
              editTemplateDiet={this.editDiet}
              hideDiet={this.onCloseInner}
              deleteDietOfTemplate={this.deleteEntry}
              isDietVisible={isDietVisible}
            />
          )}

          {innerFormKey && innerFormType == EVENT_TYPE.WORKOUT && (
            <EditWorkoutDrawer
              workoutData={workoutData}
              workoutVisible={showInner}
              editTemplateWorkout={this.editWorkout}
              hideWorkout={this.onCloseInner}
              deleteWorkoutOfTemplate={this.deleteEntry}
              isWorkoutVisible={isWorkoutVisible}
            />
          )}

          {/* add */}
          {showAddMedicationInner && (
            <EditMedicationReminder
              medicationVisible={showAddMedicationInner}
              addMedication={this.addMedication}
              hideMedication={this.closeAddMedication}
            />
          )}

          {showAddAppointmentInner && (
            <EditAppointmentDrawer
              appointmentVisible={showAddAppointmentInner}
              addAppointment={this.addAppointment}
              hideAppointment={this.closeAddAppointment}
            />
          )}

          {showAddVitalInner && (
            <EditVitalDrawer
              vitalVisible={showAddVitalInner}
              addVital={this.addVital}
              hideVital={this.closeAddVital}
            />
          )}

          {showAddDietInner && (
            <EditDietDrawer
              dietVisible={showAddDietInner}
              addTemplateDiet={this.addDiet}
              hideDiet={this.closeAddDiet}
              isDietVisible={isDietVisible}
            />
          )}

          {showAddWorkoutInner && (
            <EditWorkoutDrawer
              workoutVisible={showAddWorkoutInner}
              addTemplateWorkout={this.addWorkout}
              hideWorkout={this.closeAddWorkout}
              isWorkoutVisible={isWorkoutVisible}
            />
          )}

          <Footer
            onSubmit={this.onSubmit}
            onClose={this.onClose}
            submitText={this.formatMessage(messages.submit)}
            submitButtonProps={{}}
            cancelComponent={null}
            submitting={submitting}
            // submitButtonProps={submitButtonProps}
          />

          {/* <div className='add-patient-footer'>
                        <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                            {this.formatMessage(messages.cancel)}
                        </Button>
                        <Button onClick={this.onSubmit} type="primary"
                        disabled={!name}
                        >
                            {this.formatMessage(messages.submit)}
                        </Button>
                    </div> */}
        </Drawer>
      </Fragment>
    );
  }
}

export default injectIntl(TemplatePageCreateDrawer);
