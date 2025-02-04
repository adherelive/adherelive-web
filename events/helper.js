import {
  AFTER_BREAKFAST,
  AFTER_DINNER,
  AFTER_EVENING_SNACK,
  AFTER_LUNCH,
  AFTER_WAKEUP,
  BEFORE_BREAKFAST,
  BEFORE_DINNER,
  BEFORE_EVENING_SNACK,
  BEFORE_LUNCH,
  BEFORE_SLEEP,
  BREAKFAST,
  DINNER,
  EVENING,
  EVENT_TYPE,
  FEATURE_TYPE,
  LUNCH,
  MEDICATION_TIMING,
  MID_MORNING,
  PATIENT_MEAL_TIMINGS,
  REPEAT_INTERVAL,
  SLEEP,
  WAKE_UP,
  WITH_BREAKFAST,
  WITH_DINNER,
  WITH_LUNCH,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
  SUNDAY,
} from "../constant";

import FeatureDetailWrapper from "../app/apiWrapper/web/featureDetails";
import { RRule } from "rrule";
import moment from "moment";
import { createLogger } from "../libs/logger";

// Services
import FeatureDetailService from "../app/services/featureDetails/featureDetails.service";
import ScheduleService from "../app/services/scheduleEvents/scheduleEvent.service";
import UserPreferenceService from "../app/services/userPreferences/userPreference.service";
import appointmentService from "../app/services/appointment/appointment.service";
import queueService from "../app/services/awsQueue/queue.service";

// Wrappers
import PatientWrapper from "../app/apiWrapper/mobile/patient";
import MedicineWrapper from "../app/apiWrapper/mobile/medicine";
import MedicationWrapper from "../app/apiWrapper/mobile/medicationReminder";
import AppointmentWrapper from "../app/apiWrapper/mobile/appointments";
import DietWrapper from "../app/apiWrapper/mobile/diet";
import WorkoutWrapper from "../app/apiWrapper/mobile/workouts";

import { getTimeWiseDietFoodGroupMappings } from "../app/controllers/diet/diet.helper";
import SimilarFoodMappingService from "../app/services/similarFoodMapping/similarFoodMapping.service";

const logger = createLogger("EVENT > HELPER");

const scheduleService = new ScheduleService();

const getUserPreferences = async (user_id) => {
  try {
    if (user_id != null) {
      logger.debug(`user_id : ${user_id}`);
      const userPreference = await UserPreferenceService.getPreferenceByData({
        user_id,
      });
      const { timings = {} } = userPreference.get("details") || {};
      return timings;
    }
  } catch (error) {
    logger.debug("userPreferences catch error: ", error);
  }
};

export const handleAppointments = async (appointment) => {
  try {
    const {
      event_id,
      start_time,
      end_time,
      details,
      critical,
      // participants,
      actor,
    } = appointment || {};

    const rrule = new RRule({
      freq: RRule.WEEKLY,
      count: 1,
      dtstart: moment(start_time).utc().toDate(),
    });

    logger.debug("handleAppointments rrule ---> ", rrule.all());

    // create schedule for the date
    const scheduleData = {
      event_id,
      critical,
      date: moment(start_time).toISOString(),
      start_time: moment(start_time).toISOString(),
      end_time: moment(end_time).toISOString(),
      event_type: EVENT_TYPE.APPOINTMENT,
      details: {
        ...details,
        // participants,
        actor,
      },
    };

    let response = false;
    const schedule = await scheduleService.create(scheduleData);
    if (schedule) {
      logger.debug("schedule events created for appointment", true);
      response = true;
    } else {
      logger.debug("schedule events failed for appointment", false);
    }

    return response;
  } catch (error) {
    logger.debug("schedule events appointment 500 error: ", error);
  }
};

