import isEmpty from "lodash/isEmpty";
import { NOTIFICATION_VERB, NOTIFICATION_STAGES } from "../../../constant";
import eventService from "../../services/event/event.service";
import schedulerService from "../../services/scheduler/scheduler.service";
import userService from "../../services/user/user.service";
import articleService from "../../services/article/article.service";
import medicalConditiionService from "../../services/medicalCondition/medicalCondition.service";
import productService from "../../services/product/product.service";
import hospitalizationService from "../../services/hospitalization/hospitalization.service";
import benefitPlanService from "../../services/benefitPlan/benefitPlan.service";
import dispensationService from "../../services/dispensation/dispensation.service";
import charityService from "../../services/charity";
import contributionService from "../../services/contributions/contribution.service";
import charityAppliedservice from "../../services/charitiesApplied/charitiesApplied.service";
import { SURVEY } from "../../surveySdk";
import moment from "moment";

const {
  APPOINTMENT,
  APPOINTMENT_CREATE,
  APPOINTMENT_UPDATE,
  APPOINTMENT_EDIT_NOTES,
  APPOINTMENT_START,
  APPOINTMENT_PRIOR,
  APPOINTMENT_DELETE,
  APPOINTMENT_DELETE_ALL,
  REMINDER,
  REMINDER_CREATE,
  REMINDER_UPDATE,
  REMINDER_START,
  REMINDER_DELETE,
  REMINDER_DELETE_ALL,
  REMINDER_EDIT_NOTES,
  SURVEY: SURVEY_VERB,
  SURVEY_CREATE,
  SURVEY_UPDATE,
  ADVERSE_EVENT,
  ADVERSE_EVENT_CREATE,
  VITALS,
  VITALS_UPDATE,
  BASIC,
  BASIC_UPDATE,
  CLINICAL_READING,
  CLINICAL_READING_CREATE,
  CLINICAL_READING_UPDATE,
  CLINICAL_READING_DELETE,
  MEDICATION,
  MEDICATION_CREATE,
  MEDICATION_DELETE,
  MEDICATION_UPDATE,
  ARTICLE,
  ARTICLE_SHARE,
  ARTICLE_UPDATE,
  PRESCRIPTION,
  PRESCRIPTION_CREATE,
  PRESCRIPTION_UPDATE,
  PROGRAM,
  PROGRAM_CREATE,
  PROGRAM_UPDATE,
  MEDICATION_REMINDER,
  MEDICATION_REMINDER_CREATE,
  MEDICATION_REMINDER_START,
  HOSPITALISATION,
  HOSPITALISATION_CREATE,
  BENEFIT_DOCS_VERIFIED,
  CHARITY_APPROVAL,
  MRL_GENERATION
} = NOTIFICATION_VERB;

