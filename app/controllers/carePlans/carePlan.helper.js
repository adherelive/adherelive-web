// Fetch details from Services
import carePlanService from "../../services/carePlan/carePlan.service";
import carePlanTemplateService from "../../services/carePlanTemplate/carePlanTemplate.service";
import appointmentService from "../../services/appointment/appointment.service";
import medicationReminderService from "../../services/medicationReminder/mReminder.service";
import carePlanMedicationService from "../../services/carePlanMedication/carePlanMedication.service";
import carePlanAppointmentService from "../../services/carePlanAppointment/carePlanAppointment.service";
import vitalService from "../../services/vitals/vital.service";
import DietService from "../../services/diet/diet.service";
import WorkoutService from "../../services/workouts/workout.service";

// Fetch details from Wrappers
import CarePlanWrapper from "../../apiWrapper/web/carePlan";
import AppointmentWrapper from "../../apiWrapper/web/appointments";
import MedicationWrapper from "../../apiWrapper/web/medicationReminder";
import VitalWrapper from "../../apiWrapper/web/vitals";
import PatientWrapper from "../../apiWrapper/web/patient";
import DietWrapper from "../../apiWrapper/web/diet";
import WorkoutWrapper from "../../apiWrapper/web/workouts";
import UserRoleWrapper from "../../apiWrapper/web/userRoles";

import { createLogger } from "../../../libs/log";
import {
  EVENT_LONG_TERM_VALUE,
  EVENT_STATUS,
  EVENT_TYPE,
  USER_CATEGORY,
} from "../../../constant";
import moment from "moment";

const logger = createLogger("CARE_PLAN > HELPER");

/**
 * medicines,
 * medications,
 * appointments,
 * doctors,
 * providers = {},
 * user_roles = {},
 * schedule_events,
 */

function getTime() {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  // current year
  let year = date_ob.getFullYear();
  // current hours
  let hours = date_ob.getHours();
  // current minutes
  let minutes = date_ob.getMinutes();
  // current seconds
  let seconds = date_ob.getSeconds();

  return (
    year +
    "-" +
    month +
    "-" +
    date +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds
  );
}

export const getCarePlanDataWithImp = async ({
  carePlans = [],
  userCategory,
  doctorId,
  userRoleId,
}) => {
  try {
    let carePlanData = {};
    let carePlanIds = [];
    let appointmentIds = [];
    let medicationIds = [];
    let currentCarePlanTime = null;
    let currentCarePlanId = null;
    for (let index = 0; index < carePlans.length; index++) {
      const careplan = await CarePlanWrapper(carePlans[index]);

      const { care_plans } = await careplan.getReferenceInfoWithImp();
      carePlanData = { ...carePlanData, ...care_plans };
      carePlanIds.push(careplan.getCarePlanId());
      const {
        medication_ids,
        appointment_ids,
        basic_info: { user_role_id = null } = {},
      } = care_plans[careplan.getCarePlanId()] || {};
      // appointmentIds = [...appointmentIds, ...appointment_ids];
      // medicationIds = [...medicationIds, ...medication_ids];

      const secondaryDoctorUserRoleIds =
        careplan.getCareplnSecondaryProfiles() || [];
      const isUserRoleAllowed = [user_role_id, ...secondaryDoctorUserRoleIds]
        .map((id) => parseInt(id))
        .includes(userRoleId);
      // Get the latest Care Plan ID
      if (
        (userCategory === USER_CATEGORY.DOCTOR ||
          userCategory === USER_CATEGORY.HSP) &&
        isUserRoleAllowed
      ) {
        // if(userCategory === USER_CATEGORY.DOCTOR && doctorId === doctor_id) {
        if (
          moment(careplan.getCreatedAt()).diff(
            moment(currentCarePlanTime),
            "minutes"
          ) > 0
        ) {
          currentCarePlanTime = careplan.getCreatedAt();
          currentCarePlanId = careplan.getCarePlanId();
        }

        if (currentCarePlanTime === null) {
          currentCarePlanTime = careplan.getCreatedAt();
          currentCarePlanId = careplan.getCarePlanId();
        }
      }
    }
    return {
      care_plans: {
        ...carePlanData,
      },
      care_plan_ids: carePlanIds,
      current_care_plan_id: currentCarePlanId,
    };
  } catch (error) {
    logger.debug("Issue with getCarePlanDataWithImp catch error: ", error);
    return {};
  }
};

