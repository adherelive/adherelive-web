import Logger from "../../../libs/log";
import { EVENT_TYPE, USER_CATEGORY } from "../../../constant";

// Services
import CarePlanService from "../../services/carePlan/carePlan.service";
import EventService from "../../services/scheduleEvents/scheduleEvent.service";
import patientService from "../../services/patients/patients.service";
import userRoleService from "../../services/userRoles/userRoles.service";

// Wrappers
import CarePlanWrapper from "../../apiWrapper/web/carePlan";
import EventWrapper from "../../apiWrapper/common/scheduleEvents";
import PatientWrapper from "../../apiWrapper/web/patient";
import DietWrapper from "../../apiWrapper/web/diet";
import WorkoutWrppaer from "../../apiWrapper/web/workouts";

const Log = new Logger("EVENT HELPER");

export const doctorChart = async (req) => {
  try {
    const { userDetails: { userRoleId, userCategoryId: doctor_id } = {} } = req;
    Log.info(`DOCTOR ID (doctor_id) : ${doctor_id}`);

    return await getAllDataForDoctors({ doctor_id, user_role_id: userRoleId });
  } catch (error) {
    Log.debug("doctorChart catch error: ", error);
    throw error;
  }
};

export const doctorChartCount = async (req) => {
  try {
    const { userDetails: { userRoleId, userCategoryId: doctor_id } = {} } = req;
    Log.info(`DOCTOR ID (doctor_id) : ${doctor_id}`);

    return await getAllDataForDoctorsCount({
      doctor_id,
      user_role_id: userRoleId,
    });
  } catch (error) {
    Log.debug("doctorChartCount catch error: ", error);
    throw error;
  }
};

export const doctorChartEventDetails = async (req) => {
  try {
    const {
      query: { event_type: event_type = null } = {},
      userDetails: { userRoleId, userCategoryId: doctor_id } = {},
    } = req;

    Log.info(`DOCTOR ID (doctor_id) : ${doctor_id}`);

    return await getAllDataForDoctorsByEventType({
      event_type,
      doctor_id,
      user_role_id: userRoleId,
    });
  } catch (error) {
    Log.debug("doctorChart catch error", error);
    throw error;
  }
};

export const hspChart = async (req) => {
  try {
    const { userDetails: { userRoleId, userCategoryId: doctor_id } = {} } = req;
    Log.info(`DOCTOR ID (doctor_id) : ${doctor_id}`);

    return await getAllDataForDoctorsCount({
      doctor_id,
      user_role_id: userRoleId,
      category: USER_CATEGORY.HSP,
    });
  } catch (error) {
    Log.debug("doctorChart catch error", error);
    throw error;
  }
};

export const hspChartEventDetails = async (req) => {
  try {
    const {
      query: { event_type: event_type = null } = {},
      userDetails: { userRoleId, userCategoryId: doctor_id } = {},
    } = req;
    Log.info(`DOCTOR ID (doctor_id) : ${doctor_id}`);

    return await getAllDataForDoctorsByEventType({
      event_type,
      doctor_id,
      user_role_id: userRoleId,
      category: USER_CATEGORY.HSP,
    });
  } catch (error) {
    Log.debug("doctorChart catch error", error);
    throw error;
  }
};

export const hspChartCount = async (req) => {
  try {
    const { userDetails: { userRoleId, userCategoryId: doctor_id } = {} } = req;
    Log.info(`DOCTOR ID (doctor_id) : ${doctor_id}`);

    return await getAllDataForDoctorsCount({
      doctor_id,
      user_role_id: userRoleId,
      category: USER_CATEGORY.HSP,
    });
  } catch (error) {
    Log.debug("doctorChart catch error", error);
    throw error;
  }
};

