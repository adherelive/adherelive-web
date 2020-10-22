import Logger from "../../../libs/log";
import {
  NOTIFICATION_VERB,
  EVENT_TYPE,
  NOTIFICATION_STAGES,
  EVENT_STATUS
} from "../../../constant";

// lodash
import isEmpty from "lodash/isEmpty";

// SERVICES -------->
import AppointmentService from "../../services/appointment/appointment.service";
// import MedicationService from "../../services/medicationReminder/mReminder.service";
import ScheduleEventService from "../../services/scheduleEvents/scheduleEvent.service";
import VitalService from "../../services/vitals/vital.service";
import carePlanService from "../../services/carePlan/carePlan.service";

// API WRAPPERS -------->
import AppointmentWrapper from "../../ApiWrapper/web/appointments";
import MedicationWrapper from "../../ApiWrapper/web/medicationReminder";
// import ScheduleEventWrapper from "../../ApiWrapper/web/scheduleEvents";
import UserWrapper from "../../ApiWrapper/web/user";
import VitalWrapper from "../../ApiWrapper/web/vitals";
import CarePlanWrapper from "../../ApiWrapper/mobile/carePlan";

const {
  APPOINTMENT_CREATE,
  APPOINTMENT_START,
  MEDICATION_CREATE,
  MEDICATION_REMINDER_START,
  VITAL_CREATE,
  VITAL_START,
  CARE_PLAN_CREATE
} = NOTIFICATION_VERB;

const {
  APPOINTMENT,
  MEDICATION_REMINDER,
  VITALS,
  CARE_PLAN_ACTIVATION
} = EVENT_TYPE;

const Log = new Logger("WEB > NOTIFICATION > CONTROLLER > HELPER");

const medicationNotification = async data => {
  try {
    const scheduleEventService = new ScheduleEventService();
    const {
      data: {
        actor,
        foreign_id,
        id,
        object,
        time,
        verb,
        prev: { startDate: prevStartDate, endDate: prevEndDate } = {},
        current: { startDate: currentStartDate, endDate: currentEndDate } = {},
        start_time: notification_start_time,
        create_time: notification_create_time
      } = {},
      loggedInUser,
      is_read,
      group_id
    } = data;

    let eventData = {};
    let medicineData = {};
    let userData = {};
    let doctorData = {};
    let patientData = {};
    let participants = [];
    let eventId = null;
    let responseTaken = false;

    const verbString = verb.split(":")[0];

    if (verbString.toUpperCase() === MEDICATION_CREATE) {
      eventId = parseInt(foreign_id, 10);
    } else if (verbString.toUpperCase() === MEDICATION_REMINDER_START) {
      const scheduleEventData = await scheduleEventService.getEventByData({
        id: parseInt(foreign_id, 10)
      });
      const {
        event_id = null,
        details: { status = null } = {}
      } = scheduleEventData;
      eventId = event_id;
      if (status) {
        responseTaken = true;
      }
    }

    if (
      verbString.toUpperCase() === MEDICATION_CREATE ||
      verbString.toUpperCase() === MEDICATION_REMINDER_START
    ) {
      const event = await MedicationWrapper(null, eventId);
      const { medications, medicines } = await event.getReferenceInfo();

      eventData = { ...eventData, ...medications };
      medicineData = { ...medicineData, medicines };
      participants = event.getParticipants();
    }

    if (eventData && eventData === null) {
      eventData = {};
    }
    let requiredActor = actor;

    if (!isEmpty(eventData)) {
      const { participant_id, organizer_id } = participants || {};
      if (actor !== participant_id && actor !== organizer_id) {
        requiredActor =
          loggedInUser === participant_id ? organizer_id : participant_id;
      }
    }

    let notification_data = {};

    if (
      verbString.toUpperCase() === MEDICATION_CREATE ||
      verbString.toUpperCase() === MEDICATION_REMINDER_START
    ) {
      notification_data = {
        [`${id}`]: {
          is_read,
          group_id,
          foreign_id,
          time,
          notification_id: id,
          type: MEDICATION_REMINDER,
          stage: NOTIFICATION_STAGES.CREATE,
          actor: requiredActor,
          verb,
          response_taken: responseTaken,
          start_time: notification_start_time,
          create_time: notification_create_time
        }
      };

      for (const id of Object.keys(participants)) {
        const user = await UserWrapper(null, participants[id]);
        const { users, doctors, patients } = await user.getReferenceInfo();
        userData = { ...userData, ...users };
        doctorData = { ...doctorData, ...doctors };
        patientData = { ...patientData, ...patients };
      }

      return {
        notifications: notification_data,
        medications: eventData,
        medicines: medicineData,
        users: userData,
        doctors: doctorData,
        patients: patientData
      };
    }
  } catch (error) {
    Log.debug("medicationNotification 500 error", error);
    return {};
  }
};