export const handleMedications = async (data) => {
  try {
    logger.debug("data for handle medications ---> ", data);
    const {
      patient_id,
      event_id,
      start_date,
      end_date,
      participants = [],
      actor = {},
      details,
      details: {
        medicine_id,
        when_to_take,
        repeat_days = [],
        critical = false,
      } = {},
    } = data || {};

    const rrule = new RRule({
      freq: RRule.WEEKLY,
      dtstart: moment(start_date).utc().toDate(),
      until: end_date
        ? moment(end_date).utc().toDate()
        : moment(start_date).add(1, "month").utc().toDate(),
      byweekday: repeatDays(repeat_days),
    });

    const allDays = rrule.all();

    const patientPreference = await getUserPreferences(patient_id);

    const medicine = await MedicineWrapper(null, medicine_id);
    const medication = await MedicationWrapper(null, event_id);

    const scheduleEventArr = [];

    logger.debug("handleMedications helper createMedicationSchedule ---> ", {
      medicine_id,
      data: medicine.getBasicInfo(),
      when_to_take,
    });

    for (let i = 0; i < allDays.length; i++) {
      for (const timing of when_to_take) {
        const startTime = updateMedicationTiming(
          allDays[i],
          timing,
          patientPreference
        );

        logger.debug("create medication schedule ---> ", {
          startTime,
          text: MEDICATION_TIMING[timing],
        });

        scheduleEventArr.push({
          event_id,
          critical,
          date: moment(allDays[i]).toISOString(),
          start_time: moment(startTime).toISOString(),
          end_time: moment(startTime).toISOString(),
          event_type: EVENT_TYPE.MEDICATION_REMINDER,
          details: {
            ...details,
            participants,
            actor,
            medicines: medicine.getBasicInfo(),
            when_to_take_data: MEDICATION_TIMING[timing], // TODO: to be changed(included in) to patient preference data
            medications: medication.getBasicInfo(),
          },
        });
      }
    }

    const schedule = await scheduleService.bulkCreate(scheduleEventArr);
    let response = false;
    if (schedule) {
      logger.debug("schedule events created for appointment", true);
      response = true;
    } else {
      logger.debug("schedule events failed for appointment", false);
    }

    return response;
  } catch (error) {
    logger.debug("schedule events medication 500 error: ", error);
  }
};

export const handleDiet = async (data) => {
  try {
    const {
      patient_id,
      event_id,
      start_date,
      end_date = null,
      participants = [],
      actor = {},
      critical = false,
    } = data || {};

    const dietWrapper = await DietWrapper({ id: event_id });
    const details = (await dietWrapper.getDetails()) || {};
    const { repeat_days: details_repeat_days = [] } = details || {};

    const dietFoodGroupMappings = dietWrapper.getDietFoodGroupMappings() || [];

    let foodGroupRelations = {};
    if (dietFoodGroupMappings.length > 0) {
      const similarFoodMappingService = new SimilarFoodMappingService();

      let allSimilarIds = [];

      for (let index = 0; index < dietFoodGroupMappings.length; index++) {
        const { id, time } = dietFoodGroupMappings[index] || {};

        const { rows: similarFoodGroupMappings = [] } =
          await similarFoodMappingService.findAndCountAll({
            where: { related_to_id: id },
            attributes: ["secondary_id"],
          });

        let similarIds = [];

        if (similarFoodGroupMappings.length > 0) {
          similarIds = similarFoodGroupMappings.map(
            (similarFoodGroupMapping) => similarFoodGroupMapping.secondary_id
          );
        }

        if (allSimilarIds.indexOf(id) !== -1) {
          continue;
        }

        if (foodGroupRelations.hasOwnProperty(time)) {
          const timeSpecificRelations = foodGroupRelations[time] || {};
          foodGroupRelations[time] = {
            ...timeSpecificRelations,
            [id]: similarIds,
          };
        } else {
          foodGroupRelations[time] = {
            [id]: similarIds,
          };
        }

        allSimilarIds = [...allSimilarIds, ...similarIds];
      }
    }

    const referenceInfo = await dietWrapper.getReferenceInfo();
    const { diet_food_group_mappings = {}, diets = {} } = referenceInfo || {};
    const timeWiseData = await getTimeWiseDietFoodGroupMappings({
      diet_food_group_mappings,
    });
    const allScheduleEvents = [],
      scheduleEventArr = [];

    for (let time in timeWiseData) {
      const timeData = timeWiseData[time] || {};
      const { mappingIds = [] } = timeData || {};
      // const day_text = DAYS_TEXT[day];
      const repeat_days = details_repeat_days || [];
      const { text = "" } = PATIENT_MEAL_TIMINGS[time];

      let eventDetails = {
        repeat_days,
        time_text: text,
        time,
        mapping_ids: mappingIds,
        foodGroupRelations: foodGroupRelations[time] || {},
        diet_id: dietWrapper.getId(),
        diets,
      };
      const eventScheduleDataDetails = { details: eventDetails };
      allScheduleEvents.push(eventScheduleDataDetails);
    }

    for (let each in allScheduleEvents) {
      const { details, details: { repeat_days = [], time } = {} } =
        allScheduleEvents[each] || {};

      const rrule = new RRule({
        freq: RRule.WEEKLY,
        dtstart: moment(start_date).utc().toDate(),
        until: end_date
          ? moment(end_date).utc().toDate()
          : moment(start_date).add(1, "month").utc().toDate(),
        byweekday: repeatDays(repeat_days),
      });
      const allDays = rrule.all();
      const patientPreference = await getUserPreferences(patient_id);
      for (let i = 0; i < allDays.length; i++) {
        const startTime = getDietTimings(allDays[i], time, patientPreference);

        scheduleEventArr.push({
          event_id,
          critical,
          date: moment(allDays[i]).toISOString(),
          start_time: moment(startTime).toISOString(),
          end_time: moment(startTime).toISOString(),
          event_type: EVENT_TYPE.DIET,
          details: {
            ...details,
            participants,
            actor,
          },
        });
      }
    }

    const schedule = await scheduleService.bulkCreate(scheduleEventArr);
    let response = false;
    if (schedule) {
      logger.debug("schedule events created for diet", true);
      response = true;
    } else {
      logger.debug("schedule events failed for diet", false);
    }

    return response;
  } catch (error) {
    logger.debug("schedule events DIET 500 error", error);
  }
};