export const getCarePlanDataWithDoctor = async ({
  carePlans = [],
  userCategory,
  doctorId,
  userRoleId,
}) => {
  try {
    let carePlanData = {};
    for (let index = 0; index < carePlans.length; index++) {
      const careplan = await CarePlanWrapper(carePlans[index]);
      const { care_plans } = await careplan.getReferenceInfoWithSecDocDetails();
      carePlanData = { ...carePlanData, ...care_plans };
    }
    return {
      care_plans: {
        ...carePlanData,
      },
    };
  } catch (error) {
    logger.debug("getCarePlanDataWithDoctor catch error: ", error);
    return {};
  }
};

export const getCarePlanData = async ({
  carePlans = [],
  userCategory,
  doctorId,
  userRoleId,
}) => {
  try {
    let carePlanData = {};
    let carePlanIds = [];

    let appointmentData = {};
    let appointmentIds = [];

    let medicationData = {};
    let medicationIds = [];

    let medicineData = {};

    let scheduleEventData = {};

    let doctorData = {};

    let providerData = {};
    let userRoleData = {};

    let currentCarePlanTime = null;
    let currentCarePlanId = null;

    for (let index = 0; index < carePlans.length; index++) {
      const careplan = await CarePlanWrapper(carePlans[index]);
      const { care_plans, doctors, doctor_id } =
        await careplan.getReferenceInfo();
      carePlanData = { ...carePlanData, ...care_plans };
      carePlanIds.push(careplan.getCarePlanId());

      doctorData = { ...doctorData, ...doctors };

      const {
        medication_ids,
        appointment_ids,
        basic_info: { user_role_id = null } = {},
      } = care_plans[careplan.getCarePlanId()] || {};
      appointmentIds = [...appointmentIds, ...appointment_ids];
      medicationIds = [...medicationIds, ...medication_ids];

      const secondaryDoctorUserRoleIds =
        careplan.getCareplnSecondaryProfiles() || [];

      const isUserRoleAllowed = [user_role_id, ...secondaryDoctorUserRoleIds]
        .map((id) => parseInt(id))
        .includes(userRoleId);
      // get latest careplan id
      if (
        (userCategory === USER_CATEGORY.DOCTOR ||
          userCategory === USER_CATEGORY.HSP) &&
        isUserRoleAllowed
      ) {
        // if(userCategory === USER_CATEGORY.DOCTOR && doctorId === doctor_id) {
        if (
          moment(careplan.getCreatedAt()).diff(
            moment(currentCarePlanTime),
            "minutes"
          ) > 0
        ) {
          currentCarePlanTime = careplan.getCreatedAt();
          currentCarePlanId = careplan.getCarePlanId();
        }

        if (currentCarePlanTime === null) {
          currentCarePlanTime = careplan.getCreatedAt();
          currentCarePlanId = careplan.getCarePlanId();
        }
      }

      for (let index = 0; index < secondaryDoctorUserRoleIds.length; index++) {
        const userRole = await UserRoleWrapper(
          null,
          secondaryDoctorUserRoleIds[index]
        );

        const {
          user_roles: secondaryUserRoles,
          doctors: secondaryDoctors,
          providers: secondaryProviders,
        } = await userRole.getAllInfo();

        doctorData = { ...doctorData, ...secondaryDoctors };
        providerData = { ...providerData, ...secondaryProviders };
        userRoleData = { ...userRoleData, ...secondaryUserRoles };
      }
    }

    // appointments
    const allAppointments =
      (await appointmentService.getAppointmentByData({
        id: appointmentIds,
      })) || [];

    if (allAppointments.length > 0) {
      for (let index = 0; index < allAppointments.length; index++) {
        const appointment = await AppointmentWrapper(allAppointments[index]);
        const { appointments, schedule_events } =
          await appointment.getAllInfo();
        appointmentData = { ...appointmentData, ...appointments };
        scheduleEventData = { ...scheduleEventData, ...schedule_events };
      }
    }

    // medications
    const allMedications =
      (await medicationReminderService.getAllMedicationByData({
        id: medicationIds,
      })) || [];

    if (allMedications.length > 0) {
      for (let index = 0; index < allMedications.length; index++) {
        const medication = await MedicationWrapper(allMedications[index]);
        const { medications, medicines } = await medication.getReferenceInfo();
        medicationData = { ...medicationData, ...medications };
        medicineData = { ...medicineData, ...medicines };
        // TODO: add schedule data
      }
    }

    return {
      care_plans: {
        ...carePlanData,
      },
      appointments: {
        ...appointmentData,
      },
      medications: {
        ...medicationData,
      },
      medicines: {
        ...medicineData,
      },
      schedule_events: {
        ...scheduleEventData,
      },
      doctors: {
        ...doctorData,
      },
      providers: {
        ...providerData,
      },
      user_roles: {
        ...userRoleData,
      },
      care_plan_ids: carePlanIds,
      current_care_plan_id: currentCarePlanId,
    };
  } catch (error) {
    logger.debug("getCarePlanData issues catch error: ", error);
    return {};
  }
};