const appointmentNotification = async data => {
  try {
    Log.debug("appointmentNotification data", data);
    const scheduleEventService = new ScheduleEventService();
    const {
      data: {
        actor,
        foreign_id,
        id,
        object,
        time,
        verb,
        prev: { startDate: prevStartDate, endDate: prevEndDate } = {},
        current: { startDate: currentStartDate, endDate: currentEndDate } = {},
        start_time: notification_start_time,
        create_time: notification_create_time
      } = {},
      loggedInUser,
      is_read,
      group_id
    } = data;

    let eventData = {};

    let userData = {};
    let doctorData = {};
    let patientData = {};
    let participants = [];
    let eventId = null;

    const verbString = verb.split(":")[0];

    if (verbString.toUpperCase() === APPOINTMENT_CREATE) {
      eventId = parseInt(foreign_id, 10);
    } else if (verbString.toUpperCase() === APPOINTMENT_START) {
      const scheduleEventData = await scheduleEventService.getEventByData({
        id: parseInt(foreign_id, 10)
      });
      const { event_id = null } = scheduleEventData;
      eventId = event_id;
    }

    if (
      verbString.toUpperCase() === APPOINTMENT_CREATE ||
      verbString.toUpperCase() === APPOINTMENT_START
    ) {
      const events = await AppointmentService.getAppointmentById(eventId);
      const event = await AppointmentWrapper(events);
      eventData = event.getBasicInfo();
      participants = event.getParticipants();
      Log.debug("participants --> ", participants);
      // } else {
      //     const events = await scheduleEventService.getEventByData({id: foreign_id});
      //     const event = await ScheduleEventWrapper(events);
      //     eventData = event.getData();
      //     participants = event.getParticipants();

      //     console.log("------- event data is: ", eventData);
    }

    if (eventData && eventData === null) {
      eventData = {};
    }
    let requiredActor = actor;

    if (!isEmpty(eventData)) {
      const { participant_one_id, participant_two_id } = participants || {};
      if (actor !== participant_one_id && actor !== participant_two_id) {
        requiredActor =
          loggedInUser === participant_one_id
            ? participant_two_id
            : participant_one_id;
      }
    }

    let notification_data = {};
    if (
      verbString.toUpperCase() === APPOINTMENT_CREATE ||
      verbString.toUpperCase() === APPOINTMENT_START
    ) {
      notification_data = {
        [`${id}`]: {
          is_read,
          group_id,
          foreign_id,
          time,
          notification_id: id,
          type: APPOINTMENT,
          stage: NOTIFICATION_STAGES.CREATE,
          actor: requiredActor,
          verb,
          start_time: notification_start_time,
          create_time: notification_create_time
        }
      };

      for (const id of Object.keys(participants)) {
        Log.debug("id of participants", participants[id]);
        if (participants[id]) {
          const user = await UserWrapper(null, participants[id]);
          const { users, doctors, patients } = await user.getReferenceInfo();
          userData = { ...userData, ...users };
          doctorData = { ...doctorData, ...doctors };
          patientData = { ...patientData, ...patients };
        }
      }

      Log.debug("userData", { ...userData });
      return {
        notifications: notification_data,
        appointments: { [eventId]: eventData },
        users: userData,
        doctors: doctorData,
        patients: patientData
      };
    }
  } catch (error) {
    Log.debug("appointmentNotification 500 error", error);
    return {};
  }
};

