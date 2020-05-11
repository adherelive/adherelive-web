import isEmpty from "lodash/isEmpty";
import eventService from "../../services/event/event.service";
import schedulerService from "../../services/scheduler/scheduler.service";
import userService from "../../services/user/user.service";
import articleService from "../../services/article/article.service";
import medicalConditiionService from "../../services/medicalCondition/medicalCondition.service";
import productService from "../../services/product/product.service";
import hospitalizationService from "../../services/hospitalization/hospitalization.service";
import { SURVEY } from "../../surveySdk";
import UserDevices from "../../models/userDevices";

const { NOTIFICATION_VERB, NOTIFICATION_URLS } = require("../../../constant");

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
  HOSPITALISATION_CREATE
} = NOTIFICATION_VERB;

class OneSignalNotification {
  sendNotification = data => {
    const headers = {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: "Basic MGMzYzgyM2ItNDc4NS00NDNjLWJjMjYtNzI0Y2Y2YzEwODkz"
    };

    const options = {
      host: "onesignal.com",
      port: 443,
      path: "/api/v1/notifications",
      method: "POST",
      headers: headers
    };
    console.log("---- 22222222222 ----");

    const https = require("https");
    const req = https.request(options, function(res) {
      res.on("data", function(data) {
        console.log("Response:");
        console.log(JSON.parse(data));
      });
    });

    req.on("error", function(e) {
      console.log("ERROR:");
      console.log(e);
    });

    req.write(JSON.stringify(data));
    req.end();
  };