export const createVitals = async ({
  data = [],
  carePlanId,
  authUser,
  patientId,
}) => {
  try {
    // vitals
    let vitalData = {};
    let vitalIds = [];

    // vital templates
    let vitalTemplateData = {};

    // template vital for care plan template
    let carePlanTemplateVitals = [];

    // for sqs events
    let vitalEventsData = [];

    const {
      userId: authUserId,
      category: authCategory,
      userCategoryData: authUserCategoryData,
      userRoleId: authUserRole,
    } = authUser || {};

    // patient
    const patient = await PatientWrapper(null, patientId);

    if (data.length > 0) {
      for (let index = 0; index < data.length; index++) {
        const {
          vital_template_id,
          repeat_interval_id,
          start_date,
          end_date,
          repeat_days,
          description,
        } = data[index];

        const addedVital = await vitalService.addVital({
          vital_template_id,
          start_date,
          end_date,
          details: {
            repeat_interval_id,
            repeat_days,
            description,
          },
          care_plan_id: carePlanId,
        });

        const vital = await VitalWrapper({ data: addedVital });
        const { vitals, vital_templates } = await vital.getReferenceInfo();

        vitalData = { ...vitalData, ...vitals };
        vitalIds.push(vital.getVitalId());

        vitalTemplateData = { ...vitalTemplateData, ...vital_templates };

        carePlanTemplateVitals.push({
          vital_template_id,
          details: {
            description,
            repeat_interval_id,
            repeat_days,
            duration: end_date
              ? moment(end_date).diff(moment(start_date), "days")
              : EVENT_LONG_TERM_VALUE,
          },
        });

        // update vitalEvents for sqs
        vitalEventsData.push({
          type: EVENT_TYPE.VITALS,
          patient_id: patient.getPatientId(),
          patientUserId: patient.getUserId(),
          event_id: vital.getVitalId(),
          event_type: EVENT_TYPE.VITALS,
          critical: false,
          start_date,
          end_date,
          details: vital.getBasicInfo(),
          participants: [authUserId, patient.getUserId()],
          actor: {
            id: authUserId,
            user_role_id: authUserRole,
            category: authCategory,
            userCategoryData: authUserCategoryData,
          },
          vital_templates: vital_templates[vital.getVitalTemplateId()],
        });
      }
    }

    return {
      carePlanTemplateVitals,
      vitalEventsData,
      vitals: vitalData,
      vital_ids: vitalIds,
      vital_templates: vitalTemplateData,
    };
  } catch (error) {
    logger.debug("createVitals catch error: ", error);
    return {};
  }
};