const vitalsNotification = async data => {
  try {
    Log.debug("vitalsNotification data", data);
    const scheduleEventService = new ScheduleEventService();
    const {
      data: {
        actor,
        foreign_id,
        id,
        object,
        time,
        verb,
        prev: { startDate: prevStartDate, endDate: prevEndDate } = {},
        current: { startDate: currentStartDate, endDate: currentEndDate } = {},
        start_time: notification_start_time,
        create_time: notification_create_time
      } = {},
      loggedInUser,
      is_read,
      group_id
    } = data;

    let eventData = {};

    let userData = {};
    let doctorData = {};
    let patientData = {};
    let participants = [];
    let eventId = null;

    const verbString = verb.split(":")[0];

    if (
      verbString.toUpperCase() === VITAL_CREATE ||
      verbString.toUpperCase() === VITAL_START
    ) {
      eventId = parseInt(foreign_id, 10);
    }
    //  else if (verbString.toUpperCase() === VITAL_START) {
    //   const scheduleEventData = await scheduleEventService.getEventByData({
    //     id: parseInt(foreign_id, 10)
    //   });
    //   const { event_id = null } = scheduleEventData;
    //   eventId = event_id;
    // }

    if (
      verbString.toUpperCase() === VITAL_CREATE ||
      verbString.toUpperCase() === VITAL_START
    ) {
      const events = await VitalService.getByData({ id: eventId });
      const event = await VitalWrapper(events);
      eventData = event.getBasicInfo();
      // participants = event.getParticipants();

      // Log.debug("participants --> ", participants);
    }

    if (eventData && eventData === null) {
      eventData = {};
    }
    let requiredActor = actor;

    // if (!isEmpty(eventData)) {
    //     const {participant_one_id, participant_two_id} = participants || {};
    //     if (actor !== participant_one_id && actor !== participant_two_id) {
    //         requiredActor =
    //             loggedInUser === participant_one_id
    //                 ? participant_two_id
    //                 : participant_one_id;
    //     }
    // }

    let notification_data = {};
    if (
      verbString.toUpperCase() === VITAL_CREATE ||
      verbString.toUpperCase() === VITAL_START
    ) {
      notification_data = {
        [`${id}`]: {
          is_read,
          group_id,
          foreign_id,
          time,
          notification_id: id,
          type: VITALS,
          stage: NOTIFICATION_STAGES.CREATE,
          actor: requiredActor,
          verb,
          start_time: notification_start_time,
          create_time: notification_create_time
        }
      };

      // for(const id of Object.keys(participants)) {
      //     Log.debug("id of participants", participants[id]);
      //     if(participants[id]) {
      //         const user = await UserWrapper(null, participants[id]);
      //         const {users, doctors, patients} = await user.getReferenceInfo();
      //         userData = {...userData, ...users};
      //         doctorData = {...doctorData, ...doctors};
      //         patientData = {...patientData, ...patients};
      //     }
      // }

      // Log.debug(" vitals userData", {...userData});
      console.log(
        "%%%%%%%%%% going to return vitals notification data: ",
        eventData
      );
      return {
        notifications: notification_data,
        vitals: { [eventId]: eventData }
        // users: userData,
        // doctors: doctorData,
        // patients: patientData
      };
    }
  } catch (error) {
    Log.debug("vitalsNotification 500 error", error);
    return {};
  }
};

const carePlanNotification = async data => {
  try {
    Log.debug("carePlanNotification data", data);
    const scheduleEventService = new ScheduleEventService();
    const {
      data: {
        actor,
        foreign_id,
        id,
        object,
        time,
        verb,
        prev: { startDate: prevStartDate, endDate: prevEndDate } = {},
        current: { startDate: currentStartDate, endDate: currentEndDate } = {},
        start_time: notification_start_time,
        create_time: notification_create_time
      } = {},
      loggedInUser,
      is_read,
      group_id
    } = data;

    let eventData = {};

    let userData = {};
    let doctorData = {};
    let patientData = {};
    let participants = [];
    let eventId = null;
    let responseTaken = false;

    const verbString = verb.split(":")[0];

    if (verbString.toUpperCase() === CARE_PLAN_CREATE) {
      const scheduleEventData = await scheduleEventService.getEventByData({
        id: parseInt(foreign_id, 10)
      });
      const { event_id = null, status = null } = scheduleEventData;
      if (
        status === EVENT_STATUS.COMPLETED ||
        status === EVENT_STATUS.CANCELLED ||
        status === EVENT_STATUS.PENDING
      ) {
        responseTaken = true;
      }
      eventId = event_id;
    }

    if (verbString.toUpperCase() === CARE_PLAN_CREATE) {
      const carePlan = await carePlanService.getCarePlanById(id);
      let event = await CarePlanWrapper(carePlan);
      eventData = event.getBasicInfo();
    }

    if (eventData && eventData === null) {
      eventData = {};
    }
    let requiredActor = actor;

    let notification_data = {};
    if (verbString.toUpperCase() === CARE_PLAN_CREATE) {
      notification_data = {
        [`${id}`]: {
          is_read,
          group_id,
          foreign_id,
          time,
          event_id: eventId,
          notification_id: id,
          type: CARE_PLAN_ACTIVATION,
          stage: NOTIFICATION_STAGES.CREATE,
          actor: requiredActor,
          verb,
          start_time: notification_start_time,
          create_time: notification_create_time,
          response_taken: responseTaken
        }
      };

      console.log(
        "%%%%%%%%%% going to return carePlanNotification data: ",
        eventData
      );
      return {
        notifications: notification_data,
        care_plans: { [eventId]: eventData }
      };
    }
  } catch (error) {
    Log.debug("carePlanNotification 500 error", error);
    return {};
  }
};

export const getDataForNotification = async data => {
  try {
    const { data: { event } = {} } = data;

    Log.debug("event", event);

    switch (event) {
      case APPOINTMENT:
        return await appointmentNotification(data);
      case MEDICATION_REMINDER:
        return await medicationNotification(data);
      case VITALS:
        return await vitalsNotification(data);
      case CARE_PLAN_ACTIVATION:
        return await carePlanNotification(data);
    }
  } catch (error) {
    Log.debug("getDataForNotification 500 error", error);
  }
};
