import Logger from "../../../libs/log";
import {
  NOTIFICATION_VERB,
  EVENT_TYPE,
  NOTIFICATION_STAGES,
  EVENT_STATUS,
  MESSAGE_TYPES,
  AGORA_CALL_NOTIFICATION_TYPES,
  USER_CATEGORY,
} from "../../../constant";

// lodash
import isEmpty from "lodash/isEmpty";

// SERVICES -------->
import userService from "../../services/user/user.service";
import AppointmentService from "../../services/appointment/appointment.service";
import MedicationService from "../../services/medicationReminder/mReminder.service";
import ScheduleEventService from "../../services/scheduleEvents/scheduleEvent.service";
import VitalService from "../../services/vitals/vital.service";
import carePlanService from "../../services/carePlan/carePlan.service";
import userRolesService from "../../services/userRoles/userRoles.service";
import SymptomService from "../../services/symptom/symptom.service"

// API WRAPPERS -------->
import AppointmentWrapper from "../../ApiWrapper/web/appointments";
import MedicationWrapper from "../../ApiWrapper/web/medicationReminder";
import EventWrapper from "../../ApiWrapper/common/scheduleEvents";
import UserWrapper from "../../ApiWrapper/web/user";
import VitalWrapper from "../../ApiWrapper/web/vitals";
import VitalTemplateWrapper from "../../ApiWrapper/web/vitalTemplates";
import CarePlanWrapper from "../../ApiWrapper/mobile/carePlan";
import UserRoleWrapper from "../../ApiWrapper/mobile/userRoles";
import SymptomWrapper from "../../ApiWrapper/mobile/symptoms";
import DietResponseWrapper from "../../ApiWrapper/mobile/dietResponse";
import DietWrapper from "../../ApiWrapper/mobile/diet";
import WorkoutResponseWrapper from "../../ApiWrapper/mobile/workoutResponse";
import WorkoutWrapper from "../../ApiWrapper/mobile/workouts";

import { getRoomUsers } from "../../helper/common";

const {
  APPOINTMENT_CREATE,
  APPOINTMENT_START,
  APPOINTMENT_PRIOR,
  MEDICATION_CREATE,
  MEDICATION_REMINDER_START,
  VITAL_CREATE,
  VITAL_START,
  CARE_PLAN_CREATE,
  VITAL_RESPONSE,
} = NOTIFICATION_VERB;

const {
  APPOINTMENT,
  MEDICATION_REMINDER,
  VITALS,
  CARE_PLAN_ACTIVATION,
  SYMPTOMS,
  DIET,
  WORKOUT,
} = EVENT_TYPE;

const { USER_MESSAGE } = MESSAGE_TYPES;

const Log = new Logger("WEB > NOTIFICATION > CONTROLLER > HELPER");

const medicationNotification = async (data) => {
  try {
    const scheduleEventService = new ScheduleEventService();
    const {
      data: {
        actor,
        actorRoleId,
        foreign_id,
        id,
        object,
        time,
        verb,
        prev: { startDate: prevStartDate, endDate: prevEndDate } = {},
        current: { startDate: currentStartDate, endDate: currentEndDate } = {},
        start_time: notification_start_time,
        create_time: notification_create_time,
      } = {},
      loggedInUser,
      is_read,
      group_id,
    } = data;

    let eventData = {};
    let medicineData = {};
    let userData = {};
    let userRoleData = {};
    let doctorData = {};
    let patientData = {};
    let participants = [];
    let eventId = null;
    let responseTaken = false;

    const verbString = verb.split(":")[0].toUpperCase() || null;

    if (verbString.toUpperCase() === MEDICATION_CREATE) {
      eventId = parseInt(foreign_id, 10);
    } else if (verbString.toUpperCase() === MEDICATION_REMINDER_START) {
      const scheduleEventData = await scheduleEventService.getEventByData({
        id: parseInt(foreign_id, 10),
      });
      const {
        event_id = null,
        details: { status = null } = {},
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
      const medication = await MedicationService.getMedication({ id: eventId });
      if (medication) {
        const event = await MedicationWrapper(medication);
        const { medications, medicines } = await event.getReferenceInfo();

        eventData = { ...eventData, ...medications };
        medicineData = { ...medicineData, ...medicines };
        participants = event.getParticipants();
      }
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
          // stage: NOTIFICATION_STAGES.CREATE,
          stage:
            verbString.toUpperCase() === MEDICATION_CREATE
              ? NOTIFICATION_STAGES.CREATE
              : NOTIFICATION_STAGES.START,
          actor: requiredActor,
          actor_role_id: actorRoleId,
          verb,
          response_taken: responseTaken,
          start_time: notification_start_time,
          create_time: notification_create_time,
        },
      };

      for (const id of Object.keys(participants)) {
        const user = await UserWrapper(null, participants[id]);
        const { users, doctors, patients } = await user.getReferenceInfo();
        userData = { ...userData, ...users };
        doctorData = { ...doctorData, ...doctors };
        patientData = { ...patientData, ...patients };

        const userRole = await userRolesService.getByData({user_identity: participants[id]});
          if(userRole && userRole.length) {
            for(let i =0; i< userRole.length; i++) {
              const userRoleWrapper = await UserRoleWrapper(userRole[i]);
              userRoleData = {...userRoleData, ...{[userRoleWrapper.getId()]: userRoleWrapper.getBasicInfo()}}
            }
        }
      }

      return {
        notifications: notification_data,
        medications: eventData,
        medicines: medicineData,
        users: userData,
        doctors: doctorData,
        patients: patientData,
        user_roles: userRoleData
      };
    }
  } catch (error) {
    Log.debug("medicationNotification 500 error", error);
    return {};
  }
};