export const createDiet = async ({
  data = [],
  carePlanId,
  authUser,
  patientId,
}) => {
  try {
    // vitals
    let allDiets = {};
    let allFoodGroups = {};
    let allPortions = {};
    let allFoodItems = {};
    let allFoodItemDetails = {};

    let dietIds = [];

    // template vital for care plan template
    let carePlanTemplateDiets = [];

    // for sqs events
    let dietEventData = [];

    const {
      userId: authUserId,
      category: authCategory,
      userCategoryData: { basic_info: { full_name } = {} },
      userCategoryData: authUserCategoryData,
      userRoleId: authUserRole,
    } = authUser || {};

    // patient
    const patient = await PatientWrapper(null, patientId);

    const dietService = new DietService();

    if (data.length > 0) {
      for (let index = 0; index < data.length; index++) {
        const {
          name = "",
          start_date,
          end_date,
          total_calories = null,
          details: {
            repeat_days = [],
            not_to_do = "",
            diet_food_groups = {},
          } = {},
        } = data[index];

        const dietId = await dietService.create({
          name,
          start_date,
          end_date,
          total_calories,
          diet_food_groups,
          details: { not_to_do, repeat_days },
          care_plan_id: carePlanId,
        });

        const dietWrapper = await DietWrapper({ id: dietId });

        const { diets, food_groups, portions, food_items, food_item_details } =
          await dietWrapper.getReferenceInfo();

        allDiets = { ...allDiets, ...diets };
        allFoodGroups = { ...allFoodGroups, ...food_groups };
        allPortions = { ...allPortions, ...portions };
        allFoodItems = { ...allFoodItems, ...food_items };
        allFoodItemDetails = { ...allFoodItemDetails, ...food_item_details };
        dietIds.push(dietId);

        carePlanTemplateDiets.push({
          name,
          total_calories,
          duration: end_date
            ? moment(end_date).diff(moment(start_date), "days")
            : EVENT_LONG_TERM_VALUE,
          details: {
            not_to_do,
            repeat_days,
            diet_food_groups,
          },
        });

        // update dietEvents for sqs
        dietEventData.push({
          type: EVENT_TYPE.DIET,
          patient_id: patient.getPatientId(),
          event_id: dietWrapper.getId(),
          status: EVENT_STATUS.SCHEDULED,
          start_date,
          end_date,
          participants: [authUserId, patient.getUserId()],
          actor: {
            id: authUserId,
            user_role_id: authUserRole,
            details: { name: full_name, category: authCategory },
          },
        });
      }
    }

    return {
      carePlanTemplateDiets,
      dietEventData,
      diets: allDiets,
      food_groups: allFoodGroups,
      food_items: allFoodItems,
      food_item_details: allFoodItemDetails,
      portions: allPortions,
      diet_ids: dietIds,
    };
  } catch (error) {
    logger.debug("createDiet catch error: ", error);
    return {};
  }
};