  getHeadingAndContent = async ({ actor, verb, foreign_id, loggedInUser }) => {
    var events = {};
    let user = {};
    // let surveys = {};
    // let articles = {};
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
      let events = (await eventService.getEventById(foreign_id)) || {};
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
    let reminder_title = "";
    if (events && events.data) {
      const { data: { title } = {} } = events;
      reminder_title = title;
    } else if (events && events.details) {
      const { details: { title } = {} } = events;
      reminder_title = title;
    }

    user = await userService.getBasicInfo(requiredActor);

    const { name, category } = user;
    let heading = "";
    let content = "";
    let url = "";
    let params = "";

    switch (verb) {
      // as invitee to the program as doctor or carecoach
      case APPOINTMENT_CREATE:
        heading = "Appointment Created";
        content = `${name}(${category}) created a appointment with you`;
        url = NOTIFICATION_URLS.EVENTS;
        return { content, heading, url };

      case APPOINTMENT_START:
        heading = "Appointment Started";
        content = `Appointment with ${name}(${category}) started`;
        url = NOTIFICATION_URLS.EVENTS;
        return { content, heading, url };

      case APPOINTMENT_UPDATE:
        heading = "Appointment Updated";
        content = `Appointment with ${name}(${category}) updated`;
        url = NOTIFICATION_URLS.EVENTS;
        return { content, heading, url };

      case APPOINTMENT_EDIT_NOTES:
        heading = "Appointment Notes Edited";
        content = `Appointment with ${name}(${category})'s  note updated`;
        url = NOTIFICATION_URLS.EVENTS;
        return { content, heading, url };

      case APPOINTMENT_PRIOR:
        heading = "Appointment About to start";
        content = `Appointment with ${name}(${category}) is about to start`;
        url = NOTIFICATION_URLS.EVENTS;
        return { content, heading, url };

      case APPOINTMENT_DELETE:
        heading = "Appointment Deleted";
        content = `Appointment with ${name}(${category}) deleted`;
        url = NOTIFICATION_URLS.EVENTS;
        return { content, heading, url };

      case APPOINTMENT_DELETE_ALL:
        heading = "Appointment Deleted";
        content = `Appointment with ${name}(${category}) deleted`;
        url = NOTIFICATION_URLS.EVENTS;
        return { content, heading, url };

      case REMINDER_CREATE:
        heading = "Reminder Created";
        content = `${name}(${category}) created a reminder`;
        url = NOTIFICATION_URLS.EVENTS;
        return { content, heading, url };

      case REMINDER_START:
        heading = "Reminder Started";
        content = `Its time for ${reminder_title}`;
        url = NOTIFICATION_URLS.EVENTS;
        return { content, heading, url };
      case REMINDER_UPDATE:
        heading = "Reminder Updated";
        content = ` Reminder ${reminder_title} is updated`;
        url = NOTIFICATION_URLS.EVENTS;
        return { content, heading, url };
      case REMINDER_EDIT_NOTES:
        heading = "Reminder Noted Edited";
        content = ` Reminder ${reminder_title} is updated`;
        url = NOTIFICATION_URLS.EVENTS;
        return { content, heading, url };

      case REMINDER_DELETE:
        heading = "Reminder Delete";
        content = ` Reminder ${reminder_title} is deleted`;
        url = NOTIFICATION_URLS.EVENTS;
        return { content, heading, url };

      case REMINDER_DELETE_ALL:
        heading = "Reminder Deleted";
        content = ` Reminder ${reminder_title} is deleted`;
        url = NOTIFICATION_URLS.EVENTS;
        return { content, heading, url };

      case MEDICATION_REMINDER_CREATE:
        heading = "Medication Reminder Created";
        content = `${name}(${category}) created a medication reminder`;
        url = NOTIFICATION_URLS.EVENTS;
        return { content, heading, url };

      case MEDICATION_REMINDER_START:
        const { medicine, quantity, strength, unit, whenToTake } = events;
        const productData = await productService.getProduct({ _id: medicine });
        const { name: productName } = productData || {};
        heading = "Medication Reminder Created";
        content = `It's time for ${productName} ${strength}${unit}`;
        url = NOTIFICATION_URLS.EVENTS;
        return { content, heading, url };

      case ADVERSE_EVENT_CREATE:
        heading = "Adverse Event Created";
        content = `${name}(${category}) created an adverse event `;
        url = NOTIFICATION_URLS.ADVERSE_EVENT;
        params = { category, id: actor };
        return { content, heading, url, params };

      case SURVEY_CREATE:
        heading = "Survey Created";
        content = `${name}(${category}) created a survey `;
        url = NOTIFICATION_URLS.SURVEY;
        params = { surveyId: foreign_id };
        return { content, heading, url, params };

      case ARTICLE_SHARE:
        heading = "Article Shared";
        content = `${name}(${category}) shared an article `;
        url = NOTIFICATION_URLS.ARTICLE;
        params = { articleId: foreign_id };
        return { content, heading, url, params };

      case VITALS_UPDATE:
        heading = "Vital Updated";
        content = `${name}(${category}) updated Vital `;
        url = NOTIFICATION_URLS.VITAL;
        params = { category, id: actor };
        return { content, heading, url, params };

      case BASIC_UPDATE:
        heading = "Basic Updated";
        content = `${name}(${category}) updated basic `;
        url = NOTIFICATION_URLS.BASIC;
        params = { category, id: actor };
        return { content, heading, url, params };

      case CLINICAL_READING_CREATE:
        heading = "Clinical Reading Added";
        content = `${name}(${category}) added a clinical reading `;
        url = NOTIFICATION_URLS.CLINICAL_READING;
        params = { category, id: actor };
        return { content, heading, url, params };

      case CLINICAL_READING_UPDATE:
        heading = "Clinical Reading updated";
        content = `${name}(${category}) updated a clinical reading `;
        url = NOTIFICATION_URLS.CLINICAL_READING;
        params = { category, id: actor };
        return { content, heading, url, params };

      case CLINICAL_READING_DELETE:
        heading = "Clinical Reading deleted";
        content = `${name}(${category}) deleted clinical reading `;
        url = NOTIFICATION_URLS.CLINICAL_READING;
        params = { category, id: actor };
        return { content, heading, url, params };

      case MEDICATION_CREATE:
        heading = "Medication Created";
        content = `${name}(${category}) created a medication `;
        url = NOTIFICATION_URLS.MEDICATION;
        params = { category, id: actor };
        return { content, heading, url, params };

      case MEDICATION_UPDATE:
        heading = "Medication Updated";
        content = `${name}(${category}) updated a medication `;
        url = NOTIFICATION_URLS.MEDICATION;
        params = { category, id: actor };
        return { content, heading, url, params };

      case MEDICATION_DELETE:
        heading = "Medication Deleted";
        content = `${name}(${category}) deleted a medication `;
        url = NOTIFICATION_URLS.MEDICATION;
        params = { category, id: actor };
        return { content, heading, url, params };

      case HOSPITALISATION_CREATE:
        heading = "Hospitalisation created";
        content = `${name}(${category}) reported a hospitalisation `;
        url = NOTIFICATION_URLS.HOSPITALIZATION;
        params = { category, id: actor };
        return { content, heading, url, params };
      default:
        return null;
    }
  };

  getMessage = async data => {
    const { buildPayload = {}, loggedInUser } = data;
    const { object, foreign_id, verb, actor } = buildPayload;
    const userDevice = await UserDevices.find({ user_id: object });
    console.log("userDevice---------------- :", userDevice);

    if (userDevice && userDevice.length > 0) {
      let userIds = [];
      for (const device of userDevice) {
        const { one_signal_user_id } = device;
        if (one_signal_user_id) {
          userIds.push(one_signal_user_id);
        }
      }

      let messageData = await this.getHeadingAndContent({
        actor,
        verb,
        foreign_id,
        loggedInUser
      });
      const {
        content = null,
        heading = null,
        url = null,
        params = buildPayload
      } = messageData;
      console.log("messageData--------------------- :", userIds, messageData);
      if (messageData) {
        return {
          app_id: "53232455-b33a-4dba-92ab-fd434c93357b",
          headings: { en: heading, he: "Hebrew Message" },
          contents: { en: content, he: "Hebrew Message" },
          // buttons: [{ id: "yes", text: "Yes" }, { id: "no", text: "No" }],
          include_player_ids: userIds,
          priority: 10,
          data: { url: url, params: params }
        };
      } else {
        return {};
      }
    }
  };

  sendPushNotification = async data => {
    const message = await this.getMessage(data);
    console.log("message ----", message);
    if (message) {
      this.sendNotification(message);
    }
  };
}

module.exports = new OneSignalNotification();
