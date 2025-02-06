import { createLogger } from "../../../libs/logger";
import { EVENT_TYPE, USER_CATEGORY } from "../../../constant";

// Services
import CarePlanService from "../../services/carePlan/carePlan.service";
import EventService from "../../services/scheduleEvents/scheduleEvent.service";
import patientService from "../../services/patients/patients.service";
import userRoleService from "../../services/userRoles/userRoles.service";
// wrappers
import CarePlanWrapper from "../../apiWrapper/web/carePlan";
import EventWrapper from "../../apiWrapper/common/scheduleEvents";
import PatientWrapper from "../../apiWrapper/web/patient";
import DietWrapper from "../../apiWrapper/web/diet";
import WorkoutWrapper from "../../apiWrapper/web/workouts";

const logger = createLogger("EVENT HELPER");

export const doctorChart = async (req) => {
  try {
    const { userDetails: { userRoleId, userCategoryId: doctor_id } = {} } = req;
    logger.debug(`Doctor ID (doctor_id): ${doctor_id}`);

    return await getAllDataForDoctors({ doctor_id, user_role_id: userRoleId });
  } catch (error) {
    logger.error("doctorChart catch error: ", error);
    throw error;
  }
};

export const doctorChartCount = async (req) => {
  try {
    const { userDetails: { userRoleId, userCategoryId: doctor_id } = {} } = req;
    logger.debug(`Doctor ID (doctor_id): ${doctor_id}`);

    return await getAllDataForDoctorsCount({
      doctor_id,
      user_role_id: userRoleId,
    });
  } catch (error) {
    logger.error("doctorChartCount catch error: ", error);
    throw error;
  }
};

export const doctorChartEventDetails = async (req) => {
  try {
    const {
      query: { event_type: event_type = null } = {},
      userDetails: { userRoleId, userCategoryId: doctor_id } = {},
    } = req;

    logger.debug(`Doctor ID (doctor_id): ${doctor_id}`);

    return await getAllDataForDoctorsByEventType({
      event_type,
      doctor_id,
      user_role_id: userRoleId,
    });
  } catch (error) {
    logger.error("doctorChartEventDetails catch error", error);
    throw error;
  }
};

export const hspChart = async (req) => {
  try {
    const { userDetails: { userRoleId, userCategoryId: doctor_id } = {} } = req;
    logger.debug(`Doctor ID (doctor_id): ${doctor_id}`);

    return await getAllDataForDoctorsCount({
      doctor_id,
      user_role_id: userRoleId,
      category: USER_CATEGORY.HSP,
    });
  } catch (error) {
    logger.error("hspChart catch error: ", error);
    throw error;
  }
};

export const hspChartEventDetails = async (req) => {
  try {
    const {
      query: { event_type: event_type = null } = {},
      userDetails: { userRoleId, userCategoryId: doctor_id } = {},
    } = req;
    logger.debug(`Doctor ID (doctor_id): ${doctor_id}`);

    return await getAllDataForDoctorsByEventType({
      event_type,
      doctor_id,
      user_role_id: userRoleId,
      category: USER_CATEGORY.HSP,
    });
  } catch (error) {
    logger.error("hspChartEventDetails catch error: ", error);
    throw error;
  }
};

export const hspChartCount = async (req) => {
  try {
    const { userDetails: { userRoleId, userCategoryId: doctor_id } = {} } = req;
    logger.debug(`Doctor ID (doctor_id): ${doctor_id}`);

    return await getAllDataForDoctorsCount({
      doctor_id,
      user_role_id: userRoleId,
      category: USER_CATEGORY.HSP,
    });
  } catch (error) {
    logger.error("hspChartCount catch error: ", error);
    throw error;
  }
};

