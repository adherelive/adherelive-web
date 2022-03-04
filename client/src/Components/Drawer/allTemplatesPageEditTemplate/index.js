import { Drawer } from "antd";
import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import {
  DELETE_TEMPLATE_RELATED_TYPE,
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
import { PoweroffOutlined } from "@ant-design/icons";

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
      carePlanTemplateId: null,
      appointmentIds: {},
      medicationIds: {},
      vitalIds: {},
      dietIds: {},
      workoutIds: {},
      deleteMedicationKeys: [],
      deleteAppointmentKeys: [],
      deleteVitalKeys: [],
      deleteDietKeys: [],
      deleteWorkoutKeys: [],
      templateEdited: false,
      submitting: false,
      isDietVisible: false,
      isWorkoutVisible: false,
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    const {
      visible: prev_visible = false,
      payload: { id: prev_id = null } = {},
    } = prevProps || {};
    const { visible = false, payload: { id: careplanTemplateID = null } = {} } =
      this.props;

    if (visible && visible !== prev_visible) {
      console.log("3278562473254623 ==>", this.props);

      let templateAppointments = {};
      let templateMedications = {};
      let templateVitals = {};
      let templateDiets = {};
      let templateWorkouts = {};
      let templateAppointmentIDs = [];
      let templateMedicationIDs = [];
      let templateVitalIDs = [];
      let templateDietIDs = [];
      let templateWorkoutIDs = [];
      let newMedicsKeys = [];
      let newAppointsKeys = [];
      let newVitalKeys = [];
      let newDietKeys = [];
      let newWorkoutKeys = [];
      let newMedics = {};
      let newAppoints = {};
      let newVitals = {};
      let newDiets = {};
      let newWorkouts = {};
      let appointmentIdsTemp = [];
      let medicationIdsTemp = [];
      let vitalIdsTemp = [];
      let dietIdsTemp = [];
      let workoutIdsTemp = [];
      let appointmentIds = {};
      let medicationIds = {};
      let vitalIds = {};
      let dietIds = {};
      let workoutIds = {};

      const {
        care_plan_templates = {},
        template_appointments = {},
        template_vitals = {},
        template_medications = {},
        template_diets = {},
        template_workouts = {},
      } = this.props;

      const {
        basic_info: { name: careplanTemplateName = "", id = "" } = {},
        template_appointment_ids = [],
        template_medication_ids = [],
        template_vital_ids = [],
        template_diet_ids = [],
        template_workout_ids = [],
      } = care_plan_templates[careplanTemplateID] || {};

      for (let aId of template_appointment_ids) {
        let newAppointment = {};
        let {
          basic_info: { id: appointmentId = "" } = {},
          reason = "",
          time_gap = null,
          details: {
            date = "",
            critical,
            description = "",
            appointment_type = "",
            type_description = "",
            radiology_type = "",
          } = {},
          provider_id = "",
          provider_name = "",
        } = template_appointments[aId];

        if (time_gap !== null) {
          date = moment().add(parseInt(time_gap), "days");
        } else {
          date = null;
        }

        newAppointment = {
          id: appointmentId,
          reason,
          time_gap,
          details: {
            date,
            critical,
            description,
            appointment_type,
            type_description,
            radiology_type,
          },
          provider_id,
          provider_name,
        };

        templateAppointments[aId] = newAppointment;
        appointmentIdsTemp[aId] = appointmentId;
      }

      for (let mId of template_medication_ids) {
        let newMedication = {};
        const {
          basic_info: { medicine_id = "", id: medicationId = "" } = {},
          schedule_data: {
            unit = "",
            repeat = "",
            duration = "",
            quantity = "",
            strength = "",
            description = "",
            repeat_days = [],
            when_to_take = [],
            medicine_type = "",
            when_to_take_abbr = "",
          } = {},
        } = template_medications[mId] || {};

        newMedication = {
          id: medicationId,
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

        templateMedications[mId] = newMedication;
        medicationIdsTemp[mId] = medicationId;
      }

      for (let vId of template_vital_ids) {
        let newVital = {};

        const {
          basic_info: { vital_template_id = "", id: vitalId = "" } = {},
          details: {
            duration = "",
            description = "",
            repeat_days = [],
            repeat_interval_id = "",
          } = {},
        } = template_vitals[vId];

        newVital = {
          id: vitalId,
          vital_template_id,
          details: {
            duration,
            description,
            repeat_days,
            repeat_interval_id,
          },
        };

        templateVitals[vId] = newVital;
        vitalIdsTemp[vId] = vitalId;
      }

      for (let dId of template_diet_ids) {
        const {
          basic_info: {
            id: dietId,
            care_plan_template_id = 0,
            id = 0,
            name = "",
          } = {},
          total_calories = null,
          duration = null,
          details: {
            repeat_days = [],
            not_to_do = "",
            diet_food_groups = {},
          } = {},
        } = template_diets[dId] || {};

        // const s_date=moment().toISOString();
        // const e_date=moment().add(parseInt(duration), 'days').toISOString();

        // if(duration === null){
        //     e_date = null;
        // }

        templateDiets[dId] = {
          id: dietId,
          care_plan_template_id,
          name,
          total_calories,
          duration,
          details: {
            repeat_days,
            not_to_do,
            diet_food_groups,
          },
        };

        dietIdsTemp[dId] = dietId;
      }

      for (let wId of template_workout_ids) {
        const {
          basic_info: {
            id: workoutId,
            care_plan_template_id = 0,
            id = 0,
            name = "",
          } = {},
          total_calories = null,
          duration = null,
          time = null,
          details: {
            repeat_days = [],
            not_to_do = "",
            workout_exercise_groups = {},
          } = {},
        } = template_workouts[wId] || {};
        templateWorkouts[wId] = {
          id: workoutId,
          care_plan_template_id,
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

        console.log("757567686478621371623712", {
          templateWorkouts,
          template_workout_ids,
          W: template_workouts[wId],
        });

        workoutIdsTemp[wId] = workoutId;
      }

      if (Object.keys(templateMedications).length) {
        for (let mId of Object.keys(templateMedications)) {
          let key = uuid();
          newMedics[key] = templateMedications[mId];
          newMedicsKeys.push(key);
          medicationIds[key] = medicationIdsTemp[mId];
        }
      }
      if (Object.keys(templateAppointments).length) {
        for (let aId of Object.keys(templateAppointments)) {
          let key = uuid();
          newAppoints[key] = templateAppointments[aId];
          newAppointsKeys.push(key);
          appointmentIds[key] = appointmentIdsTemp[aId];
        }
      }

      if (Object.keys(templateVitals).length) {
        for (let vId of Object.keys(templateVitals)) {
          let key = uuid();
          newVitals[key] = templateVitals[vId];
          newVitalKeys.push(key);
          vitalIds[key] = vitalIdsTemp[vId];
        }
      }

      if (Object.keys(templateDiets).length) {
        for (let dId of Object.keys(templateDiets)) {
          let key = uuid();
          newDiets[key] = templateDiets[dId];
          newDietKeys.push(key);
          dietIds[key] = dietIdsTemp[dId];
        }
      }

      console.log("757567686478621371623712 -==>> ", { templateWorkouts });

      if (Object.keys(templateWorkouts).length) {
        for (let wId of Object.keys(templateWorkouts)) {
          let key = uuid();
          newWorkouts[key] = templateWorkouts[wId];
          newWorkoutKeys.push(key);
          workoutIds[key] = workoutIdsTemp[wId];
        }
      }

      console.log("757567686478621371623712 @@@@@@@@@@@ ", {
        newWorkouts,
        newWorkoutKeys,
        workoutIds,
      });

      this.setState(
        {
          name: careplanTemplateName,
          carePlanTemplateId: careplanTemplateID,
          medications: newMedics,
          appointments: newAppoints,
          vitals: newVitals,
          diets: newDiets,
          workouts: newWorkouts,
          appointmentKeys: newAppointsKeys,
          medicationKeys: newMedicsKeys,
          vitalKeys: newVitalKeys,
          dietKeys: newDietKeys,
          workoutKeys: newWorkoutKeys,
          templateAppointmentIDs,
          templateMedicationIDs,
          templateVitalIDs,
          templateDietIDs,
          templateWorkoutIDs,
          templateEdited: false,
          medicationIds,
          appointmentIds,
          vitalIds,
          dietIds,
          workoutIds,
        },
        () => {
          console.log("757567686478621371623712 ####### ", {
            state: this.state,
          });
        }
      );
    }
  }

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

  async handleDeleteTemplateMed(key) {
    const { deleteCareplanTemplateRelated } = this.props;
    const { carePlanTemplateId = null, medicationIds = {} } = this.state;
    try {
      const other_id = medicationIds[key] || null;
      const response = await deleteCareplanTemplateRelated({
        careplan_template_id: carePlanTemplateId,
        other_id,
        other_type: DELETE_TEMPLATE_RELATED_TYPE.MEDICATION,
      });
      const {
        status,
        statusCode,
        payload: { data = {}, message: msg = "" } = {},
      } = response;
      if (status) {
        let { deleteMedicationKeys = [] } = this.state;
        delete medicationIds[key];
        deleteMedicationKeys.splice(deleteMedicationKeys.indexOf(key), 1);
        this.setState({ deleteMedicationKeys, medicationIds });
        // message.success(msg);
      } else {
        message.warn(msg);
      }
    } catch (error) {
      console.log("deleteMedicationError ===>", error);
      message.warn(error);
    }
  }

  async handleDeleteTemplateAppointment(key) {
    const { deleteCareplanTemplateRelated } = this.props;
    const { carePlanTemplateId = null, appointmentIds = {} } = this.state;
    try {
      const other_id = appointmentIds[key] || null;
      const response = await deleteCareplanTemplateRelated({
        careplan_template_id: carePlanTemplateId,
        other_id,
        other_type: DELETE_TEMPLATE_RELATED_TYPE.APPOINTMENT,
      });

      const {
        status,
        statusCode,
        payload: { data = {}, message: msg = "" } = {},
      } = response;
      if (status) {
        let { deleteAppointmentKeys = [] } = this.state;
        delete appointmentIds[key];
        deleteAppointmentKeys.splice(deleteAppointmentKeys.indexOf(key), 1);
        this.setState({ deleteAppointmentKeys, appointmentIds });
        // message.success(msg);
      } else {
        message.warn(msg);
      }
    } catch (error) {
      console.log("deleteAppointmentError ===>", error);
      message.warn(error);
    }
  }

  async handleDeleteTemplateVital(key) {
    const { deleteCareplanTemplateRelated } = this.props;
    const { carePlanTemplateId = null, vitalIds = {} } = this.state;
    try {
      const other_id = vitalIds[key] || null;
      const response = await deleteCareplanTemplateRelated({
        careplan_template_id: carePlanTemplateId,
        other_id,
        other_type: DELETE_TEMPLATE_RELATED_TYPE.VITAL,
      });

      const {
        status,
        statusCode,
        payload: { data = {}, message: msg = "" } = {},
      } = response;
      if (status) {
        let { deleteVitalKeys = [] } = this.state;
        delete vitalIds[key];
        deleteVitalKeys.splice(deleteVitalKeys.indexOf(key), 1);
        this.setState({ deleteVitalKeys, vitalIds });
        // message.success(msg);
      } else {
        message.warn(msg);
      }
    } catch (error) {
      console.log("deleteVitalError ===>", error);
      message.warn(error);
    }
  }

  async handleDeleteTemplateDiet(key) {
    const { deleteCareplanTemplateRelated } = this.props;
    const { carePlanTemplateId = null, dietIds = {} } = this.state;
    try {
      const other_id = dietIds[key] || null;
      const response = await deleteCareplanTemplateRelated({
        careplan_template_id: carePlanTemplateId,
        other_id,
        other_type: DELETE_TEMPLATE_RELATED_TYPE.DIET,
      });

      const {
        status,
        statusCode,
        payload: { data = {}, message: msg = "" } = {},
      } = response;
      if (status) {
        let { deleteDietKeys = [] } = this.state;
        delete dietIds[key];
        deleteDietKeys.splice(deleteDietKeys.indexOf(key), 1);
        this.setState({ deleteDietKeys, dietIds });
        // message.success(msg);
      } else {
        message.warn(msg);
      }
    } catch (error) {
      console.log("deleteDietError ===>", error);
      message.warn(error);
    }
  }

  async handleDeleteTemplateWorkout(key) {
    const { deleteCareplanTemplateRelated } = this.props;
    const { carePlanTemplateId = null, workoutIds = {} } = this.state;
    try {
      const other_id = workoutIds[key] || null;
      const response = await deleteCareplanTemplateRelated({
        careplan_template_id: carePlanTemplateId,
        other_id,
        other_type: DELETE_TEMPLATE_RELATED_TYPE.WORKOUT,
      });

      const {
        status,
        statusCode,
        payload: { data = {}, message: msg = "" } = {},
      } = response;
      if (status) {
        let { deleteWorkoutKeys = [] } = this.state;
        delete workoutIds[key];
        deleteWorkoutKeys.splice(deleteWorkoutKeys.indexOf(key), 1);
        this.setState({ deleteWorkoutKeys, workoutIds });
        // message.success(msg);
      } else {
        message.warn(msg);
      }
    } catch (error) {
      console.log("deleteWorkoutError ===>", error);
      message.warn(error);
    }
  }

  deleteEntry = () => {
    let {
      appointments = {},
      appointmentKeys = [],
      medications = {},
      medicationKeys = [],
      vitals = {},
      vitalKeys = [],
      diets = {},
      dietKeys = [],
      workouts = {},
      workoutKeys = [],
      innerFormType = "",
      innerFormKey = "",
      medicationIds = {},
      appointmentIds = {},
      vitalIds = {},
      dietIds = {},
      workoutIds = {},
      deleteMedicationKeys = [],
      deleteAppointmentKeys = [],
      deleteVitalKeys = [],
      deleteDietKeys = [],
      deleteWorkoutKeys = [],
    } = this.state;

    const key = innerFormKey;
    if (medicationIds[key]) {
      deleteMedicationKeys.push(key);
    } else if (appointmentIds[key]) {
      deleteAppointmentKeys.push(key);
    } else if (vitalIds[key]) {
      deleteVitalKeys.push(key);
    } else if (dietIds[key]) {
      deleteDietKeys.push(key);
    } else if (workoutIds[key]) {
      deleteWorkoutKeys.push(key);
    }

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
      //     condition: !medicine_id || !unit || !repeat || (unit !== MEDICINE_UNITS.ML && !quantity) ||  !repeat_days.length ||
      //         !medicine_type || (!duration && duration !== null) || !strength  || !when_to_take.length,
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
        // console.log("8932648723648723462387",{flag1:!medicine_type,flag2:(!duration && duration !== null),flag3:!strength,duration});

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
          // critical ='',
          // description ='',
          appointment_type = "",
          type_description = "",
          radiology_type,
        } = {},
        provider_id = "",
        // provider_name =''
      } = appointment || {};

      if (
        !reason ||
        (!time_gap && time_gap !== null) ||
        !date ||
        !appointment_type ||
        !type_description ||
        !provider_id
      ) {
        // console.log("386428376483724632874",{
        //        reason:!reason,
        //        time_gap:(!time_gap && time_gap!==null),
        //        date:!date,
        //        appointment_type:!appointment_type,
        //        type_description:!type_description,
        //        provider_id:!provider_id,
        //        appointment:appointment,
        //        dateIsssss:date,
        //        appointmentsData
        //    });

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
        id = null,
        care_plan_template_id = null,
        name = "",
        total_calories = 0,
        duration = null,
        details: {
          repeat_days = [],
          not_to_do = "",
          diet_food_groups = {},
        } = {},
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
    const {
      updateCareplanTemplate,
      close,
      getAllTemplatesForDoctor,
      authenticated_category,
    } = this.props;
    let medicationsData = Object.values(medications);
    let appointmentsData = Object.values(appointments);
    let vitalsData = Object.values(vitals);
    let dietData = Object.values(diets);
    let workoutData = Object.values(workouts);

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
        const {
          deleteAppointmentKeys = [],
          deleteMedicationKeys = [],
          deleteVitalKeys = [],
          deleteDietKeys = [],
          deleteWorkoutKeys = [],
          carePlanTemplateId = null,
        } = this.state;
        const deleteMedArr = deleteMedicationKeys;
        const deleteAppArr = deleteAppointmentKeys;
        const deleteVitalArr = deleteVitalKeys;
        const deleteDietArr = deleteDietKeys;
        const deleteWorkoutArr = deleteWorkoutKeys;
        this.setState({ submitting: true });
        const response = await updateCareplanTemplate(carePlanTemplateId, {
          medicationsData,
          appointmentsData,
          vitalsData,
          dietData,
          workoutData,
          name,
        });

        const {
          payload: { data = {}, message: res_msg = "" },
          status,
          statusCode,
        } = response || {};
        if (status) {
          for (let key of deleteMedArr) {
            this.handleDeleteTemplateMed(key);
          }

          for (let key of deleteAppArr) {
            this.handleDeleteTemplateAppointment(key);
          }

          for (let key of deleteVitalArr) {
            this.handleDeleteTemplateVital(key);
          }

          for (let key of deleteDietArr) {
            this.handleDeleteTemplateDiet(key);
          }

          for (let key of deleteWorkoutArr) {
            this.handleDeleteTemplateWorkout(key);
          }

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
            showAddWorkoutInner: false,
            showAreYouSureModal: false,
            carePlanTemplateId: null,
            appointmentIds: {},
            medicationIds: {},
            vitalIds: {},
            dietIds: {},
            workoutIds: {},
            deleteMedicationKeys: [],
            deleteAppointmentKeys: [],
            deleteVitalKeys: [],
            deleteDietKeys: [],
            deleteWorkoutKeys: [],
            templateEdited: false,
          });
          await getAllTemplatesForDoctor();
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
    const { close, getAllTemplatesForDoctor } = this.props;

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
          carePlanTemplateId: null,
          appointmentIds: {},
          medicationIds: {},
          vitalIds: {},
          dietIds: {},
          workoutIds: {},
          deleteMedicationKeys: [],
          deleteAppointmentKeys: [],
          deleteVitalKeys: [],
          deleteDietKeys: [],
          deleteWorkoutKeys: [],
          templateEdited: false,
        });
        await getAllTemplatesForDoctor();
        close();
      },
      onCancel() {},
    });
  };

  onClose = async () => {
    const { close, getAllTemplatesForDoctor } = this.props;
    const {
      name = "",
      medicationKeys = [],
      appointmentKeys = [],
      vitalKeys = [],
      dietKeys = [],
      workoutKeys = [],
      templateEdited = false,
    } = this.state;
    if (templateEdited) {
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
      carePlanTemplateId: null,
      appointmentIds: {},
      medicationIds: {},
      vitalIds: {},
      dietIds: {},
      workoutIds: {},
      deleteMedicationKeys: [],
      deleteAppointmentKeys: [],
      deleteVitalKeys: [],
      deleteDietKeys: [],
      deleteWorkoutKeys: [],
      templateEdited: false,
    });
    await getAllTemplatesForDoctor();

    close();
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
      name = "",
    } = this.state;

    const {
      care_plan_templates = {},
      repeat_intervals = {},
      vital_templates = {},
      medicines = {},
    } = this.props;

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
            value={name}
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
              when_to_take = [],
              medicine_type = "",
              when_to_take_abbr = "",
            } = {},
          } = medications[key];

          const { basic_info: { name: medicine = "" } = {} } =
            medicines[medicine_id] || {};
          console.log("3278562473254623 ===> when_to_take", {
            when_to_take,
            med: medications[key],
          });
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
          nextDueTime =
            MEDICATION_TIMING[closestWhenToTake ? closestWhenToTake : "4"].time;

          let nextDue = null;
          if (when_to_take.length > 0) {
            const whenTotakeTime =
              when_to_take.length > 0
                ? MEDICATION_TIMING[when_to_take[0]].time
                : "";
            nextDue = moment(start_date).isSame(moment(), "D")
              ? `Today at ${nextDueTime}`
              : `${moment(start_date).format("D MMM")} at ${whenTotakeTime}`;
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
          console.log("3278562473254623 ====> apptData", {
            appts: appointments[key],
            appointments,
          });
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
      </div>
    );
  };

  getDuration = (startDate, endDate) => {
    return moment(endDate)
      .startOf("day")
      .diff(moment(startDate).startOf("day"), "days");
  };

  editMedication = (data) => {
    let {
      medications = {},
      innerFormKey = "",
      medicationIds = {},
    } = this.state;
    let { medicines } = this.props;
    const { getDuration } = this;
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

    const { basic_info: { name = "", type = "" } = {} } =
      medicines[medicine_id];

    let duration = getDuration(start_date, end_date);
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

    if (medicationIds[innerFormKey]) {
      const id = medicationIds[innerFormKey];
      newMedication["id"] = id;
    }

    medications[innerFormKey] = newMedication;
    this.setState({ medications, templateEdited: true }, () => {
      this.onCloseInner();
    });
  };

  editVital = (data) => {
    let { vitals = {}, innerFormKey = "", vitalIds = {} } = this.state;
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
      let newVital = {
        vital_template_id,
        details: {
          duration,
          description,
          repeat_days,
          repeat_interval_id,
        },
      };

      if (vitalIds[innerFormKey]) {
        const id = vitalIds[innerFormKey];
        newVital["id"] = id;
      }

      vitals[innerFormKey] = newVital;

      this.setState({ vitals, templateEdited: true }, () => {
        this.onCloseInner();
        // this.props.dispatchClose();
      });
    }
  };

  editAppointment = (data) => {
    const {
      appointments = {},
      innerFormKey = "",
      appointmentIds = {},
    } = this.state;

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

    if (!date || !start_time) {
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

    if (appointmentIds[innerFormKey]) {
      const id = appointmentIds[innerFormKey];
      newAppointment["id"] = id;
    }

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

    if (!date || !start_time) {
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
    let { diets = {}, innerFormKey = "", dietIds = [] } = this.state;

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
      const newDiet = {
        name,
        total_calories,
        duration,
        details: {
          repeat_days,
          not_to_do,
          diet_food_groups,
        },
      };

      if (dietIds[innerFormKey]) {
        const id = dietIds[innerFormKey];
        newDiet["id"] = id;
      }

      diets[innerFormKey] = newDiet;
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
    let { workouts = {}, innerFormKey = "", workoutIds = [] } = this.state;

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
      const newWorkout = {
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

      if (workoutIds[innerFormKey]) {
        const id = workoutIds[innerFormKey];
        newWorkout["id"] = id;
      }

      workouts[innerFormKey] = newWorkout;
      this.setState({ workouts, templateEdited: true }, () => {
        this.onCloseInner();
      });
    }
  };

  warnNoteTemplateDelete = () => {
    return (
      <div className="pt16">
        <p className="red">
          <span className="fw600">{this.formatMessage(messages.note)}</span>
          {` : ${this.formatMessage(messages.deleteTemplateWarn)}`}
        </p>
      </div>
    );
  };

  handleTemplateDelete = (e) => {
    e.preventDefault();
    const { warnNoteTemplateDelete } = this;
    const { close } = this.props;

    confirm({
      title: `${this.formatMessage(messages.deleteTemplateNote)}`,
      content: <div>{warnNoteTemplateDelete()}</div>,
      onOk: async () => {
        const { deleteCareplanTemplateRelated, getAllTemplatesForDoctor } =
          this.props;
        const { carePlanTemplateId = null } = this.state;
        try {
          const response = await deleteCareplanTemplateRelated({
            careplan_template_id: carePlanTemplateId,
          });

          const {
            payload: { data = {}, message: msg = "" } = {},
            status,
            statusCode,
          } = response || {};
          if (status) {
            message.success(msg);
            await getAllTemplatesForDoctor();
          } else {
            message.warn(msg);
          }
        } catch (error) {
          console.log("Delete Template Error --->", error);
          message.warn(error);
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
          carePlanTemplateId: null,
          appointmentIds: {},
          medicationIds: {},
          vitalIds: {},
          dietIds: {},
          workoutIds: {},
          deleteMedicationKeys: [],
          deleteAppointmentKeys: [],
          deleteVitalKeys: [],
          deleteDietKeys: [],
          deleteWorkoutKeys: [],
          templateEdited: false,
        });

        close();
      },
      onCancel() {},
    });
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
      templateEdited = false,
      submitting = false,
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

    console.log("42364872634872638476283746237", {
      state: this.state,
      workoutData,
    });

    const { visible = false, close } = this.props;

    if (medicationData) {
      medicationData.templatePage = true;
    }

    if (visible !== true) {
      return null;
    }

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

          <div className="add-patient-footer">
            <Button
              onClick={this.handleTemplateDelete}
              type={"danger"}
              ghost
              className="fs14 no-border style-delete"
            >
              {this.formatMessage(messages.delete)}
            </Button>
            <Button
              onClick={this.onSubmit}
              type="primary"
              disabled={!name || !templateEdited}
              icon={submitting ? <PoweroffOutlined /> : null}
              loading={submitting}
            >
              {this.formatMessage(messages.submit)}
            </Button>
          </div>
        </Drawer>
      </Fragment>
    );
  }
}

export default injectIntl(TemplatePageCreateDrawer);