const appointmentNotification = async (data, category) => {
  try {
    Log.debug("appointmentNotification data", data);
    const scheduleEventService = new ScheduleEventService();
    const {
      data: {
        actor,
        actorRoleId,
        foreign_id,
        id,
        object,
        time,
        verb,
        prev: { startDate: prevStartDate, endDate: prevEndDate } = {},
        current: { startDate: currentStartDate, endDate: currentEndDate } = {},
        start_time: notification_start_time,
        create_time: notification_create_time,
      } = {},
      loggedInUser,
      is_read,
      group_id,
    } = data;

    let eventData = {};

    let userData = {};
    let doctorData = {};
    let patientData = {};
    let userRoleData = {};
    let participants = [];
    let scheduleEventData = {};
    let eventId = null;

    const verbString = verb.split(":")[0];

    if (
      (category === USER_CATEGORY.DOCTOR || category === USER_CATEGORY.HSP) &&
      verbString.toUpperCase() === APPOINTMENT_CREATE
    ) {
      return {};
    }

    if (verbString.toUpperCase() === APPOINTMENT_CREATE) {
      eventId = parseInt(foreign_id, 10);
    } else if (
      verbString.toUpperCase() === APPOINTMENT_START ||
      verbString.toUpperCase() === APPOINTMENT_PRIOR
    ) {
      const scheduleEvent = await scheduleEventService.getEventByData({
        id: parseInt(foreign_id, 10),
      });

      const scheduleEventWrapper = await EventWrapper(scheduleEvent);
      scheduleEventData = {
        [scheduleEventWrapper.getScheduleEventId()]: scheduleEventWrapper.getAllInfo(),
      };
      eventId = scheduleEventWrapper.getEventId();
    }

    if (
      verbString.toUpperCase() === APPOINTMENT_CREATE ||
      verbString.toUpperCase() === APPOINTMENT_START ||
      verbString.toUpperCase() === APPOINTMENT_PRIOR
    ) {
      const events = await AppointmentService.getAppointmentById(eventId);
      const event = await AppointmentWrapper(events);
      eventData = event.getBasicInfo();
      participants = event.getParticipants();
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
      verbString.toUpperCase() === APPOINTMENT_START ||
      verbString.toUpperCase() === APPOINTMENT_PRIOR
    ) {
      notification_data = {
        [`${id}`]: {
          is_read,
          group_id,
          foreign_id,
          time,
          notification_id: id,
          type: APPOINTMENT,
          // stage: NOTIFICATION_STAGES.CREATE,
          stage:
            verbString.toUpperCase() === APPOINTMENT_CREATE
              ? NOTIFICATION_STAGES.CREATE
              : verbString.toUpperCase() === APPOINTMENT_PRIOR
              ? NOTIFICATION_STAGES.PRIOR
              : NOTIFICATION_STAGES.START,
          actor: requiredActor,
          actor_role_id: actorRoleId,
          verb,
          start_time: notification_start_time,
          create_time: notification_create_time,
        },
      };

      for (const id of Object.keys(participants)) {
        Log.debug("id of participants", participants[id]);
        if (participants[id]) {
          const user = await UserWrapper(null, participants[id]);
          const { users, doctors, patients } = await user.getReferenceInfo();
          userData = { ...userData, ...users };
          doctorData = { ...doctorData, ...doctors };
          patientData = { ...patientData, ...patients };

          const userRole = await userRolesService.getByData({user_identity: participants[id]});
          if(userRole && userRole.length) {
            for(let i =0; i< userRole.length; i++) {
              const userRoleWrapper = await UserRoleWrapper(userRole[i]);
              userRoleData = {...userRoleData, ...{[userRoleWrapper.getId()]: userRoleWrapper.getBasicInfo()}}
            }
          }
        }
      }

      return {
        notifications: notification_data,
        appointments: { [eventId]: eventData },
        users: userData,
        doctors: doctorData,
        patients: patientData,
        user_roles: userRoleData,
        schedule_events: scheduleEventData
      };
    }
  } catch (error) {
    Log.debug("appointmentNotification 500 error", error);
    return {};
  }
};