export const providerChart = async (req) => {
  try {
    const { userDetails: { userRoleId, userCategoryId: provider_id } = {} } =
      req;
    logger.debug(`Provider ID (provider_id): ${provider_id}`);
    /**
     * TODO: Check why this has been commented out?
    // get all doctors attached to provider
    const doctorData = await doctorProviderMappingService.getAllDoctorIds(provider_id) || [];
    logger.debug("doctorData", doctorData);
    const doctorIds = doctorData.map(data => data.doctor_id);
    logger.debug("doctorIds", doctorData);
     */
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
    logger.error("providerChart catch error: ", error);
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
    logger.debug("getAllDataForDoctorsByEventType user_role_id: ", user_role_id);
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
    logger.error("getAllDataForDoctorsByEventType catch error: ", error);
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
    logger.debug("Starting getAllDataForDoctors for user_role_id:", user_role_id);
    const eventService = new EventService();
    const carePlans = await CarePlanService.getCarePlanByData({ user_role_id });

    if (!carePlans || carePlans.length === 0) {
      logger.debug("No care plans found for user_role_id: ", user_role_id);
      return [[], "No care plans found"];
    }

    let appointmentIds = [];
    let medicationIds = [];
    let vitalIds = [];
    let dietIds = [];
    let workoutIds = [];
    const patientIds = new Set(); // Declare patientIds

    const carePlanPromises = carePlans.map(async (carePlanData) => {
      const carePlan = await CarePlanWrapper(carePlanData);
      const carePlanInfo = await carePlan.getAllInfo();

      // Add patient IDs to the Set
      if (carePlanInfo.patient_ids) {
        carePlanInfo.patient_ids.forEach(patientId => patientIds.add(patientId));
      }

      return carePlanInfo;
    });

    const carePlanInfos = await Promise.all(carePlanPromises);

    carePlanInfos.forEach(({ appointment_ids, medication_ids, vital_ids, diet_ids, workout_ids }) => {
      appointmentIds.push(...appointment_ids);
      medicationIds.push(...medication_ids);
      vitalIds.push(...vital_ids);
      dietIds.push(...diet_ids);
      workoutIds.push(...workout_ids);
    });

    logger.debug("Extracted IDs: ", {
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
      logger.debug("No schedule events found for the provided IDs.");
      return [[], "No schedule events found"];
    }

    logger.debug("Retrieved schedule events: ", scheduleEvents);
    const formattedData = await getFormattedData(scheduleEvents, category);
    logger.debug("Formatted data: ", formattedData);

    return [
      { ...formattedData, patientCount: patientIds.size }, // Include patientCount
      "Missed events fetched successfully",
    ];
  } catch (error) {
    logger.error("Error in getAllDataForDoctors: ", error);
    throw error;
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
 *    Event Counts: The function does not directly return the count of each event type.  
 *          It passes the scheduleEvents array to getFormattedDataNew, which likely processes and organizes 
 *          the events but doesn't inherently calculate counts.  
 *          The returned data structure from getFormattedDataNew (which you'd need to examine) might contain 
 *          count information after the formatting is done, but getAllDataForDoctorsCount itself doesn't calculate 
 *          or return these counts.
 *    Patient Count: The function does not return the total patient count directly. 
 *          It collects patientIds within the loop, but it's unclear if this patientIds array represents unique 
 *          patients or just all patient IDs encountered across care plans.  
 *          Whether (or not) getFormattedDataNew uses and returns patient counts depends on its implementation.
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
    logger.debug("user_role_id", user_role_id);
    const eventService = new EventService();

    const carePlans = (await CarePlanService.getCarePlanByData({ user_role_id })) || [];

    let appointmentIds = [];
    let medicationIds = [];
    let vitalIds = [];
    let dietIds = [];
    let workoutIds = [];
    const patientIds = new Set(); // Use a Set to store unique patient IDs

    // Process each care plan
    for (const carePlanData of carePlans) {
      const carePlan = await CarePlanWrapper(carePlanData);
      const {
        appointment_ids = [],
        medication_ids = [],
        vital_ids = [],
        diet_ids = [],
        workout_ids = [],
        patient_ids = [], // Ensure patient_ids is extracted
      } = await carePlan.getAllInfo();

      // Append IDs to their respective arrays
      appointmentIds.push(...appointment_ids);
      medicationIds.push(...medication_ids);
      vitalIds.push(...vital_ids);
      dietIds.push(...diet_ids);
      workoutIds.push(...workout_ids);

      // Add patient IDs to the Set
      if (patient_ids && patient_ids.length > 0) {
        patient_ids.forEach(patientId => patientIds.add(patientId));
      }
    }

    // Fetch missed events
    const scheduleEvents =
      (await eventService.getMissedByData({
        appointment_ids: appointmentIds,
        medication_ids: medicationIds,
        vital_ids: vitalIds,
        diet_ids: dietIds,
        workout_ids: workoutIds,
      })) || [];

    // Format the data
    const formattedData = await getFormattedData(scheduleEvents, category);
    const patientCount = patientIds.size; // Get the number of unique patients
    logger.debug("Unique Patient count in getAllDataForDoctorCount: ", patientCount);

    // Prepare the response
    const response = [
      { ...formattedData, patientCount }, // Add patientCount to the response
      "Missed events fetched successfully",
    ];
    logger.debug("getAllDataForDoctorCount response for the Doctor/Patient: ", response);

    return response;
  } catch (error) {
    logger.error("getAllDataForDoctors catch error", error);
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
const getFormattedData = async (
  events = [],
  category = USER_CATEGORY.DOCTOR
) => {
  let medications = {};
  let medication_critical_ids = [];
  let medication_non_critical_ids = [];

  let appointments = {};
  let appointment_critical_ids = [];
  let appointment_non_critical_ids = [];

  let vitals = {};
  let vital_critical_ids = [];
  let vital_non_critical_ids = [];

  let diets = {};
  let diet_critical_ids = [];
  let diet_non_critical_ids = [];

  let workouts = {};
  let workout_critical_ids = [];
  let workout_non_critical_ids = [];

  const patientIds = new Set(); // Use a Set to avoid duplicates

  // Helper function to add event timings
  const addEventTimings = (eventMap, eventId, date, start_time, end_time) => {
    if (!eventMap[eventId]) {
      eventMap[eventId] = { timings: {} };
    }
    if (!eventMap[eventId].timings[date]) {
      eventMap[eventId].timings[date] = [];
    }
    eventMap[eventId].timings[date].push({ start_time, end_time });
  };

  // Process events
  for (const eventData of events) {
    try {
      const event = await EventWrapper(eventData);
      const {
        start_time,
        end_time,
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

      const eventType = event.getEventType();
      const eventId = event.getEventId();
      const eventDate = event.getDate();

      switch (eventType) {
        case EVENT_TYPE.MEDICATION_REMINDER:
          if (category !== USER_CATEGORY.HSP) {
            if (category === USER_CATEGORY.PROVIDER) {
              patientIds.add(participant_id);
            }
            addEventTimings(medications, eventId, eventDate, start_time, end_time);
            medications[eventId] = {
              ...medications[eventId],
              medicines,
              critical,
              participant_id,
            };

            if (critical) {
              medication_critical_ids.push(eventId);
            } else {
              medication_non_critical_ids.push(eventId);
            }
          }
          break;

        case EVENT_TYPE.APPOINTMENT:
          if (category === USER_CATEGORY.PROVIDER) {
            patientIds.add(participant_one.category === USER_CATEGORY.PATIENT ? participant_one.id : participant_two.id);
          }
          if (!appointments[eventId]) {
            appointments[eventId] = [];
          }
          appointments[eventId].push(event.getAllInfo());

          if (critical) {
            appointment_critical_ids.push(eventId);
          } else {
            appointment_non_critical_ids.push(eventId);
          }
          break;

        case EVENT_TYPE.VITALS:
          if (category === USER_CATEGORY.PROVIDER) {
            patientIds.add(patient_id);
          }
          addEventTimings(vitals, eventId, eventDate, start_time, end_time);
          vitals[eventId] = {
            ...vitals[eventId],
            patient_id,
            critical,
            vital_name,
          };

          if (critical) {
            vital_critical_ids.push(eventId);
          } else {
            vital_non_critical_ids.push(eventId);
          }
          break;

        case EVENT_TYPE.DIET:
          const dietWrapper = await DietWrapper({ id: diet_id });
          const care_plan_id = await dietWrapper.getCarePlanId();
          const carePlanWrapper = await CarePlanWrapper(null, care_plan_id);
          const patientId = await carePlanWrapper.getPatientId();

          const { basic_info: { name: diet_name = "" } = {} } = event_diets[diet_id] || {};
          if (category === USER_CATEGORY.PROVIDER) {
            patientIds.add(patientId);
          }
          addEventTimings(diets, eventId, eventDate, start_time, end_time);
          diets[eventId] = {
            ...diets[eventId],
            diet_name,
            participant_id: patientId,
            critical,
          };

          if (critical) {
            diet_critical_ids.push(eventId);
          } else {
            diet_non_critical_ids.push(eventId);
          }
          break;

        case EVENT_TYPE.WORKOUT:
          const workoutWrapper = await WorkoutWrapper({ id: workout_id });
          const workout_care_plan_id = await workoutWrapper.getCarePlanId();
          const workoutCarePlanWrapper = await CarePlanWrapper(null, workout_care_plan_id);
          const workoutPatientId = await workoutCarePlanWrapper.getPatientId();

          const { basic_info: { name: workout_name = "" } = {} } = event_workouts[workout_id] || {};
          if (category === USER_CATEGORY.PROVIDER) {
            patientIds.add(workoutPatientId);
          }
          addEventTimings(workouts, eventId, eventDate, start_time, end_time);
          workouts[eventId] = {
            ...workouts[eventId],
            workout_name,
            participant_id: workoutPatientId,
            critical,
          };

          if (critical) {
            workout_critical_ids.push(eventId);
          } else {
            workout_non_critical_ids.push(eventId);
          }
          break;
      }
    } catch (error) {
      logger.error(`Error processing event: ${error.message}`);
    }
  }

  // Fetch patient data
  let patientData = {};
  if (patientIds.size > 0) {
    const allPatients = await patientService.getPatientByData({
      id: Array.from(patientIds),
    });

    for (const patient of allPatients) {
      const patientWrapper = await PatientWrapper(patient);
      const { user_role_id = null, care_plan_id = null } = await patientWrapper.getAllInfo();
      patientData[patientWrapper.getPatientId()] = {
        ...patientWrapper.getBasicInfo(),
        user_role_id,
        care_plan_id,
      };
    }
  }

  return {
    missed_medications: medications,
    medication_ids: {
      critical: medication_critical_ids,
      non_critical: medication_non_critical_ids,
    },
    missed_appointments: appointments,
    appointment_ids: {
      critical: appointment_critical_ids,
      non_critical: appointment_non_critical_ids,
    },
    missed_vitals: vitals,
    vital_ids: {
      critical: vital_critical_ids,
      non_critical: vital_non_critical_ids,
    },
    missed_diets: diets,
    diet_ids: {
      critical: diet_critical_ids,
      non_critical: diet_non_critical_ids,
    },
    missed_workouts: workouts,
    workout_ids: {
      critical: workout_critical_ids,
      non_critical: workout_non_critical_ids,
    },
    patients: patientData,
  };
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
        const care_plan_id = await dietWrapper.getCarePlanId();
        const carePlanWrapper = await CarePlanWrapper(null, care_plan_id);
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
        const workoutWrapper = await WorkoutWrapper({ id: workout_id });
        const workout_care_plan_id = await workoutWrapper.getCarePlanId();
        const workoutCarePlanWrapper = await CarePlanWrapper(
          null,
          workout_care_plan_id
        );
        const workoutPatientId = await workoutCarePlanWrapper.getPatientId();

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

/**
 * This is a duplicate with lesser data for the 'getFormattedData' function.
 * TODO: Check why it is being used in the 'getAllDataForDoctorsCount' function and not the original one?
 *
 * @param events
 * @param category
 * @returns {Promise<{medication_ids: {critical: *[], non_critical: *[]}, appointment_ids: {critical: *[], non_critical: *[]}, vital_ids: {critical: *[], non_critical: *[]}, diet_ids: {critical: *[], non_critical: *[]}, workout_ids: {critical: *[], non_critical: *[]}}>}
 */
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