export const createWorkout = async ({
  data = [],
  carePlanId,
  authUser,
  patientId,
}) => {
  try {
    let allWorkouts = {};
    let allExerciseGroups = {};
    let allRepetitions = {};
    let allExercises = {};
    let allExerciseDetails = {};

    let workoutIds = [];

    // template workout for care plan template
    let carePlanTemplateWorkouts = [];

    // for sqs events
    let workoutEventData = [];

    const {
      userId: authUserId,
      category: authCategory,
      userCategoryData: { basic_info: { full_name } = {} },
      userCategoryData: authUserCategoryData,
      userRoleId: authUserRole,
    } = authUser || {};

    // patient
    const patient = await PatientWrapper(null, patientId);

    const workoutService = new WorkoutService();

    if (data.length > 0) {
      for (let index = 0; index < data.length; index++) {
        const {
          name = "",
          start_date,
          end_date,
          total_calories = null,
          time,
          details: {
            repeat_days = [],
            not_to_do = "",
            workout_exercise_groups = [],
          } = {},
        } = data[index];

        const workoutId = await workoutService.create({
          name,
          time,
          start_date,
          end_date,
          total_calories,
          workout_exercise_groups,
          details: { not_to_do, repeat_days },
          care_plan_id: carePlanId,
        });

        const workoutWrapper = await WorkoutWrapper({ id: workoutId });

        const {
          workouts,
          exercise_groups,
          exercises,
          exercise_details,
          repetitions,
        } = await workoutWrapper.getReferenceInfo();

        allWorkouts = { ...allWorkouts, ...workouts };
        allExerciseGroups = { ...allExerciseGroups, ...exercise_groups };
        allRepetitions = { ...allRepetitions, ...repetitions };
        allExercises = { ...allExercises, ...exercises };
        allExerciseDetails = { ...allExerciseDetails, ...exercise_details };
        workoutIds.push(workoutId);

        carePlanTemplateWorkouts.push({
          name,
          total_calories,
          duration: end_date
            ? moment(end_date).diff(moment(start_date), "days")
            : EVENT_LONG_TERM_VALUE,
          time,
          details: {
            not_to_do,
            repeat_days,
            workout_exercise_groups,
            exercise_detail_ids: Object.keys(allExerciseDetails) || [],
          },
        });

        // update dietEvents for sqs
        workoutEventData.push({
          type: EVENT_TYPE.WORKOUT,
          patient_id: patient.getPatientId(),
          event_id: workoutWrapper.getId(),
          start_date,
          end_date,
          participants: [authUserId, patient.getUserId()],
          actor: {
            id: authUserId,
            user_role_id: authUserRole,
            details: { name: full_name, category: authCategory },
          },
        });
      }
    }

    return {
      carePlanTemplateWorkouts,
      workoutEventData,
      workouts: allWorkouts,
      exercise_groups: allExerciseGroups,
      exercises: allExercises,
      exercise_details: allExerciseDetails,
      repetitions: allRepetitions,
      workout_ids: workoutIds,
    };
  } catch (error) {
    logger.debug("createWorkout catch error: ", error);
    return {};
  }
};

export const getCarePlanAppointmentIds = async (carePlanId) => {
  let carePlanAppointments =
    await carePlanAppointmentService.getAppointmentsByCarePlanId(carePlanId);
  let carePlanAppointmentIds = [];
  for (let appointment of carePlanAppointments) {
    let appointmentId = appointment.get("appointment_id");
    carePlanAppointmentIds.push(appointmentId);
  }

  return carePlanAppointmentIds;
};

export const getCarePlanMedicationIds = async (carePlanId) => {
  let carePlanMedications =
    await carePlanMedicationService.getMedicationsByCarePlanId(carePlanId);
  let carePlanMedicationIds = [];

  for (let medication of carePlanMedications) {
    let medicationId = medication.get("medication_id");
    carePlanMedicationIds.push(medicationId);
  }

  return carePlanMedicationIds;
};

export const getCarePlanSeverityDetails = async (carePlanId) => {
  let carePlan = await carePlanService.getCarePlanById(carePlanId);

  const carePlanApiWrapper = await CarePlanWrapper(carePlan);

  let treatment = "";
  let severity = "";
  let condition = "";
  let carePlanTemplate = {};

  const templateId = carePlanApiWrapper.getCarePlanTemplateId();
  if (templateId) {
    carePlanTemplate = await carePlanTemplateService.getCarePlanTemplateById(
      templateId
    );
  }
  if (templateId && carePlanTemplate) {
    treatment = carePlanTemplate.get("treatment_id")
      ? carePlanTemplate.get("treatment_id")
      : "";
    severity = carePlanTemplate.get("severity_id")
      ? carePlanTemplate.get("severity_id")
      : "";
    condition = carePlanTemplate.get("condition_id")
      ? carePlanTemplate.get("condition_id")
      : "";
  } else {
    let details = carePlanApiWrapper.getCarePlanDetails();
    treatment = details.treatment_id;
    severity = details.severity_id;
    condition = details.condition_id;
  }

  return {
    treatment_id: treatment,
    severity_id: severity,
    condition_id: condition,
  };
};