export const handleWorkout = async (workout) => {
  try {
    const {
      patient_user_id,
      event_id,
      start_date,
      end_date = null,
      participants = [],
      actor = {},
      critical = false,
    } = workout || {};

    logger.debug("workout", workout);

    const workoutInstance = await WorkoutWrapper({ id: event_id });

    const { workouts = {} } = (await workoutInstance.getReferenceInfo()) || {};
    const { repeat_days } = workoutInstance.getDetails();

    const rrule = new RRule({
      freq: RRule.WEEKLY,
      dtstart: moment(start_date).utc().toDate(),
      until: end_date
        ? moment(end_date).utc().toDate()
        : moment(start_date).add(1, "month").utc().toDate(),
      byweekday: repeatDays(repeat_days),
    });
    const allDays = rrule.all();

    let allEvents = [];

    const time = workoutInstance.getTime();

    const hour = moment(time).hours();
    const minutes = moment(time).minutes();

    for (let index = 0; index < allDays.length; index++) {
      const date = allDays[index];

      const startTime = moment(date).hours(hour).minutes(minutes).toISOString();

      allEvents.push({
        event_id,
        critical,
        event_type: EVENT_TYPE.WORKOUT,
        date,
        start_time: startTime,
        end_time: startTime,
        details: {
          workouts,
          workout_id: workoutInstance.getId(),
          participants,
          actor,
        },
      });
    }

    const schedule = await scheduleService.bulkCreate(allEvents);
    let response = false;
    if (schedule) {
      logger.debug("schedule events created for workout");
      response = true;
    } else {
      logger.debug("schedule events failed for workout");
    }

    return response;
  } catch (error) {
    logger.debug("schedule events WORKOUT 500 error", error);
  }
};