export const providerChart = async (req) => {
  try {
    const { userDetails: { userRoleId, userCategoryId: provider_id } = {} } =
      req;
    Log.info(`PROVIDER ID (provider_id) : ${provider_id}`);
    // get all doctors attached to provider
    // const doctorData = await doctorProviderMappingService.getAllDoctorIds(provider_id) || [];

    // Log.debug("doctorData", doctorData);
    // const doctorIds = doctorData.map(data => data.doctor_id);

    // Log.debug("doctorIds", doctorData);
    let allDoctorsData = {};

    const { count = 0, rows = [] } = await userRoleService.findAndCountAll({
      where: {
        linked_id: provider_id,
      },
      attributes: ["id"],
    });

    if (count) {
      for (let each in rows) {
        const { id: user_role_id } = rows[each] || {};
        const [response, responseMessage] = await getAllDataForDoctors({
          doctor_id: null,
          doctorIds: [],
          user_role_id,
          category: USER_CATEGORY.PROVIDER,
        });
        const {
          missed_medications: p_missed_medications = {},
          medication_ids: {
            critical: p_medication_ids_critical = [],
            non_critical: p_medication_ids_non_critical = [],
          } = {},
          missed_appointments: p_missed_appointments = {},
          appointment_ids: {
            critical: p_appointment_ids_critical = [],
            non_critical: p_appointment_ids_non_critical = [],
          } = {},
          missed_vitals: p_missed_vitals = {},
          vital_ids: {
            critical: p_vital_ids_critical = [],
            non_critical: p_vital_ids_non_critical = [],
          } = {},
          missed_diets: p_missed_diets = {},
          diet_ids: {
            critical: p_diet_ids_critical = [],
            non_critical: p_diet_ids_non_critical = [],
          } = {},
          missed_workouts: p_missed_workouts = {},
          workout_ids: {
            critical: p_workout_ids_critical = [],
            non_critical: p_workout_ids_non_critical = [],
          } = {},
          patients: p_patients = {},
        } = response || {};

        const {
          missed_medications = {},
          medication_ids: {
            critical: medication_ids_critical = [],
            non_critical: medication_ids_non_critical = [],
          } = {},
          missed_appointments = {},
          appointment_ids: {
            critical: appointment_ids_critical = [],
            non_critical: appointment_ids_non_critical = [],
          } = {},
          missed_vitals = {},
          vital_ids: {
            critical: vital_ids_critical = [],
            non_critical: vital_ids_non_critical = [],
          } = {},
          missed_diets = {},
          diet_ids: {
            critical: diet_ids_critical = [],
            non_critical: diet_ids_non_critical = [],
          } = {},
          missed_workouts = {},
          workout_ids: {
            critical: workout_ids_critical = [],
            non_critical: workout_ids_non_critical = [],
          } = {},
          patients = {},
        } = allDoctorsData || {};

        allDoctorsData = {
          missed_medications: {
            ...missed_medications,
            ...p_missed_medications,
          },
          missed_appointments: {
            ...missed_appointments,
            ...p_missed_appointments,
          },
          missed_vitals: { ...missed_vitals, ...p_missed_vitals },
          missed_diets: { ...missed_diets, ...p_missed_diets },
          missed_workouts: { ...missed_workouts, ...p_missed_workouts },

          medication_ids: {
            critical: [
              ...medication_ids_critical,
              ...p_medication_ids_critical,
            ],
            non_critical: [
              ...medication_ids_non_critical,
              ...p_medication_ids_non_critical,
            ],
          },
          appointment_ids: {
            critical: [
              ...appointment_ids_critical,
              ...p_appointment_ids_critical,
            ],
            non_critical: [
              ...appointment_ids_non_critical,
              ...p_appointment_ids_non_critical,
            ],
          },
          vital_ids: {
            critical: [...vital_ids_critical, ...p_vital_ids_critical],
            non_critical: [
              ...vital_ids_non_critical,
              ...p_vital_ids_non_critical,
            ],
          },
          diet_ids: {
            critical: [...diet_ids_critical, ...p_diet_ids_critical],
            non_critical: [
              ...diet_ids_non_critical,
              ...p_diet_ids_non_critical,
            ],
          },
          workout_ids: {
            critical: [...workout_ids_critical, ...p_workout_ids_critical],
            non_critical: [
              ...workout_ids_non_critical,
              ...p_workout_ids_non_critical,
            ],
          },
          patients: { ...patients, ...p_patients },
        };
      }
    }

    return [{ ...allDoctorsData }, "Missed events fetched successfully"];
  } catch (error) {
    Log.debug("8234872364862 providerChart catch error", error);
    throw error;
  }
};

