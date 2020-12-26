import {
  EVENT_TYPE,
  FEATURE_TYPE,
  REPEAT_INTERVAL,
  WAKE_UP,
  SLEEP,
  BREAKFAST,
  LUNCH,
  EVENING,
  DINNER,
  AFTER_WAKEUP,
  BEFORE_BREAKFAST,
  AFTER_BREAKFAST,
  BEFORE_LUNCH,
  AFTER_LUNCH,
  BEFORE_EVENING_SNACK,
  AFTER_EVENING_SNACK,
  BEFORE_DINNER,
  AFTER_DINNER,
  BEFORE_SLEEP,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
  SUNDAY,
  MEDICATION_TIMING
} from "../constant";
import FeatureDetailWrapper from "../app/ApiWrapper/web/featureDetails";
import { RRule } from "rrule";
import moment from "moment";
import Logger from "../libs/log";

// SERVICES
import FeatureDetailService from "../app/services/featureDetails/featureDetails.service";
import ScheduleService from "../app/services/scheduleEvents/scheduleEvent.service";
import UserPreferenceService from "../app/services/userPreferences/userPreference.service";
import appointmentService from "../app/services/appointment/appointment.service";
import queueService from "../app/services/awsQueue/queue.service";

// WRAPPERS
// import PatientWrapper from "../app/ApiWrapper/mobile/patient";
import MedicineWrapper from "../app/ApiWrapper/mobile/medicine";
import MedicationWrapper from "../app/ApiWrapper/mobile/medicationReminder";
import AppointmentWrapper from "../app/ApiWrapper/mobile/appointments";

const Log = new Logger("EVENT > HELPER");

const scheduleService = new ScheduleService();

const getUserPreferences = async user_id => {
  try {
    Log.info(`user_id : ${user_id}`);
    const userPreference = await UserPreferenceService.getPreferenceByData({
      user_id
    });
    const { timings = {} } = userPreference.get("details") || {};
    return timings;
  } catch (error) {
    Log.debug("userPreferences catch error", error);
  }
};

export const handleAppointments = async appointment => {
  try {
    const {
      event_id,
      start_time,
      end_time,
      details,
      critical,
      participants,
      actor
    } = appointment || {};

    const rrule = new RRule({
      freq: RRule.WEEKLY,
      count: 1,
      dtstart: moment(start_time)
        .utc()
        .toDate()
    });

    Log.debug("rrule ----> ", rrule.all());

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
        participants,
        actor
      }
    };

    let response = false;
    const schedule = await scheduleService.create(scheduleData);
    if (schedule) {
      Log.debug("schedule events created for appointment", true);
      response = true;
    } else {
      Log.debug("schedule events failed for appointment", false);
    }

    return response;
  } catch (error) {
    Log.debug("schedule events appointment 500 error", error);
  }
};

export const handleMedications = async data => {
  try {
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
        critical = false
      } = {}
    } = data || {};

    Log.debug("repeat days before --> ", { details, data });

    const rrule = new RRule({
      freq: RRule.WEEKLY,
      dtstart: moment(start_date)
        .utc()
        .toDate(),
      until: end_date
        ? moment(end_date)
            .utc()
            .toDate()
        : moment(start_date)
            .add(1, "month")
            .utc()
            .toDate(),
      byweekday: repeatDays(repeat_days)
    });

    const allDays = rrule.all();

    const patientPreference = await getUserPreferences(patient_id);

    const medicine = await MedicineWrapper(null, medicine_id);
    const medication = await MedicationWrapper(null, event_id);

    const scheduleEventArr = [];

    Log.debug("213971203 createMedicationSchedule -->", {
      medicine_id,
      data: medicine.getBasicInfo()
    });

    for (let i = 0; i < allDays.length; i++) {
      for (const timing of when_to_take) {
        const startTime = updateMedicationTiming(
          allDays[i],
          timing,
          patientPreference
        );

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
            medications: medication.getBasicInfo()
          }
        });
      }
    }

    const schedule = await scheduleService.bulkCreate(scheduleEventArr);
    let response = false;
    if (schedule) {
      Log.debug("schedule events created for appointment", true);
      response = true;
    } else {
      Log.debug("schedule events failed for appointment", false);
    }

    return response;
  } catch (error) {
    Log.debug("schedule events medication 500 error", error);
  }
};