export const handleVitals = async (vital) => {
  try {
    const {
      patient_id,
      patientUserId,
      event_id,
      start_date,
      end_date,
      details,
      details: {
        details: { repeat_days, repeat_interval_id, critical = false },
      } = {},
      participants = [],
      actor = {},
      vital_templates = {},
    } = vital || {};

    const timings = await getUserPreferences(patientUserId);

    const vitalData = await FeatureDetailService.getDetailsByData({
      feature_type: FEATURE_TYPE.VITAL,
    });

    const vitalDetails = await FeatureDetailWrapper(vitalData);
    const { repeat_intervals = {} } = vitalDetails.getFeatureDetails() || {};
    const { value, key } = repeat_intervals[repeat_interval_id] || {};

    const rrule = new RRule({
      freq: RRule.WEEKLY,
      dtstart: moment(start_date).toDate(),
      until: end_date
        ? moment(end_date).toDate()
        : moment(start_date)
            .add(1, "month") // TODO: drive from env
            .toDate(),
      byweekday: repeatDays(repeat_days),
    });
    const allDays = rrule.all();

    const scheduleEventArr = [];

    if (key === REPEAT_INTERVAL.ONCE) {
      for (let i = 0; i < allDays.length; i++) {
        // **** TAKING WAKE-UP TIME AS TIME FOR REPEAT INTERVAL = ONCE ****

        const { value: wakeUpTime } = timings[WAKE_UP];

        const hours = moment(wakeUpTime).utc().get("hours");
        const minutes = moment(wakeUpTime).utc().get("minutes");

        scheduleEventArr.push({
          event_id,
          critical,
          date: moment(allDays[i]).utc().toISOString(),
          start_time: moment(allDays[i])
            .set("hours", hours)
            .set("minutes", minutes)
            .utc()
            .toISOString(),
          end_time: moment(allDays[i])
            .set("hours", hours)
            .set("minutes", minutes)
            .utc()
            .toISOString(),
          event_type: EVENT_TYPE.VITALS,
          details: {
            ...details,
            participants,
            actor,
            vital_templates,
            eventId: event_id,
          },
        });
      }
    } else {
      for (let i = 0; i < allDays.length; i++) {
        // logger.debug("Wake Up Time Value: ", WAKE_UP, timings[this.WAKE_UP]);
        const { value: wakeUpTime } = timings[WAKE_UP];
        const { value: sleepTime } = timings[SLEEP];

        const startHours = moment(wakeUpTime).get("hours");
        const startMinutes = moment(wakeUpTime).get("minutes");
        const startOfDay = moment(allDays[i])
          .set("hours", startHours)
          .set("minutes", startMinutes)
          .utc()
          .toISOString();

        const endHours = moment(sleepTime).get("hours");
        const endMinutes = moment(sleepTime).get("minutes");
        const endOfDay = moment(allDays[i])
          .set("hours", endHours)
          .set("minutes", endMinutes)
          .utc()
          .toISOString();

        let ongoingTime = startOfDay;

        while (moment(endOfDay).diff(moment(ongoingTime), "minutes") > 0) {
          const hours = moment(ongoingTime).get("hours");
          const minutes = moment(ongoingTime).get("minutes");

          scheduleEventArr.push({
            event_id,
            critical,
            date: moment(allDays[i]).utc().toISOString(),
            start_time: moment(allDays[i])
              .set("hours", hours)
              .set("minutes", minutes)
              .toISOString(),
            end_time: moment(allDays[i])
              .set("hours", hours)
              .set("minutes", minutes)
              .toISOString(),
            event_type: EVENT_TYPE.VITALS,
            details: {
              ...details,
              participants,
              actor,
              vital_templates,
              eventId: event_id,
              patient_id,
            },
          });

          /**
           * TODO: Need to check if we need to create multiple vital events for the same day
          const scheduleData = {
              event_id,
              critical,
              date: moment(allDays[i])
                  .utc()
                  .toISOString(),
              start_time: moment(allDays[i]).set("hours", hours).set("minutes", minutes).toISOString(),
              end_time: moment(allDays[i]).set("hours", hours).set("minutes", minutes).toISOString(),
              event_type: EVENT_TYPE.VITALS,
              details: {
                  ...details,
                  participants,
                  actor,
                  vital_templates,
                  eventId: event_id
              }
          };
           */

          ongoingTime = moment(ongoingTime).add(value, "hours");
        }
      }
    }

    let response = false;
    const schedule = await scheduleService.bulkCreate(scheduleEventArr);
    if (schedule) {
      logger.debug("schedule events created for vitals", true);
      response = true;
    } else {
      logger.debug("schedule events failed for vitals", false);
    }

    return response;
  } catch (error) {
    logger.debug("schedule events vitals 500 error", error);
  }
};