// HELPERS
const getAllDataForDoctorsByEventType = async ({
  doctor_id,
  event_type,
  category = USER_CATEGORY.PROVIDER,
  user_role_id,
}) => {
  try {
    Log.debug("user_role_id", user_role_id);
    const eventService = new EventService();

    const carePlans =
      (await CarePlanService.getCarePlanByData({
        user_role_id,
      })) || [];

    let appointmentIds = [];
    let medicationIds = [];
    let vitalIds = [];
    let dietIds = [];
    let workoutIds = [];

    for (let i = 0; i < carePlans.length; i++) {
      const carePlan = await CarePlanWrapper(carePlans[i]);
      const {
        appointment_ids = [],
        medication_ids = [],
        vital_ids = [],
        diet_ids = [],
        workout_ids = [],
      } = await carePlan.getAllInfo();

      appointmentIds = [...appointmentIds, ...appointment_ids];
      medicationIds = [...medicationIds, ...medication_ids];
      vitalIds = [...vitalIds, ...vital_ids];
      dietIds = [...dietIds, ...diet_ids];
      workoutIds = [...workoutIds, ...workout_ids];
    }

    const scheduleEvents =
      (await eventService.getMissedByDataEventType({
        appointment_ids: appointmentIds,
        event_type,
        medication_ids: medicationIds,
        vital_ids: vitalIds,
        diet_ids: dietIds,
        workout_ids: workoutIds,
      })) || [];

    let response = [
      { ...(await getFormattedDataWithoutIds(scheduleEvents, category)) },
      "Missed events fetched successfully",
    ];

    return response;
  } catch (error) {
    Log.debug("getAllDataForDoctors catch error: ", error);
    throw error;
  }
};

/**
 * Functionality:
 * Retrieves Care Plans: Fetches care plans associated with a user_role_id using "CarePlanService.getCarePlanByData"
 * Extracts IDs: Iterates through the care plans, using "CarePlanWrapper" and "getAllInfo" to extract IDs for
 *              appointments, medications, vitals, diet, and workouts.
 * Retrieves Scheduled Events: Fetches scheduled events based on the extracted IDs using
 *              "eventService.getMissedByData".
 * Formats Data: Formats the retrieved events using getFormattedData and combines them with a success message in an array.
 * Returns Response: Returns the formatted data and success message.
 * Error Handling: Includes a try...catch block to log and re-throw any errors.
 *
 * @param doctor_id
 * @param category
 * @param user_role_id
 * @returns {Promise<[{missed_medications: {}, medication_ids: {critical: [], non_critical: []},
 *           missed_appointments: {}, appointment_ids: {critical: [], non_critical: []}, missed_vitals: {},
 *           vital_ids: {critical: [], non_critical: []}, missed_diets: {}, diet_ids: {critical: [], non_critical: []},
 *           missed_workouts: {}, workout_ids: {critical: [], non_critical: []}, patients: {}},string]>}
 */
const getAllDataForDoctors = async ({
                                      doctor_id, // Not used in the current implementation
                                      category = USER_CATEGORY.PROVIDER,
                                      user_role_id,
                                    }) => {
  try {
    Log.debug("Starting getAllDataForDoctors for user_role_id:", user_role_id); // More descriptive log

    const eventService = new EventService();

    const carePlans = await CarePlanService.getCarePlanByData({ user_role_id }); // No need for || [] here

    if (!carePlans || carePlans.length === 0) {
      Log.debug("No care plans found for user_role_id:", user_role_id);
      return [[], "No care plans found"]; // Return empty data and a message
    }

    let appointmentIds = [];
    let medicationIds = [];
    let vitalIds = [];
    let dietIds = [];
    let workoutIds = [];

    // Optimized ID extraction using Promise.all
    const carePlanPromises = carePlans.map(async (carePlanData) => {
      const carePlan = await CarePlanWrapper(carePlanData);
      return carePlan.getAllInfo();
    });

    const carePlanInfos = await Promise.all(carePlanPromises);

    carePlanInfos.forEach(({ appointment_ids, medication_ids, vital_ids, diet_ids, workout_ids }) => {
      appointmentIds.push(...appointment_ids);
      medicationIds.push(...medication_ids);
      vitalIds.push(...vital_ids);
      dietIds.push(...diet_ids);
      workoutIds.push(...workout_ids);
    });

    Log.debug("Extracted IDs: ", {
      appointmentIds,
      medicationIds,
      vitalIds,
      dietIds,
      workoutIds,
    });

    const scheduleEvents = await eventService.getMissedByData({
      appointment_ids: appointmentIds,
      medication_ids: medicationIds,
      vital_ids: vitalIds,
      diet_ids: dietIds,
      workout_ids: workoutIds,
    });

    if (!scheduleEvents) {
      Log.debug("No schedule events found for the provided IDs.");
      return [[], "No schedule events found"];
    }

    Log.debug("Retrieved schedule events: ", scheduleEvents);

    const formattedData = await getFormattedData(scheduleEvents, category);

    Log.debug("Formatted data: ", formattedData);

    return [{ ...formattedData }, "Missed events fetched successfully"]; // Spread formattedData

  } catch (error) {
    Log.error("Error in getAllDataForDoctors: ", error); // Use Log.error for errors
    throw error; // Re-throw the error for higher-level handling
  }
};