const vitalsNotification = async (data, category) => {
  try {
    Log.debug("vitalsNotification data", data);
    const scheduleEventService = new ScheduleEventService();
    const {
      data: {
        actor,
        actorRoleId,
        foreign_id,
        id,
        object,
        time,
        verb,
        prev: { startDate: prevStartDate, endDate: prevEndDate } = {},
        current: { startDate: currentStartDate, endDate: currentEndDate } = {},
        start_time: notification_start_time,
        create_time: notification_create_time,
      } = {},
      loggedInUser,
      is_read,
      group_id,
    } = data;




    let eventData = {};

    // let userData = {};
    // let doctorData = {};
    // let patientData = {};
    // let participants = [];
    let scheduleEventsData = {};
    let eventId = null;
    let vitalTemplateData = {};

    const verbString = verb.split(":")[0];
    if ((category === USER_CATEGORY.DOCTOR || category === USER_CATEGORY.HSP) && verbString !== VITAL_RESPONSE) {
      return {};
    }

    if (
      verbString.toUpperCase() === VITAL_CREATE ||
      verbString.toUpperCase() === VITAL_START
    ) {
      eventId = parseInt(foreign_id, 10);
    } else if (verbString === VITAL_RESPONSE) {
      const scheduleEventData = await scheduleEventService.getEventByData({
        id: parseInt(foreign_id, 10),
      });
      const { event_id = null } = scheduleEventData || {};

      const scheduleEventWrapper = await EventWrapper(scheduleEventData);
      scheduleEventsData[
        scheduleEventWrapper.getScheduleEventId()
      ] = scheduleEventWrapper.getAllInfo();
      eventId = event_id;
    }

    if (
      verbString.toUpperCase() === VITAL_CREATE ||
      verbString.toUpperCase() === VITAL_START ||
      verbString === VITAL_RESPONSE
    ) {
      const events = await VitalService.getByData({ id: eventId });
      const event = await VitalWrapper(events);
      eventData = event.getBasicInfo();

      const vitalTemplate = await VitalTemplateWrapper({
        id: event.getVitalTemplateId(),
      });

      vitalTemplateData[
        vitalTemplate.getVitalTemplateId()
      ] = vitalTemplate.getBasicInfo();
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
      verbString.toUpperCase() === VITAL_START ||
      verbString === VITAL_RESPONSE
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
          actor_role_id:actorRoleId,
          verb,
          start_time: notification_start_time,
          create_time: notification_create_time,
        },
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

      return {
        notifications: notification_data,
        vitals: { [eventId]: eventData },
        schedule_events: scheduleEventsData,
        vital_templates: vitalTemplateData,
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

const carePlanNotification = async (data) => {
  try {
    Log.debug("carePlanNotification data", data);
    const scheduleEventService = new ScheduleEventService();
    const {
      data: {
        actor,
        actorRoleId,
        foreign_id,
        id,
        object,
        time,
        verb,
        prev: { startDate: prevStartDate, endDate: prevEndDate } = {},
        current: { startDate: currentStartDate, endDate: currentEndDate } = {},
        start_time: notification_start_time,
        create_time: notification_create_time,
      } = {},
      loggedInUser,
      is_read,
      group_id,
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
        id: parseInt(foreign_id, 10),
      });
      const { event_id = null, status = null } = scheduleEventData;
      if (
        status === EVENT_STATUS.COMPLETED ||
        status === EVENT_STATUS.CANCELLED
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
          actor_role_id: actorRoleId,
          verb,
          start_time: notification_start_time,
          create_time: notification_create_time,
          response_taken: responseTaken,
        },
      };
      return {
        notifications: notification_data,
        care_plans: { [eventId]: eventData },
      };
    }
  } catch (error) {
    Log.debug("carePlanNotification 500 error", error);
    return {};
  }
};