export const handleVitals = async vital => {
  try {
    const {
      patient_id,
      patientUserId,
      event_id,
      start_date,
      end_date,
      details,
      details: {
        details: { repeat_days, repeat_interval_id, critical = false }
      } = {},
      participants = [],
      actor = {},
      vital_templates = {}
    } = vital || {};

    const timings = await getUserPreferences(patient_id);

    const vitalData = await FeatureDetailService.getDetailsByData({
      feature_type: FEATURE_TYPE.VITAL
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
      byweekday: repeatDays(repeat_days)
    });
    const allDays = rrule.all();

    const scheduleEventArr = [];

    if (key === REPEAT_INTERVAL.ONCE) {
      for (let i = 0; i < allDays.length; i++) {
        // **** TAKING WAKE UP TIME AS TIME FOR REPEAT INTERVAL = ONCE ****

        const { value: wakeUpTime } = timings[WAKE_UP];

        const hours = moment(wakeUpTime)
          .utc()
          .get("hours");
        const minutes = moment(wakeUpTime)
          .utc()
          .get("minutes");

        scheduleEventArr.push({
          event_id,
          critical,
          date: moment(allDays[i])
            .utc()
            .toISOString(),
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
            eventId: event_id
          }
        });
      }
    } else {
      for (let i = 0; i < allDays.length; i++) {
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
            date: moment(allDays[i])
              .utc()
              .toISOString(),
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
              patient_id
            }
          });
          // const scheduleData = {
          //     event_id,
          //     critical,
          //     date: moment(allDays[i])
          //         .utc()
          //         .toISOString(),
          //     start_time: moment(allDays[i]).set("hours", hours).set("minutes", minutes).toISOString(),
          //     end_time: moment(allDays[i]).set("hours", hours).set("minutes", minutes).toISOString(),
          //     event_type: EVENT_TYPE.VITALS,
          //     details: {
          //         ...details,
          //         participants,
          //         actor,
          //         vital_templates,
          //         eventId: event_id
          //     }
          // };

          ongoingTime = moment(ongoingTime).add(value, "hours");
        }
      }
    }

    let response = false;
    const schedule = await scheduleService.bulkCreate(scheduleEventArr);
    if (schedule) {
      Log.debug("schedule events created for vitals", true);
      response = true;
    } else {
      Log.debug("schedule events failed for vitals", false);
    }

    return response;
  } catch (error) {
    Log.debug("schedule events vitals 500 error", error);
  }
};

export const handleAppointmentsTimeAssignment = async appointment => {
  try {
    const QueueService = new queueService();
    const { event_id, start_time, end_time } = appointment;

    const appointmentData = await AppointmentWrapper(null, event_id);

    const {
      basic_info: { details: { critical = null } = {} } = {},
      participant_one = {},
      participant_two = {}
    } = appointmentData.getBasicInfo() || {};

    const { id: participant_two_id, category: participant_two_type } =
      participant_two || {};

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
        participant_one_type
      },
      {
        participant_two_id,
        participant_two_type
      }
    );

    Log.debug("getAppointmentForTimeSlot --> ", getAppointmentForTimeSlot);

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
          minutes: 1
        });

        const getAppointment = await appointmentService.checkTimeSlot(
          one_minute_late_start_time,
          endTime,
          {
            participant_one_id,
            participant_one_type
          },
          {
            participant_two_id,
            participant_two_type
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
      end_date: appointment_end_time
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
        category: participant_one_type
      }
    };

    const sqsResponse = await QueueService.sendMessage(eventScheduleData);

    Log.debug("sqsResponse ---> ", sqsResponse);
    return true;
  } catch (error) {
    Log.debug("appointment time assignment 500 error", error);
  }
};