/**
 * Current Functionality:
 * Retrieves Care Plans: Fetches care plans based on user_role_id.
 * Extracts IDs: Extracts event IDs (appointments, medications, vitals, etc.) from the care plans.
 * Retrieves Missed Events: Fetches missed events using eventService.getMissedByData based on the extracted IDs.
 * Formats Data: Calls getFormattedDataNew to format the retrieved events.
 * Returns Response: Returns the formatted data along with a success message.
 * Count Information:
 *    Event Counts: The function does not directly return the count of each event type.  It passes the scheduleEvents array to getFormattedDataNew, which likely processes and organizes the events but doesn't inherently calculate counts.  The returned data structure from getFormattedDataNew (which you'd need to examine) might contain count information after the formatting is done, but getAllDataForDoctorsCount itself doesn't calculate or return these counts.
 *    Patient Count: The function does not return the total patient count directly. It collects patientIds within the loop, but it's unclear if this patientIds array represents unique patients or just all patient IDs encountered across care plans.  Whether or not getFormattedDataNew uses and returns patient counts depends on its implementation.
 *
 * @param doctor_id
 * @param category
 * @param user_role_id
 * @returns {Promise<[{medication_ids: {critical: [], non_critical: []}, appointment_ids: {critical: [], non_critical: []}, vital_ids: {critical: [], non_critical: []}, diet_ids: {critical: [], non_critical: []}, workout_ids: {critical: [], non_critical: []}, patientCount: number},string]>}
 */
const getAllDataForDoctorsCount = async ({
                                           doctor_id,
                                           category = USER_CATEGORY.PROVIDER,
                                           user_role_id,
                                         }) => {
  try {
    Log.debug("user_role_id", user_role_id);
    const eventService = new EventService();

    const carePlans = (await CarePlanService.getCarePlanByData({ user_role_id })) || [];

    let appointmentIds = [];
    let medicationIds = [];
    let vitalIds = [];
    let dietIds = [];
    let workoutIds = [];
    const patientIds = new Set(); // Use a Set to store unique patient IDs

    for (const carePlanData of carePlans) { // Use for...of loop for cleaner syntax
      const carePlan = await CarePlanWrapper(carePlanData);
      const {
        appointment_ids = [],
        medication_ids = [],
        vital_ids = [],
        diet_ids = [],
        workout_ids = [],
      } = await carePlan.getAllInfo();

      appointmentIds.push(...appointment_ids);
      medicationIds.push(...medication_ids);
      vitalIds.push(...vital_ids);
      dietIds.push(...diet_ids);
      workoutIds.push(...workout_ids);

      // Add patient IDs to the Set (if applicable based on your logic)
      // Example: Assuming patient IDs are in carePlan.getAllInfo().patient_ids
      const carePlanInfo = await carePlan.getAllInfo();
      if (carePlanInfo.patient_ids) {
        carePlanInfo.patient_ids.forEach(patientId => patientIds.add(patientId));
      }
    }

    const scheduleEvents =
        (await eventService.getMissedByData({
          appointment_ids: appointmentIds,
          medication_ids: medicationIds,
          vital_ids: vitalIds,
          diet_ids: dietIds,
          workout_ids: workoutIds,
        })) || [];

    const formattedData = await getFormattedDataNew(scheduleEvents, category);
    const patientCount = patientIds.size; // Get the number of unique patients

    const response = [
      { ...formattedData, patientCount }, // Add patientCount to the response
      "Missed events fetched successfully",
    ];

    return response;
  } catch (error) {
    Log.debug("getAllDataForDoctors catch error", error);
    throw error;
  }
};