export const handleAppointmentsTimeAssignment = async (appointment) => {
  try {
    const QueueService = new queueService();
    const { event_id, start_time, end_time, user_role_id } = appointment;

    const appointmentData = await AppointmentWrapper(null, event_id);

    const {
      basic_info: { details: { critical = null } = {} } = {},
      participant_one = {},
      participant_two = {},
    } = appointmentData.getBasicInfo() || {};

    const { id: participant_two_id, category: participant_two_type } =
      participant_two || {};

    // Check if participant_one exists and has an id
    if (participant_one && participant_one.id) {
      logger.debug("Participant One ---> ID exists: ", participant_one);
    } else {
      // Handle the case where participant_one is missing or has no ID
      // logger.error("Participant One ID is undefined or missing: ", participant_one);
      participant_one.id = 1; // Set a default ID
      // You can throw an error, log a warning, or handle the situation differently
      // depending on your application's requirements.
      return;
    }

    const { id: participant_one_id, category: participant_one_type } =
      participant_one || {};

    let appointment_start_time = null,
      appointment_end_time = null;

    const late_start_time = moment(start_time).add({ minutes: 1 });

    const getAppointmentForTimeSlot = await appointmentService.checkTimeSlot(
      late_start_time,
      end_time,
      {
        participant_one_id,
        participant_one_type,
      },
      {
        participant_two_id,
        participant_two_type,
      }
    );

    logger.debug("getAppointmentForTimeSlot --> ", getAppointmentForTimeSlot);

    if (getAppointmentForTimeSlot.length > 0) {
      let startTime = start_time;
      let endTime = end_time;
      let isSearchComplete = false;
      let timeDifference = moment(end_time).diff(moment(start_time), "minutes");
      let step = 0;

      let start_date = start_time,
        end_date = end_time;

      while (!isSearchComplete) {
        startTime = moment(start_date)
          .startOf("day")
          .add({ hours: 4, minutes: 30 })
          .add("minutes", step);
        endTime = moment(start_date)
          .startOf("day")
          .add({ hours: 4, minutes: 30 })
          .add("minutes", step + timeDifference);

        const one_minute_late_start_time = moment(startTime).add({
          minutes: 1,
        });

        const getAppointment = await appointmentService.checkTimeSlot(
          one_minute_late_start_time,
          endTime,
          {
            participant_one_id,
            participant_one_type,
          },
          {
            participant_two_id,
            participant_two_type,
          }
        );

        if (getAppointment.length > 0) {
          step += timeDifference;
          // if reached end of the day
          if (
            moment(endTime).diff(
              moment(
                moment(start_date)
                  .startOf("day")
                  .add({ hours: 14, minutes: 30 }),
                "minutes"
              )
            ) >= 0
          ) {
            start_date = moment(start_date).add(1, "days");

            step = 0;
          }

          // continue;
        } else {
          isSearchComplete = true;
          appointment_start_time = startTime;
          appointment_end_time = endTime;
        }
      }
    } else {
      appointment_start_time = start_time;
      appointment_end_time = end_time;
    }

    const updatedAppointmentData = {
      start_time: appointment_start_time,
      end_time: appointment_end_time,
      start_date: appointment_start_time,
      end_date: appointment_end_time,
    };

    const updatedAppointment = await appointmentService.updateAppointment(
      appointmentData.getAppointmentId(),
      updatedAppointmentData
    );

    const eventScheduleData = {
      type: EVENT_TYPE.APPOINTMENT,
      event_id: appointmentData.getAppointmentId(),
      critical,
      start_time: appointment_start_time,
      end_time: appointment_end_time,
      details: appointmentData.getBasicInfo(),
      participants: [participant_one_id, participant_two_id],
      actor: {
        id: participant_one_id,
        user_role_id,
        category: participant_one_type,
      },
    };

    const sqsResponse = await QueueService.sendMessage(eventScheduleData);

    logger.debug("SQS Response helper in handleAppointmentsTimeAssignment ---> ", sqsResponse);
    return true;
  } catch (error) {
    logger.debug("Appointment time assignment helper in handleAppointmentsTimeAssignment has 500 error: ", error);
  }
};

export const handleCarePlans = async (data) => {
  try {
    const {
      medication_ids,
      patient_id,
      critical,
      event_id,
      start_time,
      end_time,
      details,
      actor = {},
      participants = [],
    } = data || {};

    // const patientPreference = await getUserPreferences(patient_id);

    const scheduleEvents = {
      event_id,
      critical,
      date: moment(start_time).toISOString(),
      start_time: moment(start_time).toISOString(),
      end_time: moment(end_time).toISOString(),
      event_type: EVENT_TYPE.CARE_PLAN_ACTIVATION,
      details: {
        medications: details,
        medication_ids,
        actor,
        participants,
      },
    };

    logger.debug(
      "---> Schedule events data for careplan activation is: ",
      scheduleEvents
    );

    const schedule = await scheduleService.create(scheduleEvents);
    let response = false;
    if (schedule) {
      logger.debug("schedule events created for careplan activation: ", true);
      response = true;
    } else {
      logger.debug("schedule events failed for careplan activation: ", false);
    }
    return response;
  } catch (error) {
    logger.debug("schedule events careplan activation 500 error", error);
  }
};