export const handleCarePlans = async data => {
  try {
    const {
      patient_id,
      critical,
      event_id,
      start_time,
      end_time,
      details,
      actor = {},
      participants = []
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
        actor,
        participants
      }
    };

    Log.debug(
      "------------> Schedule events data for careplan activation is: ",
      scheduleEvents
    );

    const schedule = await scheduleService.create(scheduleEvents);
    let response = false;
    if (schedule) {
      Log.debug("schedule events created for careplan activation: ", true);
      response = true;
    } else {
      Log.debug("schedule events failed for careplan activation: ", false);
    }
    return response;
  } catch (error) {
    Log.debug("schedule events careplan activation 500 error", error);
  }
};

const getWakeUp = timings => {
  const { value } = timings[WAKE_UP] || {};
  const hours = moment(value).hours();
  const minutes = moment(value).minutes();
  return { hours, minutes };
};

const getBreakfast = timings => {
  const { value } = timings[BREAKFAST] || {};
  const hours = moment(value).hours();
  const minutes = moment(value).minutes();
  return { hours, minutes };
};

const getLunch = timings => {
  const { value } = timings[LUNCH] || {};
  const hours = moment(value).hours();
  const minutes = moment(value).minutes();
  return { hours, minutes };
};

const getEvening = timings => {
  const { value } = timings[EVENING] || {};
  const hours = moment(value).hours();
  const minutes = moment(value).minutes();
  return { hours, minutes };
};

const getDinner = timings => {
  const { value } = timings[DINNER] || {};
  const hours = moment(value).hours();
  const minutes = moment(value).minutes();
  return { hours, minutes };
};

const getSleep = timings => {
  const { value } = timings[SLEEP] || {};
  const hours = moment(value).hours();
  const minutes = moment(value).minutes();
  return { hours, minutes };
};

const updateMedicationTiming = (date, timing, patientPreference) => {
  switch (timing) {
    case AFTER_WAKEUP:
      const { hours: awh, minutes: awm } = getWakeUp(patientPreference) || {};
      return moment(date)
        .set("hours", awh)
        .set("minutes", awm);
    case BEFORE_BREAKFAST:
      const { hours: bbh, minutes: bbm } =
        getBreakfast(patientPreference) || {};
      return moment(date)
        .set("hours", bbh)
        .set("minutes", bbm)
        .subtract(30, "minutes");
    case AFTER_BREAKFAST:
      const { hours: abh, minutes: abm } =
        getBreakfast(patientPreference) || {};
      return moment(date)
        .set("hours", abh)
        .set("minutes", abm)
        .add(30, "minutes");
    case BEFORE_LUNCH:
      const { hours: blh, minutes: blm } = getLunch(patientPreference) || {};
      return moment(date)
        .set("hours", blh)
        .set("minutes", blm)
        .subtract(30, "minutes");
    case AFTER_LUNCH:
      const { hours: alh, minutes: alm } = getLunch(patientPreference) || {};
      return moment(date)
        .set("hours", alh)
        .set("minutes", alm)
        .add(30, "minutes");
    case BEFORE_EVENING_SNACK:
      const { hours: beh, minutes: bem } = getEvening(patientPreference) || {};
      return moment(date)
        .set("hours", beh)
        .set("minutes", bem)
        .subtract(30, "minutes");
    case AFTER_EVENING_SNACK:
      const { hours: aeh, minutes: aem } = getEvening(patientPreference) || {};
      return moment(date)
        .set("hours", aeh)
        .set("minutes", aem)
        .add(30, "minutes");
    case BEFORE_DINNER:
      const { hours: bdh, minutes: bdm } = getDinner(patientPreference) || {};
      return moment(date)
        .set("hours", bdh)
        .set("minutes", bdm)
        .subtract(30, "minutes");
    case AFTER_DINNER:
      const { hours: adh, minutes: adm } = getDinner(patientPreference) || {};
      return moment(date)
        .set("hours", adh)
        .set("minutes", adm)
        .add(30, "minutes");
    case BEFORE_SLEEP:
      const { hours: bsh, minutes: bsm } = getSleep(patientPreference) || {};
      return moment(date)
        .set("hours", bsh)
        .set("minutes", bsm);
    default:
      return moment(date);
  }
};

const repeatDays = days => {
  let daysArr = [];
  Log.debug("repeatDays  ---> ", days);
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
        Log.debug("day ----> ", day);
    }
  }

  return daysArr;
};