/**
 * This function getFormattedData processes an array of event objects, organizing them by type (medications, appointments, vitals, diets, workouts), criticality (critical/non-critical), and date. It also fetches patient data if the category is USER_CATEGORY.PROVIDER. Let's analyze it for optimization and clarity.
 *
 * Functionality:
 * Initialization: Initializes empty objects and arrays to store processed data.
 * Event Processing: Iterates through the events array, using EventWrapper and getAllInfo to extract relevant information. A switch statement handles different EVENT_TYPEs.
 * Data Organization: Organizes the extracted data into nested objects based on event ID and date. Also, populates critical_ids and non_critical_ids arrays for each event type.
 * Patient Data Retrieval: If the category is USER_CATEGORY.PROVIDER, it fetches patient data using patientService.getPatientByData and stores it in the patientData object.
 * Returns Formatted Data: Returns an object containing the organized event data and patient data.
 *
 * @param events
 * @param category
 * @returns {Promise<{missed_medications: {}, medication_ids: {critical: *[], non_critical: *[]},
 *        missed_appointments: {}, appointment_ids: {critical: *[], non_critical: *[]}, missed_vitals: {},
 *        vital_ids: {critical: *[], non_critical: *[]}, missed_diets: {}, diet_ids: {critical: *[], non_critical: *[]},
 *        missed_workouts: {}, workout_ids: {critical: *[], non_critical: *[]}, patients: {}}>}
 */
const getFormattedData = async (events = [], category = USER_CATEGORY.DOCTOR) => {
  const formattedData = {
    medications: {},
    medication_critical_ids: [],
    medication_non_critical_ids: [],
    appointments: {},
    appointment_critical_ids: [],
    appointment_non_critical_ids: [],
    vitals: {},
    vital_critical_ids: [],
    vital_non_critical_ids: [],
    diets: {},
    diet_critical_ids: [],
    diet_non_critical_ids: [],
    workouts: {},
    workout_critical_ids: [],
    workout_non_critical_ids: [],
    patients: {}, // Renamed to patients for consistency
  };

  if (events.length === 0) {
    return formattedData; // Early exit if no events
  }

  const eventPromises = events.map(async (eventData) => {
    const event = await EventWrapper(eventData);
    const eventInfo = await event.getAllInfo();
    return { ...eventInfo, eventType: event.getEventType(), eventId: event.getEventId(), critical: event.getCriticalValue(), date: event.getDate() }; // Include date here
  });

  const processedEvents = await Promise.all(eventPromises);

  for (const event of processedEvents) {
    const {
      start_time,
      end_time,
      details,
      details: { medicines, patient_id, medications, vital_templates, diets: event_diets, workouts: event_workouts, workout_id, diet_id } = {},
      critical,
      eventType,
      eventId,
      date
    } = event;

    switch (eventType) {
      case EVENT_TYPE.MEDICATION_REMINDER:
        if (category === USER_CATEGORY.HSP) continue;
        processEvent(formattedData.medications, formattedData.medication_critical_ids, formattedData.medication_non_critical_ids, eventId, { medicines, critical, patient_id, start_time, end_time }, date);
        break;
      case EVENT_TYPE.APPOINTMENT:
        if (category === USER_CATEGORY.PROVIDER) {
          patientIds.push(details.participant_one.category === USER_CATEGORY.PATIENT ? details.participant_one.id : details.participant_two.id);
        }
        processEvent(formattedData.appointments, formattedData.appointment_critical_ids, formattedData.appointment_non_critical_ids, eventId, { details, critical, start_time, end_time }, date);
        break;
      case EVENT_TYPE.VITALS:
        if (category === USER_CATEGORY.PROVIDER) {
          patientIds.push(patient_id);
        }
        processEvent(formattedData.vitals, formattedData.vital_critical_ids, formattedData.vital_non_critical_ids, eventId, { patient_id, critical, vital_name: details?.vital_templates?.basic_info?.name, start_time, end_time }, date);
        break;
      case EVENT_TYPE.DIET:
        const dietWrapper = await DietWrapper({ id: diet_id });
        const careplan_id = await dietWrapper.getCarePlanId();
        const carePlanWrapper = await CarePlanWrapper(null, careplan_id);
        const dietPatientId = await carePlanWrapper.getPatientId(); // Renamed to avoid shadowing

        const diet_name = details?.event_diets?.[diet_id]?.basic_info?.name;
        if (category === USER_CATEGORY.PROVIDER) {
          patientIds.push(dietPatientId);
        }
        processEvent(formattedData.diets, formattedData.diet_critical_ids, formattedData.diet_non_critical_ids, eventId, { diet_name, critical, patient_id: dietPatientId, start_time, end_time }, date);
        break;
      case EVENT_TYPE.WORKOUT:
        const workoutWrapper = await WorkoutWrppaer({ id: workout_id });
        const workout_careplan_id = await workoutWrapper.getCarePlanId();
        const workoutCareplanWrapper = await CarePlanWrapper(null, workout_careplan_id);
        const workoutPatientId = await workoutCareplanWrapper.getPatientId(); // Renamed

        const workout_name = details?.event_workouts?.[workout_id]?.basic_info?.name;

        if (category === USER_CATEGORY.PROVIDER) {
          patientIds.push(workoutPatientId);
        }
        processEvent(formattedData.workouts, formattedData.workout_critical_ids, formattedData.workout_non_critical_ids, eventId, { workout_name, critical, patient_id: workoutPatientId, start_time, end_time }, date);
        break;
    }
  }

  if (category === USER_CATEGORY.PROVIDER && patientIds.length > 0) {
    const allPatients = await patientService.getPatientByData({ id: patientIds });
    if (allPatients) { // Check if allPatients is not null or undefined
      for (const patientData of allPatients) {
        const patient = await PatientWrapper(patientData);
        const { user_role_id, care_plan_id } = await patient.getAllInfo();
        formattedData.patients[patient.getPatientId()] = {
          ...patient.getBasicInfo(),
          user_role_id,
          care_plan_id,
        };
      }
    }
  }

  return formattedData; // Corrected: Added the return statement
};