const chatMessageNotification = async (data) => {
  try {
    Log.debug("chatMessageNotification data", data);
    const {
      data: {
        actor,
        actorRoleId,
        foreign_id,
        id,
        message,
        time,
        verb,
        start_time: notification_start_time,
        create_time: notification_create_time,
      } = {},
      loggedInUser,
      is_read,
      group_id,
    } = data;

    let notification_data = {
        [`${id}`]: {
          is_read,
          group_id,
          foreign_id,
          time,
          event_id: null,
          notification_id: id,
          type: USER_MESSAGE,
          actor,
          actor_role_id: actorRoleId,
          verb,
          message,
          start_time: notification_start_time,
          create_time: notification_create_time
        }
      };

    return {
      notifications: notification_data,
    };
  } catch (error) {
    Log.debug("chatMessageNotification 500 error", error);
    return {};
  }
};

const callNotification = async (data) => {
  try {
    Log.debug("callNotification data", data);
    const {
      data: {
        actor,
        actorRoleId,
        foreign_id,
        id,
        message,
        time,
        verb,
        start_time: notification_start_time,
        create_time: notification_create_time,
      } = {},
      loggedInUser,
      is_read,
      group_id,
    } = data;

    const userRoleIds = getRoomUsers(foreign_id) || [];
    let participantData = {};
    if (userRoleIds.length > 0) {
      for (let index = 0; index < userRoleIds.length; index++) {
        const userRoleId = userRoleIds[index] || null;
        const userRoleWrapper = await UserRoleWrapper(null,userRoleId);
        const userId = await userRoleWrapper.getUserId();
        const user = (await userService.getUser(userId)) || null;
        const userWrapper = await UserWrapper(user.get());
        const { doctor_id, patient_id } = await userWrapper.getReferenceInfo();
        participantData[`${userRoleIds[index]}`] = {
          doctor_id,
          patient_id,
        };
      }
    }

    let type = AGORA_CALL_NOTIFICATION_TYPES.MISSED_CALL;

    if(verb.includes(AGORA_CALL_NOTIFICATION_TYPES.START_CALL.toLowerCase())){
      type= AGORA_CALL_NOTIFICATION_TYPES.START_CALL
    }

    let notification_data = {
        [`${id}`]: {
          is_read,
          group_id,
          foreign_id,
          time,
          event_id: null,
          notification_id: id,
          type,
          actor,
          actor_role_id: actorRoleId,
          verb,
          message,
          start_time: notification_start_time,
          create_time: notification_create_time,
          participantData
        }
    };

    return {
      notifications: notification_data,
    };
  } catch (error) {
    Log.debug("callNotification 500 error", error);
    return {};
  }
};