export const getDataforNotification = async data => {
  try {
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
        startTime: notification_startTime
      } = {},
      loggedInUser,
      is_read
    } = data;

    // console.log('data==========================>', data)
    let notification_data = {};
    let events = {};
    let users = {};
    let surveys = {};
    let articles = {};
    let products = {};
    let participant_one = "";
    let participant_two = "";
    if (
      verb === APPOINTMENT_CREATE ||
      verb === REMINDER_CREATE ||
      verb === APPOINTMENT_DELETE_ALL ||
      verb === REMINDER_DELETE_ALL ||
      verb === ADVERSE_EVENT_CREATE ||
      verb === MEDICATION_REMINDER_CREATE
    ) {
      events = (await eventService.getEventById(foreign_id)) || {};
      const { participantOne, participantTwo } = events || {};
      participant_one = participantOne;
      participant_two = participantTwo;
    } else {
      events = await schedulerService.getScheduleEventById(foreign_id);
      const { data: { participantOne, participantTwo } = {} } = events || {};

      participant_one = participantOne;
      participant_two = participantTwo;
    }
    // console.log("events=============>", events);
    if (events && events === null) {
      events = {};
    }
    let requiredActor = actor;

    if (!isEmpty(events)) {
      if (actor !== participant_one && actor !== participant_two) {
        requiredActor =
          loggedInUser === participant_one.toString()
            ? participant_two
            : participant_one;
      }
    }

    let participantOneData = {};
    let participantTwoData = {};

    switch (verb) {
      // as invitee to the program as doctor or carecoach
      case APPOINTMENT_CREATE:
        notification_data[id] = {};
        notification_data[id].is_read = is_read;
        notification_data[id].notification_id = id;
        notification_data[id].type = APPOINTMENT;
        notification_data[id].stage = NOTIFICATION_STAGES.CREATE;
        notification_data[id].actor = requiredActor;
        notification_data[id].foreign_id = foreign_id;
        notification_data[id].time = time;
        users = await userService.getBasicInfo(requiredActor);
        participantOneData = await userService.getBasicInfo(participant_one);
        participantTwoData = await userService.getBasicInfo(participant_two);
        return {
          notification_data,
          events: { [foreign_id]: { ...events, id: foreign_id } },
          users: {
            [requiredActor]: { basicInfo: users },
            [participant_one]: { basicInfo: participantOneData },
            [participant_two]: { basicInfo: participantTwoData }
          }
        };

      case APPOINTMENT_START:
        notification_data[id] = {};
        notification_data[id].is_read = is_read;
        notification_data[id].notification_id = id;
        notification_data[id].type = APPOINTMENT;
        notification_data[id].stage = NOTIFICATION_STAGES.START;
        notification_data[id].foreign_id = foreign_id;
        notification_data[id].time = time;
        notification_data[id].startTime = notification_startTime;
        // events = (await eventService.getEventById(foreign_id)) || {};

        participantOneData = await userService.getBasicInfo(participant_one);
        participantTwoData = await userService.getBasicInfo(participant_two);
        const reqUser =
          object === participant_one ? participant_two : participant_one;

        notification_data[id].actor = reqUser;
        users = await userService.getBasicInfo(reqUser);
        return {
          notification_data,
          events: { [foreign_id]: { ...events, id: foreign_id } },
          users: {
            [reqUser]: { basicInfo: users },
            [participant_one]: { basicInfo: participantOneData },
            [participant_two]: { basicInfo: participantTwoData }
          }
        };

      case APPOINTMENT_UPDATE:
        notification_data[id] = {};
        notification_data[id].is_read = is_read;
        notification_data[id].notification_id = id;
        notification_data[id].type = APPOINTMENT;
        notification_data[id].stage = NOTIFICATION_STAGES.UPDATE;
        notification_data[id].foreign_id = foreign_id;
        notification_data[id].actor = requiredActor;
        notification_data[id].time = time;
        notification_data[id].prevStartDate = prevStartDate;
        notification_data[id].prevEndDate = prevEndDate;
        notification_data[id].currentStartDate = currentStartDate;
        notification_data[id].currentEndDate = currentEndDate;

        participantOneData = await userService.getBasicInfo(participant_one);
        participantTwoData = await userService.getBasicInfo(participant_two); // events = (await eventService.getEventById(foreign_id)) || {};
        users = await userService.getBasicInfo(requiredActor);
        return {
          notification_data,
          events: { [foreign_id]: { ...events, id: foreign_id } },
          users: {
            [requiredActor]: { basicInfo: users },
            [participant_one]: { basicInfo: participantOneData },
            [participant_two]: { basicInfo: participantTwoData }
          }
        };

      case APPOINTMENT_EDIT_NOTES:
        notification_data[id] = {};
        notification_data[id].is_read = is_read;
        notification_data[id].notification_id = id;
        notification_data[id].type = APPOINTMENT;
        notification_data[id].stage = NOTIFICATION_STAGES.EDIT_NOTES;
        notification_data[id].foreign_id = foreign_id;
        notification_data[id].actor = requiredActor;
        notification_data[id].time = time;

        participantOneData = await userService.getBasicInfo(participant_one);
        participantTwoData = await userService.getBasicInfo(participant_two); // events = (await eventService.getEventById(foreign_id)) || {};
        users = await userService.getBasicInfo(requiredActor);
        return {
          notification_data,
          events: { [foreign_id]: { ...events, id: foreign_id } },
          users: {
            [requiredActor]: { basicInfo: users },
            [participant_one]: { basicInfo: participantOneData },
            [participant_two]: { basicInfo: participantTwoData }
          }
        };

      case APPOINTMENT_PRIOR:
        notification_data[id] = {};
        notification_data[id].is_read = is_read;
        notification_data[id].notification_id = id;
        notification_data[id].type = APPOINTMENT;
        notification_data[id].stage = NOTIFICATION_STAGES.PRIOR;
        notification_data[id].foreign_id = foreign_id;
        notification_data[id].time = time;
        notification_data[id].startTime = notification_startTime;

        participantOneData = await userService.getBasicInfo(participant_one);
        participantTwoData = await userService.getBasicInfo(participant_two); // events = (await eventService.getEventById(foreign_id)) || {};

        const reqUser2 =
          object === participant_one ? participant_two : participant_one;

        notification_data[id].actor = reqUser2;
        users = await userService.getBasicInfo(reqUser2);
        return {
          notification_data,
          events: { [foreign_id]: { ...events, id: foreign_id } },
          users: {
            [reqUser2]: { basicInfo: users },
            [participant_one]: { basicInfo: participantOneData },
            [participant_two]: { basicInfo: participantTwoData }
          }
        };

      case APPOINTMENT_DELETE:
        notification_data[id] = {};
        notification_data[id].is_read = is_read;
        notification_data[id].notification_id = id;
        notification_data[id].type = APPOINTMENT;
        notification_data[id].stage = NOTIFICATION_STAGES.DELETE;
        notification_data[id].foreign_id = foreign_id;
        notification_data[id].actor = requiredActor;
        notification_data[id].time = time;

        participantOneData = await userService.getBasicInfo(participant_one);
        participantTwoData = await userService.getBasicInfo(participant_two); // events = (await eventService.getEventById(foreign_id)) || {};
        users = await userService.getBasicInfo(requiredActor);
        return {
          notification_data,
          events: { [foreign_id]: { ...events, id: foreign_id } },
          users: {
            [requiredActor]: { basicInfo: users },
            [participant_one]: { basicInfo: participantOneData },
            [participant_two]: { basicInfo: participantTwoData }
          }
        };

      case APPOINTMENT_DELETE_ALL:
        notification_data[id] = {};
        notification_data[id].is_read = is_read;
        notification_data[id].notification_id = id;
        notification_data[id].type = APPOINTMENT;
        notification_data[id].stage = NOTIFICATION_STAGES.DELETE;
        notification_data[id].foreign_id = foreign_id;
        notification_data[id].actor = requiredActor;
        notification_data[id].time = time;

        participantOneData = await userService.getBasicInfo(participant_one);
        participantTwoData = await userService.getBasicInfo(participant_two); // events = (await eventService.getEventById(foreign_id)) || {};
        users = await userService.getBasicInfo(requiredActor);
        return {
          notification_data,
          events: { [foreign_id]: { ...events, id: foreign_id } },
          users: {
            [requiredActor]: { basicInfo: users },
            [participant_one]: { basicInfo: participantOneData },
            [participant_two]: { basicInfo: participantTwoData }
          }
        };

      case REMINDER_CREATE:
        notification_data[id] = {};
        notification_data[id].is_read = is_read;
        notification_data[id].notification_id = id;
        notification_data[id].type = REMINDER;
        notification_data[id].stage = NOTIFICATION_STAGES.CREATE;
        notification_data[id].actor = requiredActor;
        notification_data[id].foreign_id = foreign_id;
        notification_data[id].time = time;

        participantOneData = await userService.getBasicInfo(participant_one);
        participantTwoData = await userService.getBasicInfo(participant_two); // events = (await eventService.getEventById(foreign_id)) || {};
        users = await userService.getBasicInfo(requiredActor);
        return {
          notification_data,
          events: { [foreign_id]: { ...events, id: foreign_id } },
          users: {
            [requiredActor]: { basicInfo: users },
            [participant_one]: { basicInfo: participantOneData },
            [participant_two]: { basicInfo: participantTwoData }
          }
        };

      case REMINDER_START:
        notification_data[id] = {};
        notification_data[id].is_read = is_read;
        notification_data[id].notification_id = id;
        notification_data[id].type = REMINDER;
        notification_data[id].stage = NOTIFICATION_STAGES.START;
        notification_data[id].foreign_id = foreign_id;
        notification_data[id].time = time;
        notification_data[id].startTime = startTime;

        participantOneData = await userService.getBasicInfo(participant_one);
        participantTwoData = await userService.getBasicInfo(participant_two); // events = (await eventService.getEventById(foreign_id)) || {};

        const remreqUser =
          object === participant_one ? participant_two : participant_one;

        notification_data[id].actor = remreqUser;
        users = await userService.getBasicInfo(remreqUser);
        return {
          notification_data,
          events: { [foreign_id]: { ...events, id: foreign_id } },
          users: {
            [remreqUser]: { basicInfo: users },
            [participant_one]: { basicInfo: participantOneData },
            [participant_two]: { basicInfo: participantTwoData }
          }
        };

      case REMINDER_UPDATE:
        notification_data[id] = {};
        notification_data[id].is_read = is_read;
        notification_data[id].notification_id = id;
        notification_data[id].type = REMINDER;
        notification_data[id].stage = NOTIFICATION_STAGES.UPDATE;
        notification_data[id].foreign_id = foreign_id;
        notification_data[id].actor = requiredActor;
        notification_data[id].time = time;
        notification_data[id].prevStartDate = prevStartDate;
        notification_data[id].prevEndDate = prevEndDate;
        notification_data[id].currentStartDate = currentStartDate;
        notification_data[id].currentEndDate = currentEndDate;

        participantOneData = await userService.getBasicInfo(participant_one);
        participantTwoData = await userService.getBasicInfo(participant_two); // events = (await eventService.getEventById(foreign_id)) || {};
        users = await userService.getBasicInfo(requiredActor);
        return {
          notification_data,
          events: { [foreign_id]: { ...events, id: foreign_id } },
          users: {
            [requiredActor]: { basicInfo: users },
            [participant_one]: { basicInfo: participantOneData },
            [participant_two]: { basicInfo: participantTwoData }
          }
        };

      case REMINDER_EDIT_NOTES:
        notification_data[id] = {};
        notification_data[id].is_read = is_read;
        notification_data[id].notification_id = id;
        notification_data[id].type = REMINDER;
        notification_data[id].stage = NOTIFICATION_STAGES.EDIT_NOTES;
        notification_data[id].foreign_id = foreign_id;
        notification_data[id].actor = requiredActor;
        notification_data[id].time = time;

        participantOneData = await userService.getBasicInfo(participant_one);
        participantTwoData = await userService.getBasicInfo(participant_two); // events = (await eventService.getEventById(foreign_id)) || {};
        users = await userService.getBasicInfo(requiredActor);
        return {
          notification_data,
          events: { [foreign_id]: { ...events, id: foreign_id } },
          users: {
            [requiredActor]: { basicInfo: users },
            [participant_one]: { basicInfo: participantOneData },
            [participant_two]: { basicInfo: participantTwoData }
          }
        };

      case REMINDER_DELETE:
        notification_data[id] = {};
        notification_data[id].is_read = is_read;
        notification_data[id].notification_id = id;
        notification_data[id].type = REMINDER;
        notification_data[id].stage = NOTIFICATION_STAGES.DELETE;
        notification_data[id].foreign_id = foreign_id;
        notification_data[id].actor = requiredActor;
        notification_data[id].time = time;

        participantOneData = await userService.getBasicInfo(participant_one);
        participantTwoData = await userService.getBasicInfo(participant_two); // events = (await eventService.getEventById(foreign_id)) || {};
        users = await userService.getBasicInfo(requiredActor);
        return {
          notification_data,
          events: { [foreign_id]: { ...events, id: foreign_id } },
          users: {
            [requiredActor]: { basicInfo: users },
            [participant_one]: { basicInfo: participantOneData },
            [participant_two]: { basicInfo: participantTwoData }
          }
        };

      case REMINDER_DELETE_ALL:
        notification_data[id] = {};
        notification_data[id].is_read = is_read;
        notification_data[id].notification_id = id;
        notification_data[id].type = REMINDER;
        notification_data[id].stage = NOTIFICATION_STAGES.DELETE;
        notification_data[id].foreign_id = foreign_id;
        notification_data[id].actor = requiredActor;
        notification_data[id].time = time;

        participantOneData = await userService.getBasicInfo(participant_one);
        participantTwoData = await userService.getBasicInfo(participant_two); // events = (await eventService.getEventById(foreign_id)) || {};
        users = await userService.getBasicInfo(requiredActor);
        return {
          notification_data,
          events: { [foreign_id]: { ...events, id: foreign_id } },
          users: {
            [requiredActor]: { basicInfo: users },
            [participant_one]: { basicInfo: participantOneData },
            [participant_two]: { basicInfo: participantTwoData }
          }
        };

      case MEDICATION_REMINDER_CREATE:
        notification_data[id] = {};
        notification_data[id].is_read = is_read;
        notification_data[id].notification_id = id;
        notification_data[id].type = MEDICATION_REMINDER;
        notification_data[id].stage = NOTIFICATION_STAGES.CREATE;
        notification_data[id].actor = requiredActor;
        notification_data[id].foreign_id = foreign_id;
        notification_data[id].time = time;

        participantOneData = await userService.getBasicInfo(participant_one);
        participantTwoData = await userService.getBasicInfo(participant_two); // events = (await eventService.getEventById(foreign_id)) || {};
        users = await userService.getBasicInfo(requiredActor);
        let { details: { medicine } = {} } = events;
        products = await productService.getProduct({ _id: medicine });
        return {
          notification_data,
          events: { [foreign_id]: { ...events, id: foreign_id } },
          users: {
            [requiredActor]: { basicInfo: users },
            [participant_one]: { basicInfo: participantOneData },
            [participant_two]: { basicInfo: participantTwoData }
          },
          products: { [medicine]: { ...products } }
        };

      case MEDICATION_REMINDER_START:
        notification_data[id] = {};
        notification_data[id].is_read = is_read;
        notification_data[id].notification_id = id;
        notification_data[id].type = MEDICATION_REMINDER;
        notification_data[id].stage = NOTIFICATION_STAGES.START;
        notification_data[id].foreign_id = foreign_id;
        notification_data[id].time = time;
        notification_data[id].startTime = startTime;

        participantOneData = await userService.getBasicInfo(participant_one);
        participantTwoData = await userService.getBasicInfo(participant_two); // events = (await eventService.getEventById(foreign_id)) || {};

        const { status, startTime } = events || {};
        const now = new Date();
        const eventStartTime = new Date(startTime);
        const diff = eventStartTime.getTime() - now.getTime();

        const duration = moment().diff(startTime, "hours", true);
        let medicationReminderIds = [];
        if (status === "active" && duration > 0 && duration < 0.0833) {
          medicationReminderIds.push(foreign_id);
        }

        const mremreqUser =
          object === participant_one ? participant_two : participant_one;

        notification_data[id].actor = remreqUser;
        users = await userService.getBasicInfo(remreqUser);
        let { data: { medicine: product } = {} } = events || {};
        products = await productService.getProduct({ _id: product });
        return {
          notification_data,
          events: { [foreign_id]: { ...events, id: foreign_id } },
          users: {
            [mremreqUser]: { basicInfo: users },
            [participant_one]: { basicInfo: participantOneData },
            [participant_two]: { basicInfo: participantTwoData }
          },
          medicationReminderIds: medicationReminderIds,
          products: { [product]: { ...products } }
        };

      case ADVERSE_EVENT_CREATE:
        notification_data[id] = {};
        notification_data[id].is_read = is_read;
        notification_data[id].notification_id = id;
        notification_data[id].type = ADVERSE_EVENT;
        notification_data[id].stage = NOTIFICATION_STAGES.CREATE;
        notification_data[id].foreign_id = foreign_id;
        notification_data[id].actor = actor;
        notification_data[id].time = time;
        // events = (await eventService.getEventById(foreign_id)) || {};
        users = await userService.getBasicInfo(actor);
        return {
          notification_data,
          events: { [foreign_id]: { ...events, id: foreign_id } },
          users: { [actor]: { basicInfo: users } }
        };
      case SURVEY_CREATE:
        notification_data[id] = {};
        notification_data[id].is_read = is_read;
        notification_data[id].notification_id = id;
        notification_data[id].type = SURVEY_VERB;
        notification_data[id].stage = NOTIFICATION_STAGES.CREATE;
        notification_data[id].foreign_id = foreign_id;
        notification_data[id].actor = actor;
        notification_data[id].time = time;
        surveys = await SURVEY({ surveyId: foreign_id }).getOne();
        users = await userService.getBasicInfo(actor);
        return {
          notification_data,
          surveys: { [foreign_id]: surveys },
          users: { [actor]: { basicInfo: users } }
        };

      case ARTICLE_SHARE:
        notification_data[id] = {};
        notification_data[id].is_read = is_read;
        notification_data[id].notification_id = id;
        notification_data[id].type = ARTICLE;
        notification_data[id].stage = NOTIFICATION_STAGES.SHARE;
        notification_data[id].foreign_id = foreign_id;
        notification_data[id].actor = actor;
        notification_data[id].time = time;
        articles = await articleService.getArticleByArticleId(foreign_id);
        users = await userService.getBasicInfo(actor);
        return {
          notification_data,
          articles: { [foreign_id]: articles[0] },
          users: { [actor]: { basicInfo: users } }
        };

      case VITALS_UPDATE:
        notification_data[id] = {};
        notification_data[id].is_read = is_read;
        notification_data[id].notification_id = id;
        notification_data[id].type = VITALS;
        notification_data[id].stage = NOTIFICATION_STAGES.UPDATE;
        notification_data[id].foreign_id = foreign_id;
        notification_data[id].actor = actor;
        notification_data[id].time = time;

        users = await userService.getBasicInfo(actor);
        return {
          notification_data,
          users: { [actor]: { basicInfo: users } }
        };

      case BASIC_UPDATE:
        notification_data[id] = {};
        notification_data[id].is_read = is_read;
        notification_data[id].notification_id = id;
        notification_data[id].type = BASIC;
        notification_data[id].stage = NOTIFICATION_STAGES.UPDATE;
        notification_data[id].foreign_id = foreign_id;
        notification_data[id].actor = actor;
        notification_data[id].time = time;

        users = await userService.getBasicInfo(actor);
        return {
          notification_data,
          users: { [actor]: { basicInfo: users } }
        };

      case CLINICAL_READING_CREATE:
        notification_data[id] = {};
        notification_data[id].is_read = is_read;
        notification_data[id].notification_id = id;
        notification_data[id].type = CLINICAL_READING;
        notification_data[id].stage = NOTIFICATION_STAGES.CREATE;
        notification_data[id].foreign_id = foreign_id;
        notification_data[id].actor = actor;
        notification_data[id].time = time;

        users = await userService.getBasicInfo(actor);
        return {
          notification_data,
          users: { [actor]: { basicInfo: users } }
        };

      case CLINICAL_READING_UPDATE:
        notification_data[id] = {};
        notification_data[id].is_read = is_read;
        notification_data[id].notification_id = id;
        notification_data[id].type = CLINICAL_READING;
        notification_data[id].stage = NOTIFICATION_STAGES.UPDATE;
        notification_data[id].foreign_id = foreign_id;
        notification_data[id].actor = actor;
        notification_data[id].time = time;

        users = await userService.getBasicInfo(actor);
        return {
          notification_data,
          users: { [actor]: { basicInfo: users } }
        };

      case CLINICAL_READING_DELETE:
        notification_data[id] = {};
        notification_data[id].is_read = is_read;
        notification_data[id].notification_id = id;
        notification_data[id].type = CLINICAL_READING;
        notification_data[id].stage = NOTIFICATION_STAGES.DELETE;
        notification_data[id].foreign_id = foreign_id;
        notification_data[id].actor = actor;
        notification_data[id].time = time;

        users = await userService.getBasicInfo(actor);
        return {
          notification_data,
          users: { [actor]: { basicInfo: users } }
        };

      case MEDICATION_CREATE:
        notification_data[id] = {};
        notification_data[id].is_read = is_read;
        notification_data[id].notification_id = id;
        notification_data[id].type = MEDICATION;
        notification_data[id].stage = NOTIFICATION_STAGES.CREATE;
        notification_data[id].foreign_id = foreign_id;
        notification_data[id].actor = actor;
        notification_data[id].time = time;

        users = await userService.getBasicInfo(actor);
        return {
          notification_data,
          users: { [actor]: { basicInfo: users } }
        };

      case MEDICATION_UPDATE:
        notification_data[id] = {};
        notification_data[id].is_read = is_read;
        notification_data[id].notification_id = id;
        notification_data[id].type = MEDICATION;
        notification_data[id].stage = NOTIFICATION_STAGES.UPDATE;
        notification_data[id].foreign_id = foreign_id;
        notification_data[id].actor = actor;
        notification_data[id].time = time;

        users = await userService.getBasicInfo(actor);
        return {
          notification_data,
          users: { [actor]: { basicInfo: users } }
        };

      case MEDICATION_DELETE:
        notification_data[id] = {};
        notification_data[id].is_read = is_read;
        notification_data[id].notification_id = id;
        notification_data[id].type = MEDICATION;
        notification_data[id].stage = NOTIFICATION_STAGES.DELETE;
        notification_data[id].foreign_id = foreign_id;
        notification_data[id].actor = actor;
        notification_data[id].time = time;

        users = await userService.getBasicInfo(actor);
        return {
          notification_data,
          users: { [actor]: { basicInfo: users } }
        };

      case HOSPITALISATION_CREATE:
        notification_data[id] = {};
        notification_data[id].is_read = is_read;
        notification_data[id].notification_id = id;
        notification_data[id].type = HOSPITALISATION;
        notification_data[id].stage = NOTIFICATION_STAGES.CREATE;
        notification_data[id].foreign_id = foreign_id;
        notification_data[id].actor = actor;
        notification_data[id].time = time;

        users = await userService.getBasicInfo(actor);

        return {
          notification_data,
          users: { [actor]: { basicInfo: users } }
        };

      case BENEFIT_DOCS_VERIFIED:
        notification_data[id] = {};
        notification_data[id].is_read = is_read;
        notification_data[id].notification_id = id;
        notification_data[id].type = BENEFIT_DOCS_VERIFIED;
        notification_data[id].stage = NOTIFICATION_STAGES.APPROVED;
        notification_data[id].foreign_id = foreign_id;
        notification_data[id].actor = actor;
        notification_data[id].time = time;

        users = await userService.getBasicInfo(actor);
        let benefitPlan = {};
        const benefitDocplan = await benefitPlanService.getBenefitPlanById(
          foreign_id
        );
        const BenefitDispensationData = await dispensationService.getdispensationForBenefitIds(
          [foreign_id]
        );

        benefitPlan[foreign_id] = { ...benefitDocplan };
        benefitPlan[foreign_id].dispensation = [];

        let BenefitDispensation = {};
        let BenefitContributionRequests = {};
        let BenefitCharity = {};
        if (BenefitDispensationData) {
          for (const data of BenefitDispensationData) {
            const { _id, benefitId: cycleBenefitId, contributionsId } = data;
            benefitPlan[cycleBenefitId].dispensation.push(_id);
            BenefitDispensation[_id] = { ...data };
            const contribution = await contributionService.getContributionById(
              contributionsId
            );

            // console.log(
            //   "BenefitBenefitDispensationData-------------- :",
            //   contribution
            // );
            if (contribution) {
              BenefitDispensation[_id].contribution = { ...contribution };
              const { CharityApplied = [] } = contribution;
              for (const id of CharityApplied) {
                const charityAppliedData = await charityAppliedservice.getContributionRequest(
                  id
                );
                BenefitContributionRequests[id] = charityAppliedData;
                const { charityId } = charityAppliedData;
                const charityData = await charityService.getCharityById(
                  charityId
                );
                BenefitCharity[charityId] = charityData;
              }
            }
          }
        }
        return {
          notification_data,
          users: { [actor]: { basicInfo: users } },
          benefitPlan,
          dispensation: BenefitDispensation,
          charity: BenefitCharity,
          contributionRequests: BenefitContributionRequests
        };

      case CHARITY_APPROVAL:
        notification_data[id] = {};
        notification_data[id].is_read = is_read;
        notification_data[id].notification_id = id;
        notification_data[id].type = CHARITY_APPROVAL;
        notification_data[id].stage = NOTIFICATION_STAGES.APPROVED;
        notification_data[id].foreign_id = foreign_id;
        notification_data[id].actor = actor;
        notification_data[id].time = time;

        users = await userService.getBasicInfo(actor);
        let CharityBenefitPlan = {};
        const charityAppliedData = await charityAppliedservice.getContributionRequest(
          foreign_id
        );
        const { benefitPlanId } = charityAppliedData || {};
        const charityApproveplan = await benefitPlanService.getBenefitPlanById(
          benefitPlanId
        );
        const CharityDispensationData = await dispensationService.getdispensationForBenefitIds(
          [benefitPlanId]
        );

        CharityBenefitPlan[benefitPlanId] = { ...charityApproveplan };
        CharityBenefitPlan[benefitPlanId].dispensation = [];

        let CharityApprovedispensation = {};
        let CharityApprovecontributionRequests = {};
        let CharityApprovecharity = {};
        if (CharityDispensationData) {
          for (const data of CharityDispensationData) {
            const { _id, benefitId: cycleBenefitId, contributionsId } = data;
            CharityBenefitPlan[cycleBenefitId].dispensation.push(_id);
            CharityApprovedispensation[_id] = { ...data };
            const contribution = await contributionService.getContributionById(
              contributionsId
            );

            // console.log(
            //   "CharityDispensationData-------------- :",
            //   contribution
            // );
            if (contribution) {
              CharityApprovedispensation[_id].contribution = {
                ...contribution
              };
              const { CharityApplied = [] } = contribution;
              for (const id of CharityApplied) {
                const charityAppliedData = await charityAppliedservice.getContributionRequest(
                  id
                );
                CharityApprovecontributionRequests[id] = charityAppliedData;
                const { charityId } = charityAppliedData;
                const charityData = await charityService.getCharityById(
                  charityId
                );
                CharityApprovecharity[charityId] = charityData;
              }
            }
          }
        }
        return {
          notification_data,
          users: { [actor]: { basicInfo: users } },
          benefitPlan: CharityBenefitPlan,
          dispensation: CharityApprovedispensation,
          charity: CharityApprovecharity,
          contributionRequests: CharityApprovecontributionRequests
        };

      case MRL_GENERATION:
        notification_data[id] = {};
        notification_data[id].is_read = is_read;
        notification_data[id].notification_id = id;
        notification_data[id].type = MRL_GENERATION;
        notification_data[id].stage = NOTIFICATION_STAGES.APPROVED;
        notification_data[id].foreign_id = foreign_id;
        notification_data[id].actor = actor;
        notification_data[id].time = time;

        users = await userService.getBasicInfo(actor);
        let MrlBenefitPlan = {};
        const mrlGeneratedFor = await dispensationService.getDispensationById(
          foreign_id
        );
        // console.log("mrlGeneratedFor-------------- :", mrlGeneratedFor);
        const { benefitId } = mrlGeneratedFor;
        const Mrlplan = await benefitPlanService.getBenefitPlanById(benefitId);
        const dispensationData = await dispensationService.getdispensationForBenefitIds(
          [benefitId]
        );

        MrlBenefitPlan[benefitId] = { ...Mrlplan };
        MrlBenefitPlan[benefitId].dispensation = [];

        let dispensation = {};
        let contributionRequests = {};
        let charity = {};
        if (dispensationData) {
          for (const data of dispensationData) {
            const { _id, benefitId: cycleBenefitId, contributionsId } = data;
            MrlBenefitPlan[cycleBenefitId].dispensation.push(_id);
            dispensation[_id] = { ...data };
            const contribution = await contributionService.getContributionById(
              contributionsId
            );

            // console.log(
            //   "dispensationData-------------- :",
            //   dispensationData,
            //   contribution
            // );
            if (contribution) {
              dispensation[_id].contribution = { ...contribution };
              const { CharityApplied = [] } = contribution;
              for (const id of CharityApplied) {
                const charityAppliedData = await charityAppliedservice.getContributionRequest(
                  id
                );
                contributionRequests[id] = charityAppliedData;
                const { charityId } = charityAppliedData;
                const charityData = await charityService.getCharityById(
                  charityId
                );
                charity[charityId] = charityData;
              }
            }
          }
        }
        return {
          notification_data,
          users: { [actor]: { basicInfo: users } },
          benefitPlan: MrlBenefitPlan,
          dispensation,
          charity,
          contributionRequests
        };

      default:
        return {};
    }
  } catch (err) {
    console.log("err--------------------------------->", err.message);
    throw err;
  }
};