/**
 *
 * @param events
 * @param criticalIds
 * @param nonCriticalIds
 * @param eventId
 * @param eventData
 * @param date
 */
const processEvent = (events, criticalIds, nonCriticalIds, eventId, eventData, date) => {
  if (!(eventId in events)) {
    const timings = {};
    timings[date] = []; // Use the passed date here
    timings[date].push({ start_time: eventData.start_time, end_time: eventData.end_time });
    events[eventId] = { ...eventData, timings };
  } else {
    const { timings } = events[eventId];
    if (!Object.keys(timings).includes(date)) { // Use passed-in date
      timings[date] = []; // Use passed-in date
    }
    timings[date].push({ start_time: eventData.start_time, end_time: eventData.end_time });
    events[eventId] = { ...events[eventId], timings };
  }

  if (eventData.critical) {
    criticalIds.indexOf(eventId) === -1 ? criticalIds.push(eventId) : null;
  } else {
    nonCriticalIds.indexOf(eventId) === -1 ? nonCriticalIds.push(eventId) : null;
  }
};


const getFormattedDataWithoutIds = async (
  events = [],
  category = USER_CATEGORY.DOCTOR
) => {
  let medications = {};
  let appointments = {};
  let vitals = {};
  let diets = {};
  let workouts = {};
  let patientIds = [];

  for (let i = 0; i < events.length; i++) {
    const event = await EventWrapper(events[i]);
    const {
      start_time,
      end_time,
      details,
      details: {
        medicines,
        patient_id,
        medications: { participant_id } = {},
        vital_templates: { basic_info: { name: vital_name } = {} } = {},
        participant_one = {},
        participant_two = {},
        diets: event_diets = {},
        workouts: event_workouts = {},
        workout_id = null,
        diet_id = null,
      } = {},
      critical,
    } = event.getAllInfo();

    switch (event.getEventType()) {
      case EVENT_TYPE.MEDICATION_REMINDER:
        if (category === USER_CATEGORY.HSP) {
          continue;
        }

        if (!(event.getEventId() in medications)) {
          if (category === USER_CATEGORY.PROVIDER) {
            patientIds.push(participant_id);
          }
          const timings = {};
          timings[event.getDate()] = [];
          timings[event.getDate()].push({ start_time, end_time });
          medications[event.getEventId()] = {
            medicines,
            critical,
            participant_id,
            timings,
          };
        } else {
          const { timings } = medications[event.getEventId()] || {};
          if (!Object.keys(timings).includes(event.getDate())) {
            timings[event.getDate()] = [];
          }
          timings[event.getDate()].push({ start_time, end_time });
          medications[event.getEventId()] = {
            ...medications[event.getEventId()],
            timings,
          };
        }

        break;

      case EVENT_TYPE.APPOINTMENT:
        if (category === USER_CATEGORY.PROVIDER) {
          if (participant_one.category === USER_CATEGORY.PATIENT) {
            patientIds.push(participant_one.id);
          } else {
            patientIds.push(participant_two.id);
          }
        }
        if (!(event.getEventId() in appointments)) {
          appointments[event.getEventId()] = [];
          appointments[event.getEventId()].push(event.getAllInfo());
        } else {
          appointments[event.getEventId()].push(event.getAllInfo());
        }
        break;
      case EVENT_TYPE.VITALS:
        if (category === USER_CATEGORY.PROVIDER) {
          patientIds.push(patient_id);
        }

        if (!(event.getEventId() in vitals)) {
          const timings = {};
          timings[event.getDate()] = [];
          timings[event.getDate()].push({ start_time, end_time });
          vitals[event.getEventId()] = {
            patient_id,
            critical,
            vital_name,
            timings,
          };
        } else {
          const { timings = {} } = vitals[event.getEventId()] || {};
          if (!Object.keys(timings).includes(event.getDate())) {
            timings[event.getDate()] = [];
          }
          timings[event.getDate()].push({ start_time, end_time });
          vitals[event.getEventId()] = {
            ...vitals[event.getEventId()],
            timings,
          };
        }
        break;

      case EVENT_TYPE.DIET:
        const dietWrapper = await DietWrapper({ id: diet_id });
        const careplan_id = await dietWrapper.getCarePlanId();
        const carePlanWrapper = await CarePlanWrapper(null, careplan_id);
        const patientId = await carePlanWrapper.getPatientId();

        const { basic_info: { name: diet_name = "" } = {} } =
          event_diets[diet_id] || {};
        if (!(event.getEventId() in diets)) {
          if (category === USER_CATEGORY.PROVIDER) {
            patientIds.push(patientId);
          }
          const timings = {};
          timings[event.getDate()] = [];
          timings[event.getDate()].push({ start_time, end_time });
          diets[event.getEventId()] = {
            diet_name,
            participant_id: patientId,
            timings,
            critical,
          };
        } else {
          const { timings } = diets[event.getEventId()] || {};
          if (!Object.keys(timings).includes(event.getDate())) {
            timings[event.getDate()] = [];
          }
          timings[event.getDate()].push({ start_time, end_time });
          diets[event.getEventId()] = { ...diets[event.getEventId()], timings };
        }

        break;

      case EVENT_TYPE.WORKOUT:
        const workoutWrapper = await WorkoutWrppaer({ id: workout_id });
        const workout_careplan_id = await workoutWrapper.getCarePlanId();
        const workoutCareplanWrapper = await CarePlanWrapper(
          null,
          workout_careplan_id
        );
        const workoutPatientId = await workoutCareplanWrapper.getPatientId();

        const { basic_info: { name: workout_name = "" } = {} } =
          event_workouts[workout_id] || {};
        if (!(event.getEventId() in workouts)) {
          if (category === USER_CATEGORY.PROVIDER) {
            patientIds.push(workoutPatientId);
          }
          const timings = {};
          timings[event.getDate()] = [];
          timings[event.getDate()].push({ start_time, end_time });
          workouts[event.getEventId()] = {
            workout_name,
            participant_id: workoutPatientId,
            timings,
            critical,
          };
        } else {
          const { timings } = workouts[event.getEventId()] || {};
          if (!Object.keys(timings).includes(event.getDate())) {
            timings[event.getDate()] = [];
          }
          timings[event.getDate()].push({ start_time, end_time });
          workouts[event.getEventId()] = {
            ...workouts[event.getEventId()],
            timings,
          };
        }

        break;
    }
  }

  let patientData = {};

  if (patientIds.length > 0) {
    const allPatients =
      (await patientService.getPatientByData({
        id: patientIds,
      })) || [];

    for (let index = 0; index < allPatients.length; index++) {
      const patient = await PatientWrapper(allPatients[index]);
      const { user_role_id = null, care_plan_id = null } =
        await patient.getAllInfo();
      patientData[patient.getPatientId()] = {
        ...patient.getBasicInfo(),
        user_role_id,
        care_plan_id,
      };
    }
  }

  return {
    // medications
    missed_medications: medications,
    // appointments
    missed_appointments: appointments,
    // actions (vitals)
    missed_vitals: vitals,
    // diets
    missed_diets: diets,
    // actions (vitals)
    missed_workouts: workouts,
    // for provider related api call
    patients: {
      ...patientData,
    },
  };
};