const dietNotification = async (data) => {
  try {
    Log.debug("dietNotification data", data);
    const {
      data: {
        actor,
        actorRoleId,
        foreign_id,
        id,
        // object,
        time,
        verb,
        start_time: notification_start_time,
        create_time: notification_create_time,
      } = {},
      // loggedInUser,
      is_read,
      group_id,
    } = data;

    let allScheduleEvents = {};
    let allDietResponses = {};
    let allUploadDocuments = {};

    const scheduleEventService = new ScheduleEventService();

    const verbString = verb.split(":")[0];

    let eventId = null;
    let stage = null;

    if (verbString === NOTIFICATION_VERB.DIET_CREATION) {
      // foreign id = diet id

      eventId = parseInt(foreign_id, 10);
      stage = NOTIFICATION_STAGES.CREATE;
    } else if (
      verbString === NOTIFICATION_VERB.DIET_PRIOR ||
      verbString === NOTIFICATION_VERB.DIET_START
    ) {
      // foreign id = schedule event id

      const scheduleEvent = await scheduleEventService.getEventByData({
        paranoid:false,
        id: parseInt(foreign_id, 10),
      });
      const scheduleEventWrapper = await EventWrapper(scheduleEvent);
      allScheduleEvents = {
        [scheduleEventWrapper.getScheduleEventId()]: scheduleEventWrapper.getAllInfo(),
      };
      eventId = scheduleEventWrapper.getEventId();
      stage =
        verbString === NOTIFICATION_VERB.DIET_PRIOR
          ? NOTIFICATION_STAGES.PRIOR
          : NOTIFICATION_STAGES.CREATE;
    } else if (verbString === NOTIFICATION_VERB.DIET_RESPONSE) {
      // foreign id = diet response id

      const dietResponse = await DietResponseWrapper({ id: foreign_id });
      const {
        schedule_events,
        diet_responses,
        upload_documents,
        diet_response_id,
      } = await dietResponse.getReferenceInfo();
      const { basic_info: { diet_id } = {} } =
        diet_responses[diet_response_id] || {};
      allScheduleEvents = schedule_events;
      allDietResponses = diet_responses;
      allUploadDocuments = upload_documents;
      eventId = diet_id;
      stage = NOTIFICATION_STAGES.RESPONSE_ADDED;
    }

    const diet = await DietWrapper({ id: eventId });

    const notification_data = {
      [`${id}`]: {
        is_read,
        group_id,
        foreign_id,
        time,
        notification_id: id,
        type: DIET,
        stage,
        actor,
        actor_role_id:actorRoleId,
        verb,
        start_time: notification_start_time,
        create_time: notification_create_time,
        diet_id: eventId,
      },
    };

    return {
      notifications: notification_data,
      diet_responses: allDietResponses,
      upload_documents: allUploadDocuments,
      schedule_events: allScheduleEvents,
      ...(await diet.getReferenceInfo()),
    };
  } catch (error) {
    Log.debug("dietNotification 500 error", error);
    return {};
  }
};

const workoutNotification = async (data) => {
  try {
    Log.debug("workoutNotification data", data);
    const {
      data: {
        actor,
        actorRoleId,
        foreign_id,
        id,
        // object,
        time,
        verb,
        start_time: notification_start_time,
        create_time: notification_create_time,
      } = {},
      // loggedInUser,
      is_read,
      group_id,
    } = data;

    let allScheduleEvents = {};
    let allWorkoutResponses = {};

    const scheduleEventService = new ScheduleEventService();

    const verbString = verb.split(":")[0];

    let eventId = null;
    let stage = null;

    if (verbString === NOTIFICATION_VERB.WORKOUT_CREATION) {
      // foreign id = diet id

      eventId = parseInt(foreign_id, 10);
      stage = NOTIFICATION_STAGES.CREATE;
    } else if (
      verbString === NOTIFICATION_VERB.WORKOUT_PRIOR ||
      verbString === NOTIFICATION_VERB.WORKOUT_START
    ) {
      // foreign id = schedule event id

      const scheduleEvent = await scheduleEventService.getEventByData({
        paranoid:false,
        id: parseInt(foreign_id, 10),
      });
      const scheduleEventWrapper = await EventWrapper(scheduleEvent);
      allScheduleEvents = {
        [scheduleEventWrapper.getScheduleEventId()]: scheduleEventWrapper.getAllInfo(),
      };
      eventId = scheduleEventWrapper.getEventId();
      stage =
        verbString === NOTIFICATION_VERB.WORKOUT_PRIOR
          ? NOTIFICATION_STAGES.PRIOR
          : NOTIFICATION_STAGES.CREATE;
    } else if (verbString === NOTIFICATION_VERB.WORKOUT_RESPONSE) {
      // foreign id = diet response id

      const workoutResponse = await WorkoutResponseWrapper({ id: foreign_id });
      const {
        schedule_events,
        workout_responses,
        workout_response_id,
      } = await workoutResponse.getReferenceInfo();
      const { basic_info: { workout_id } = {} } =
        workout_responses[workout_response_id] || {};
      allScheduleEvents = schedule_events;
      allWorkoutResponses = workout_responses;
      eventId = workout_id;
      stage = NOTIFICATION_STAGES.RESPONSE_ADDED;
    }

    const workout = await WorkoutWrapper({ id: eventId });

    const notification_data = {
      [`${id}`]: {
        is_read,
        group_id,
        foreign_id,
        time,
        notification_id: id,
        type: WORKOUT,
        stage,
        actor,
        actor_role_id:actorRoleId,
        verb,
        start_time: notification_start_time,
        create_time: notification_create_time,
        workout_id: eventId,
      },
    };

    return {
      notifications: notification_data,
      workout_responses: allWorkoutResponses,
      schedule_events: allScheduleEvents,
      ...(await workout.getReferenceInfo()),
    };
  } catch (error) {
    Log.debug("workoutNotification 500 error", error);
    return {};
  }
};