const getWakeUp = (timings) => {
  const { value } = timings[WAKE_UP] || {};
  const hours = moment(value).hours();
  const minutes = moment(value).minutes();
  return { hours, minutes };
};

const getBreakfast = (timings) => {
  if (timings) {
    const { value } = timings[BREAKFAST] || {};
    const hours = moment(value).hours();
    const minutes = moment(value).minutes();
    return { hours, minutes };
  }
};

const getMidMorning = (timings) => {
  const { value } = timings[MID_MORNING] || {};
  const hours = moment(value).hours();
  const minutes = moment(value).minutes();
  return { hours, minutes };
};

const getLunch = (timings) => {
  const { value } = timings[LUNCH] || {};
  const hours = moment(value).hours();
  const minutes = moment(value).minutes();
  return { hours, minutes };
};

const getEvening = (timings) => {
  const { value } = timings[EVENING] || {};
  const hours = moment(value).hours();
  const minutes = moment(value).minutes();
  return { hours, minutes };
};

const getDinner = (timings) => {
  if (timings) {
    const { value } = timings[DINNER] || {};
    const hours = moment(value).hours();
    const minutes = moment(value).minutes();
    return { hours, minutes };
  }
};

const getSleep = (timings) => {
  const { value } = timings[SLEEP] || {};
  const hours = moment(value).hours();
  const minutes = moment(value).minutes();
  return { hours, minutes };
};

const getDietTimings = (date, timing, patientPreference) => {
  switch (timing) {
    case WAKE_UP:
      const { hours: wakeupHour, minutes: wakeupMinute } =
        getWakeUp(patientPreference) || {};
      return moment(date).set({
        hour: parseInt(wakeupHour, 10),
        minute: parseInt(wakeupMinute, 10),
      });
    //.set("hours", wakeupHour).set("minutes", wakeupMinute);
    case BREAKFAST:
      const { hours: breakfastHour, minutes: breakfastMinute } =
        getBreakfast(patientPreference) || {};
      return moment(date)
        .set("hours", breakfastHour)
        .set("minutes", breakfastMinute);
    case MID_MORNING:
      const { hours: midMorningHour, minutes: midMorningMinute } =
        getMidMorning(patientPreference) || {};
      return moment(date)
        .set("hours", midMorningHour)
        .set("minutes", midMorningMinute);
    case LUNCH:
      const { hours: lunchHour, minutes: lunchMinute } =
        getLunch(patientPreference) || {};
      return moment(date).set({
        hour: parseInt(lunchHour, 10),
        minute: parseInt(lunchMinute, 10),
      });
    // set("hours", lunchHour).set("minutes", lunchMinute);
    case EVENING:
      const { hours: eveningHour, minutes: eveningMinute } =
        getEvening(patientPreference) || {};
      return moment(date)
        .set("hours", eveningHour)
        .set("minutes", eveningMinute);
    case DINNER:
      const { hours: dinnerHour, minutes: dinnerMinute } =
        getLunch(patientPreference) || {};
      return moment(date).set({
        hour: parseInt(dinnerHour, 10),
        minute: parseInt(dinnerMinute, 10),
      });
    // set("hours", dinnerHour).set("minutes", dinnerMinute);
    case SLEEP:
      const { hours: sleepHour, minutes: sleepMinute } =
        getLunch(patientPreference) || {};
      return moment(date).set({
        hour: parseInt(sleepHour, 10),
        minute: parseInt(sleepMinute, 10),
      });
    //.set("hours", sleepHour).set("minutes", sleepMinute);
    default:
      return moment(date);
  }
};