const getFormattedDataNew = async (
  events = [],
  category = USER_CATEGORY.DOCTOR
) => {
  let medication_critical_ids = [];
  let medication_non_critical_ids = [];
  let appointment_critical_ids = [];
  let appointment_non_critical_ids = [];
  let vital_critical_ids = [];
  let vital_non_critical_ids = [];
  let diet_critical_ids = [];
  let diet_non_critical_ids = [];
  let workout_critical_ids = [];
  let workout_non_critical_ids = [];

  for (let i = 0; i < events.length; i++) {
    const event = await EventWrapper(events[i]);
    switch (event.getEventType()) {
      case EVENT_TYPE.MEDICATION_REMINDER:
        if (category === USER_CATEGORY.HSP) {
          continue;
        }

        if (event.getCriticalValue()) {
          medication_critical_ids.indexOf(event.getEventId()) === -1
            ? medication_critical_ids.push(event.getEventId())
            : null;
        } else {
          medication_non_critical_ids.indexOf(event.getEventId()) === -1
            ? medication_non_critical_ids.push(event.getEventId())
            : null;
        }
        break;

      case EVENT_TYPE.APPOINTMENT:
        if (event.getCriticalValue()) {
          appointment_critical_ids.indexOf(event.getEventId()) === -1
            ? appointment_critical_ids.push(event.getEventId())
            : null;
        } else {
          appointment_non_critical_ids.indexOf(event.getEventId()) === -1
            ? appointment_non_critical_ids.push(event.getEventId())
            : null;
        }
        break;
      case EVENT_TYPE.VITALS:
        if (event.getCriticalValue()) {
          vital_critical_ids.indexOf(event.getEventId()) === -1
            ? vital_critical_ids.push(event.getEventId())
            : null;
        } else {
          vital_non_critical_ids.indexOf(event.getEventId()) === -1
            ? vital_non_critical_ids.push(event.getEventId())
            : null;
        }
        break;

      case EVENT_TYPE.DIET:
        if (event.getCriticalValue()) {
          diet_critical_ids.indexOf(event.getEventId()) === -1
            ? diet_critical_ids.push(event.getEventId())
            : null;
        } else {
          diet_non_critical_ids.indexOf(event.getEventId()) === -1
            ? diet_non_critical_ids.push(event.getEventId())
            : null;
        }
        break;

      case EVENT_TYPE.WORKOUT:
        if (event.getCriticalValue()) {
          workout_critical_ids.indexOf(event.getEventId()) === -1
            ? workout_critical_ids.push(event.getEventId())
            : null;
        } else {
          workout_non_critical_ids.indexOf(event.getEventId()) === -1
            ? workout_non_critical_ids.push(event.getEventId())
            : null;
        }
        break;
    }
  }

  return {
    medication_ids: {
      critical: medication_critical_ids,
      non_critical: medication_non_critical_ids,
    },
    appointment_ids: {
      critical: appointment_critical_ids,
      non_critical: appointment_non_critical_ids,
    },
    vital_ids: {
      critical: vital_critical_ids,
      non_critical: vital_non_critical_ids,
    },
    diet_ids: {
      critical: diet_critical_ids,
      non_critical: diet_non_critical_ids,
    },
    workout_ids: {
      critical: workout_critical_ids,
      non_critical: workout_non_critical_ids,
    },
  };
};
