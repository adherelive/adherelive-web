import carePlanService from "../../../services/carePlan/carePlan.service";
import carePlanTemplateService from "../../../services/carePlanTemplate/carePlanTemplate.service";
import vitalService from "../../../services/vitals/vital.service";
import appointmentService from "../../../services/appointment/appointment.service";
import medicationReminderService from "../../../services/medicationReminder/mReminder.service";
import carePlanMedicationService from "../../../services/carePlanMedication/carePlanMedication.service";
import carePlanAppointmentService from "../../../services/carePlanAppointment/carePlanAppointment.service";

import DietService from "../../../services/diet/diet.service";
import WorkoutService from "../../../services/workouts/workout.service";

// services
// wrappers
import CarePlanWrapper from "../../../apiWrapper/mobile/carePlan";
import AppointmentWrapper from "../../../apiWrapper/mobile/appointments";
import MedicationWrapper from "../../../apiWrapper/mobile/medicationReminder";
import VitalWrapper from "../../../apiWrapper/mobile/vitals";
import PatientWrapper from "../../../apiWrapper/mobile/patient";
import DietWrapper from "../../../apiWrapper/mobile/diet";
import WorkoutWrapper from "../../../apiWrapper/mobile/workouts";
import UserRoleWrapper from "../../../apiWrapper/mobile/userRoles";

import { createLogger } from "../../../../libs/logger";
import {
  EVENT_LONG_TERM_VALUE,
  EVENT_STATUS,
  EVENT_TYPE,
  USER_CATEGORY,
} from "../../../../constant";
import moment from "moment";

const logger = createLogger("CARE_PLAN > HELPER");

export const getCarePlanDataWithImp = async ({
  carePlans = [],
  userCategory,
  userRoleId,
}) => {
  try {
    let carePlanData = {};
    let carePlanIds = [];
    let appointmentIds = [];

    let medicationData = {};
    let medicationIds = [];

    let scheduleEventData = {};

    let doctorData = {};

    let providerData = {};
    let userRoleData = {};

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

      const secondaryDoctorUserRoleIds =
        careplan.getCareplnSecondaryProfiles() || [];
      appointmentIds = [...appointmentIds, ...appointment_ids];
      medicationIds = [...medicationIds, ...medication_ids];

      const isUserRoleAllowed = [user_role_id, ...secondaryDoctorUserRoleIds]
        .map((id) => parseInt(id))
        .includes(userRoleId);

      if (
        (userCategory === USER_CATEGORY.DOCTOR ||
          userCategory === USER_CATEGORY.HSP) &&
        isUserRoleAllowed
      ) {
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
        // check done
        const {
          user_roles: secondaryUserRoles,
          providers: secondaryProviders,
        } = await userRole.getAllInfoWithImp();

        providerData = { ...providerData, ...secondaryProviders };
        userRoleData = { ...userRoleData, ...secondaryUserRoles };
      }
    }

    logger.debug(`currentCarePlanId ${currentCarePlanId}`);
    // medications
    const allMedications =
      (await medicationReminderService.getAllMedicationByData({
        id: medicationIds,
      })) || [];

    if (allMedications.length > 0) {
      for (let index = 0; index < allMedications.length; index++) {
        const medication = await MedicationWrapper(allMedications[index]);
        // check done.
        const { medications, schedule_events } =
          await medication.getReferenceInfoWithImp();
        medicationData = { ...medicationData, ...medications };
        scheduleEventData = { ...scheduleEventData, ...schedule_events };
      }
    }

    return {
      medications: {
        ...medicationData,
      },
      care_plans: {
        ...carePlanData,
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
    logger.error("getCarePlanData catch error", error);
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

      const secondaryDoctorUserRoleIds =
        careplan.getCareplnSecondaryProfiles() || [];
      appointmentIds = [...appointmentIds, ...appointment_ids];
      medicationIds = [...medicationIds, ...medication_ids];

      // get latest careplan id
      // logger.debug("7123731 careplan --> ", careplan.getCreatedAt());
      // logger.debug("71237312 careplan --> ", moment(currentCarePlanTime));

      const isUserRoleAllowed = [user_role_id, ...secondaryDoctorUserRoleIds]
        .map((id) => parseInt(id))
        .includes(userRoleId);

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

    logger.debug(`getCarePlanData currentCarePlanId ${currentCarePlanId}`);

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
        const { medications, medicines, schedule_events } =
          await medication.getReferenceInfo();
        medicationData = { ...medicationData, ...medications };
        medicineData = { ...medicineData, ...medicines };
        scheduleEventData = { ...scheduleEventData, ...schedule_events };
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
    logger.error("getCarePlanData catch error", error);
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

    // template vital for careplan template
    let carePlanTemplateVitals = [];

    // for sqs events
    let vitalEventsData = [];

    const {
      userId: authUserId,
      category: authCategory,
      userCategoryData: authUserCategoryData,
      userRoleId: authUserRoleId,
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
          description,
          details: {
            repeat_interval_id,
            repeat_days,
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
            user_role_id: authUserRoleId,
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
    logger.error("createVitals catch error", error);
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

    // template vital for careplan template
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
          duration = null,
          details: {
            repeat_days = [],
            not_to_do = "",
            diet_food_groups = {},
          } = {},
        } = data[index];

        let startDate = start_date;
        let endDate = end_date;
        if (duration) {
          startDate = moment().utc().toISOString();
          endDate = moment().add("days", duration).utc().toISOString();
        }

        const dietId = await dietService.create({
          name,
          start_date: startDate,
          end_date: endDate,
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
            food_item_detail_ids: Object.keys(allFoodItemDetails) || [],
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
    logger.error("createDiet catch error", error);
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

    // template workout for careplan template
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
          duration = null,
          details: {
            repeat_days = [],
            not_to_do = "",
            workout_exercise_groups = [],
          } = {},
        } = data[index];

        let startDate = start_date;
        let endDate = end_date;
        if (duration) {
          startDate = moment().utc().toISOString();
          endDate = moment().add("days", duration).utc().toISOString();
        }

        const workoutId = await workoutService.create({
          name,
          time,
          start_date: startDate,
          end_date: endDate,
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
    logger.error("createWorkout catch error", error);
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