const symptomsNotification = async (data) => {
  try {
    Log.debug("symptomsNotification data", data);
    const {
      data: {
        actor,
        actorRoleId,
        foreign_id,
        id,
        object,
        time,
        verb,
        prev: { startDate: prevStartDate, endDate: prevEndDate } = {},
        current: { startDate: currentStartDate, endDate: currentEndDate } = {},
        start_time: notification_start_time,
        create_time: notification_create_time,
      } = {},
      loggedInUser,
      is_read,
      group_id,
    } = data;

    let userData = {};
    let doctorData = {};
    let patientData = {};
    let participants = [object, actor];
    let eventId = parseInt(foreign_id, 10);
    let symptomsData = {};

    const symptomExists = await SymptomService.getByData({ id: eventId });
    if (symptomExists) {
      const symptom = await SymptomWrapper({ data: symptomExists });
      symptomsData = { [symptom.getSymptomId()]: symptom.getBasicInfo() };
    }

    let notification_data = {};

    notification_data = {
      [`${id}`]: {
        is_read,
        group_id,
        foreign_id,
        time,
        notification_id: id,
        type: SYMPTOMS,
        stage: NOTIFICATION_STAGES.CREATE,
        actor,
        actor_role_id: actorRoleId,
        verb,
        start_time: notification_start_time,
        create_time: notification_create_time,
      },
    };

    for (const id of Object.keys(participants)) {
      if (participants[id]) {
        const user = await UserWrapper(null, participants[id]);
        const { users, doctors, patients } = await user.getReferenceInfo();
        userData = { ...userData, ...users };
        doctorData = { ...doctorData, ...doctors };
        patientData = { ...patientData, ...patients };
      }
    }
    return {
      notifications: notification_data,
      symptoms: symptomsData,
      users: userData,
      doctors: doctorData,
      patients: patientData,
    };
  } catch (error) {
    Log.debug("symptomsNotification 500 error", error);
    return {};
  }
};

export const getDataForNotification = async (data) => {
  try {
    const { category, data: { event } = {} } = data;

    Log.debug("event", event);

    // console.log("989387482748723487239847238 ===>>>>>>>>>>> ",{event}); 


    if (category === USER_CATEGORY.DOCTOR || category === USER_CATEGORY.HSP) {
      switch (event) {
        case APPOINTMENT:
          return await appointmentNotification(data, category);
        case USER_MESSAGE:
          return await chatMessageNotification(data);
        case AGORA_CALL_NOTIFICATION_TYPES.MISSED_CALL:
          return await callNotification(data);
        case AGORA_CALL_NOTIFICATION_TYPES.START_CALL:
          return await callNotification(data);
        case SYMPTOMS:
          return await symptomsNotification(data);
        case VITALS:
          return await vitalsNotification(data, category);
        case DIET:
          return await dietNotification(data);
        case WORKOUT:
          return await workoutNotification(data);
      }
    } else if (category === USER_CATEGORY.PATIENT) {
      switch (event) {
        case APPOINTMENT:
          return await appointmentNotification(data, category);
        case MEDICATION_REMINDER:
          return await medicationNotification(data);
        case VITALS:
          return await vitalsNotification(data, category);
        case CARE_PLAN_ACTIVATION:
          return await carePlanNotification(data);
        case USER_MESSAGE:
          return await chatMessageNotification(data);
        case AGORA_CALL_NOTIFICATION_TYPES.MISSED_CALL:
          return await callNotification(data);
        case AGORA_CALL_NOTIFICATION_TYPES.START_CALL:
          return await callNotification(data);
        case DIET:
          return await dietNotification(data);
        case WORKOUT:
          return await workoutNotification(data);
      }
    }
  } catch (error) {
    Log.debug("getDataForNotification 500 error", error);
  }
};