const updateMedicationTiming = (date, timing, patientPreference) => {
  logger.debug("updateMedicationTiming -> date, timing, patientPreference: ", {
    date,
    timing,
    patientPreference,
  }); // TODO: Added
  switch (timing) {
    case AFTER_WAKEUP:
      const { hours: awh, minutes: awm } = getWakeUp(patientPreference) || {};
      return moment(date).set({
        hour: parseInt(awh, 10),
        minute: parseInt(awm, 10),
      });
    //set("hours", awh).set("minutes", awm);
    case BEFORE_BREAKFAST:
      const { hours: bbh, minutes: bbm } =
        getBreakfast(patientPreference) || {};
      return moment(date)
        .set({ hour: parseInt(bbh, 10), minute: parseInt(bbm, 10) })
        .subtract(30, "minutes");
    // .set("hours", bbh)
    // .set("minutes", bbm)
    // .subtract(30, "minutes");
    case AFTER_BREAKFAST:
      const { hours: abh, minutes: abm } =
        getBreakfast(patientPreference) || {};
      return moment(date)
        .set({ hour: parseInt(abh, 10), minute: parseInt(abm, 10) })
        .add(30, "minutes");
    // .set("hours", abh)
    // .set("minutes", abm)
    // .add(30, "minutes");
    case BEFORE_LUNCH:
      const { hours: blh, minutes: blm } = getLunch(patientPreference) || {};
      return moment(date)
        .set({ hour: parseInt(blh, 10), minute: parseInt(blm, 10) })
        .subtract(30, "minutes");
    // .set("hours", blh)
    // .set("minutes", blm)
    // .subtract(30, "minutes");
    case WITH_LUNCH:
      const { hours: wlh, minutes: wlm } = getLunch(patientPreference) || {};
      return moment(date).set({
        hour: parseInt(wlh, 10),
        minute: parseInt(wlm, 10),
      });
    // .set("hours", wlh).set("minutes", wlm);
    case AFTER_LUNCH:
      const { hours: alh, minutes: alm } = getLunch(patientPreference) || {};
      return moment(date)
        .set({ hour: parseInt(alh, 10), minute: parseInt(alm, 10) })
        .add(30, "minutes");
    // .set("hours", alh)
    // .set("minutes", alm)
    // .add(30, "minutes");
    case BEFORE_EVENING_SNACK:
      const { hours: beh, minutes: bem } = getEvening(patientPreference) || {};
      return moment(date)
        .set({ hour: parseInt(beh, 10), minute: parseInt(bem, 10) })
        .subtract(30, "minutes");
    // .set("hours", beh)
    // .set("minutes", bem)
    // .subtract(30, "minutes");
    case AFTER_EVENING_SNACK:
      const { hours: aeh, minutes: aem } = getEvening(patientPreference) || {};
      return moment(date)
        .set({ hour: parseInt(aeh, 10), minute: parseInt(aem, 10) })
        .add(30, "minutes");
    // .set("hours", aeh)
    // .set("minutes", aem)
    // .add(30, "minutes");
    case BEFORE_DINNER:
      const { hours: bdh, minutes: bdm } = getDinner(patientPreference) || {};
      return moment(date)
        .set({ hour: parseInt(bdh, 10), minute: parseInt(bdm, 10) })
        .subtract(30, "minutes");
    // .set("hours", bdh)
    // .set("minutes", bdm)
    // .subtract(30, "minutes");
    case WITH_DINNER:
      const { hours: wdh, minutes: wdm } = getDinner(patientPreference) || {};
      return moment(date).set({
        hour: parseInt(wdh, 10),
        minute: parseInt(wdm, 10),
      });
    // .set("hours", wdh).set("minutes", wdm);
    case AFTER_DINNER:
      const { hours: adh, minutes: adm } = getDinner(patientPreference) || {};
      return moment(date)
        .set({ hour: parseInt(adh, 10), minute: parseInt(adm, 10) })
        .add(30, "minutes");
    // .set("hours", adh)
    // .set("minutes", adm)
    // .add(30, "minutes");
    case BEFORE_SLEEP:
      const { hours: bsh, minutes: bsm } = getSleep(patientPreference) || {};
      return moment(date).set({
        hour: parseInt(bsh, 10),
        minute: parseInt(bsm, 10),
      });
    // .set("hours", bsh).set("minutes", bsm);
    default:
      return moment(date);
  }
};

const repeatDays = (days) => {
  let daysArr = [];
  logger.debug("repeatDays  ---> ", days);
  for (const day of days) {
    switch (day) {
      case MONDAY:
        daysArr.push(RRule.MO);
        break;
      case TUESDAY:
        daysArr.push(RRule.TU);
        break;
      case WEDNESDAY:
        daysArr.push(RRule.WE);
        break;
      case THURSDAY:
        daysArr.push(RRule.TH);
        break;
      case FRIDAY:
        daysArr.push(RRule.FR);
        break;
      case SATURDAY:
        daysArr.push(RRule.SA);
        break;
      case SUNDAY:
        daysArr.push(RRule.SU);
        break;
      default:
        logger.debug("repeatDays day ---> ", day);
    }
  }

  return daysArr;
};
