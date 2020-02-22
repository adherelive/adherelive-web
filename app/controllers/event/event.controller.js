import generateUniversalLink from "../../../helper/universal_link";

const eventService = require("../../services/event/event.service");
const userService = require("../../services/user/user.service");
const programService = require("../../services/program/program.service");
const productService = require("../../services/product/product.service");
const medicationService = require("../../services/medication/medication.service");
const medicalConditionService = require("../../services/medicalCondition/medicalCondition.service");
const { addUserInProgramOnSignUp } = require("../user/userControllerHelper");
import scheduleService from "../../services/scheduler/scheduler.service";
const { validationResult } = require("express-validator/check");
const uuid = require("uuid/v4");
const Response = require("../../helper/responseFormat");
const Log = require("../../../libs/log")("eventController");
const emailManager = require("../../../app/communications/email/emailManger");
const smsManager = require("../../../app/communications/sms/smsManger");
//const rbac = require("../../helper/rbac");
const rbac = require("../../../routes/api/middleware/rbac");
const millisInADay = 86400000;
const errMessages = require("../../../config/messages.json").errMessages;
const userCategories = require("../../../config/messages.json").userCategories;
const constants = require("../../../config/constants");
const { Proxy_Sdk, EVENTS } = require("../../proxySdk");
const { ActivitySdk, STAGES } = require("../../activitySdk");
const SHA256 = require("crypto-js/sha256");
import { EVENT_TYPE, USER_CATEGORY } from "../../../constant";
import { PERMISSIONS, RESOURCE } from "../../../constant";
import isEmpty from "lodash/isEmpty";
import { getCurrrentWeekReminderByDate } from "./helper";
import {
  getEncryptedValue,
  getAllEncryptedValues,
  getDecryptedValue
} from "../../services/user/helper";
import _ from "lodash";

class EventController {
  constructor() {}

  /**
   * @api {POST} /invite Creates a invitation event
   * @apiName invite
   * @apiGroup Events
   * @apiVersion 1.0.0
   *
   *
   * @apiSuccess (200) {json} Status Status of the event
   *
   * @apiParam {String} email Email of the user.
   * @apiParam {ContactObject} [contactNo] Contact details of the user
   * @apiParam {String} contactNo.countryCode Country Code of the user
   * @apiParam {String} contactNo.phoneNumber Phone number of the user
   * @apiParam {String} userCategory Category of the invitee
   * @apiParam {ObjectId[]} [programId] Id of the program
   * @apiParam {String} [name] Name of the invitee
   * @apiParam {String} [organizationName] Name of the organization of the invitee
   * @apiParam {String} [speciality] Speciality of the invitee
   * @apiParam {String} [licenseNumber] License number of the invitee
   *
   * @apiParamExample {json} Request-Example:
   * {
   *  "email": "maxlife@email.com",
   *  "contactNo": {
   *    "countryCode": "+91",
   *    "phoneNumber": 9122110019
   *  },
   *  "userCategory": "doctor",
   *  "programId": 1
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *    "status": true,
   *    "statusCode": 200,
   *    "payload": {
   *        "data": {
   *           "status": "pending",
   *           "_id": "5c011e2d2217692a513134cc"
   *        },
   *        "message": "Invite sent."
   *     }
   * }
   *
   * @apiErrorExample {json} Error-Response:
   * {
   *    "status": false,
   *    "statusCode": 500,
   *    "payload": {
   *        "error": {
   *           "status": "INVITE_NOT_SENT",
   *           "message": "Your invite was not sent."
   *        }
   *    }
   * }
   *
   */
  async invite(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let response = new Response(false, 422);
      response.setError(errors.mapped());
      return res.status(422).json(response.getResponse());
    }

    try {
      let {
        email,
        contactNo,
        userCategory,
        programId,
        name,
        organizationName,
        speciality,
        licenseNumber,
        country,
        dob,
        gender,
        city,
        doctor,
        hospital,
        pharmacy
      } = req.body;

      let userName = email.split("@")[0];
      email = email.toLowerCase();
      const loginEmail = SHA256(email.toLowerCase()).toString();
      const isContactProvided =
        contactNo.countryCode && contactNo.phoneNumber ? true : false;

      const can = await rbac.can(
        req.userDetails.userData.category,
        PERMISSIONS.INVITE,
        RESOURCE.PROGRAMS
      );
      if (!can) {
        throw new Error(constants.INVITE_NOT_PERMISSIBLE);
      }

      const { userId } = req.userDetails;

      let inviteeEmailIdExist = await userService.getUser({ loginEmail }); //checking if email id already exist

      if (inviteeEmailIdExist) {
        throw new Error(constants.EXISTING_EMAIL_ID);
      }
      let hashContactNo;
      if (isContactProvided) {
        const contactNoString = contactNo.countryCode + contactNo.phoneNumber;
        hashContactNo = SHA256(contactNoString).toString();
        let inviteeNumberExist = await userService.getUser({ hashContactNo }); // Check if provided phone number already exist

        if (inviteeNumberExist) {
          throw new Error(constants.EXISTING_PHONE_NO);
        }
      }

      // let inviteeNumberExist = false;
      // if (!isEmpty(contactNo)) {
      //   const { countryCode, phoneNumber } = contactNo;
      //   inviteeNumberExist = await userService.getUser({
      //     "contactNo.phoneNumber": phoneNumber,
      //     "contactNo.countryCode": countryCode
      //   });
      // }

      let link = uuid(); // create unique link

      let eventData = {};

      // Fetch Inviter
      let inviter = await userService.getUser({
        _id: req.userDetails.userId
      });

      let data;
      let hospitalId, doctorId;
      const inactiveUserStatus = "INACTIVE";
      const enrolledUserStatus = "ENROLLED";

      if (userCategory == "patient") {
        // if (name && name.length > 0) {
        //   name = getEncryptedValue(name);
        // }
        let fieldsToEncrypt = { name, email };
        if (!_.isEmpty(contactNo)) {
          fieldsToEncrypt = { ...fieldsToEncrypt, contactNo };
        }
        let encryptedValues = getAllEncryptedValues(fieldsToEncrypt);
        const {
          name: encryptedName,
          email: encryptedEmail,
          contactNo: encryptedContactNo
        } = encryptedValues;

        eventData = {
          participantOne: req.userDetails.userId,
          eventCategory: "invitation",
          details: {
            userCategory,
            email: encryptedEmail,
            contactNo: encryptedContactNo,
            programId,
            name: encryptedName,
            country,
            dob,
            gender,
            city,
            doctor,
            hospital,
            pharmacy
          },
          link
          // endDate: new Date(
          //   Date.now() + process.config.INVITE_EXPIRE_TIME * millisInADay
          // )
        };

        hospitalId = hospital || "";
        doctorId = doctor || "";
        let totalPatientsInProgram = await userService.getTotalPatientsInProgram(
          programId
        );
        const program = await programService.getProgram({
          _id: programId
        });
        const { programCode } = program;
        const year = new Date().getFullYear();
        data = {
          email: encryptedEmail,
          category: userCategory,
          loginEmail,
          programId,
          name: encryptedName,
          dob: dob || "",
          contactNo: encryptedContactNo,
          gender: gender || undefined,
          status: inactiveUserStatus,
          pharmacy: pharmacy ? pharmacy : undefined,
          code: programCode + "-" + year + "-" + (totalPatientsInProgram + 1),
          //WILL RUN AFTER ADDING COUNTRY SEEDERS ONLY
          homeAddress: country
            ? {
                country: country,
                city: city ? city : undefined
              }
            : undefined
        };
        if (hashContactNo) {
          data = Object.assign(data, { hashContactNo });
        }
      } else {
        eventData = {
          participantOne: req.userDetails.userId,
          eventCategory: "invitation",
          details: {
            userCategory,
            email,
            contactNo,
            programId,
            name,
            country,
            licenseNumber,
            speciality,
            city,
            hospital
          },
          link
          // endTime: new Date(
          //   Date.now() + process.config.INVITE_EXPIRE_TIME * millisInADay
          // )
        };
        data = {
          email,
          category: userCategory,
          programId,
          loginEmail,
          name: name || "",
          contactNo: contactNo || "",
          status: enrolledUserStatus,
          work: {
            licenseNumber: licenseNumber || "",
            speciality: speciality || undefined,
            officeAddress: country
              ? {
                  country,
                  city: city ? city : undefined
                }
              : undefined
          },
          //WILL RUN AFTER ADDING COUNTRY SEEDERS ONLY
          // homeAddress: event.details.country
          //   ? {
          //       country: event.details.country,
          //       city: event.details.city ? event.details.city : undefined
          //     }
          //   : undefined,
          visitingHospitals: hospital ? hospital : undefined
        };
        if (hashContactNo) {
          data = Object.assign(data, { hashContactNo });
        }
      }
      const user = await userService.addUser(data);

      const { _id, category } = inviter;
      if (programId != null && programId != undefined && programId.length > 0) {
        addUserInProgramOnSignUp({
          inviter: {
            id: _id,
            category: category
          },
          invitee: {
            id: user._id,
            category: user.category
          },
          programId,
          programService,
          hospitalId,
          doctorId
        });
      }

      if (user.category == "patient") {
        const medicalCondition = await medicalConditionService.createUserMedicalData(
          user._id
        );

        const medication = await medicationService.addMedication({
          userId: user._id,
          medicine: {}
        });
      }

      eventData["participantTwo"] = user._id;
      let resp = await eventService.addEvent(eventData);

      // Add user

      // send invitation link
      let templateData = new Object();
      templateData.userName = userName;
      templateData.host = process.config.S3_BUCKET_URL;
      templateData.inviteCard =
        process.config.S3_BUCKET_URL + "/placeholder_image.png";
      templateData.link = await generateUniversalLink(eventData);
      // if (inviteeEmailIdExist || inviteeNumberExist) {
      // if (programId == null || programId == undefined) {
      //   throw new Error(constants.EXISTING_USER);
      // }
      // templateData.link = process.config.APP_URL + "/accept-invite/" + link;
      // throw new Error(constants.EXISTING_USER);
      //} else {
      // templateData.link = process.config.APP_URL + "/sign-up/" + link;
      //}

      let inviterCategory = req.userDetails.userData.category;

      if (programId != null || programId != undefined) {
        let program = await programService.getProgram({
          _id: programId
        });
        templateData.mainBodyText = `${
          userCategories[inviterCategory]
        } Ms. Jasmin has invited you to collaborate on a program for <strong>${
          program.pharmaCo
        }</strong> titled <strong>${
          program.name
        }</strong> to observe the <strong>${
          program.targetLocation.city
        }</strong> region patients`;

        templateData.subBodyText = `The Program commences from <strong>${new Date(
          program.activeFrom
        ).toDateString()}</strong> and ends on <strong>${new Date(
          program.expiresOn
        ).toDateString()}</strong>.`;

        templateData.buttonText = "Join the Program";
      } else {
        templateData.mainBodyText = `${
          userCategories[inviterCategory]
        } Ms. Jasmin has invited you to come onboard to collaborate on programs for mutliple Pharma companies primarily to observe patients of different regions.`;

        templateData.subBodyText = `The Program commencement date will be mailed soon.`;
        templateData.buttonText = "Accept the Invitation";
      }

      let emailPayload = {
        toAddress: email,
        title:
          "Jasmin has invited you to collaborate on a Program using RPM web application",
        templateData: templateData,
        templateName: "invite"
      };

      const emailResponse = await Proxy_Sdk.execute(EVENTS.SEND_EMAIL, {
        ...emailPayload,
        programId: programId,
        loggedInUserId: userId
      });

      // send msg if we have number

      // let smsLink = process.config.APP_URL + "/sign-up/" + link;
      // if (contactNo) {
      // 	let smsPayload = {
      // 		phonenumber: contactNo.countryCode + String(contactNo.phoneNumber),
      // 		sender: "rpm",
      // 		message: `Hi, join us on ${smsLink} .`
      // 	};
      // 	await smsManager.sendSms(smsPayload);
      // }
      // sms sending ends here
      let response = new Response(true, 200);
      response.setData({
        status: resp._doc.status,
        _id: resp._doc._id
      });
      let message;
      if (userCategory === USER_CATEGORY.PATIENT) {
        message =
          "New Patient enrolled to the program and invite sent successfully";
      } else if (userCategory === USER_CATEGORY.DOCTOR) {
        message =
          "New Doctor enrolled to the program and invite sent successfully";
      }

      response.setMessage(message);
      return res.status(response.getStatusCode()).send(response.getResponse());
    } catch (err) {
      let payload;
      Log.debug(err);
      switch (err.message) {
        case constants.INVITE_NOT_PERMISSIBLE:
          payload = {
            code: 403,
            error: errMessages.INVITE_NOT_PERMISSIBLE
          };
          break;

        case constants.EXISTING_PHONE_NO:
          payload = {
            code: 400,
            error: errMessages.EXISTING_PHONE_NO
          };
          break;
        case constants.EXISTING_EMAIL_ID:
          payload = {
            code: 400,
            error: errMessages.EXISTING_EMAIL_ID
          };
          break;

        default:
          payload = {
            code: 500,
            error: errMessages.INTERNAL_SERVER_ERROR
          };
          break;
      }

      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }
  /**
   * @api {POST} /validate Validates provided link
   * @apiName validateLink
   * @apiGroup Events
   * @apiVersion 1.0.0
   *
   *
   * @apiSuccess (200) {json} Validation Validation along with email
   *
   * @apiParam {String} link Unique key sent to the user in link.
   *
   * @apiParamExample {json} Request-Example:
   * {
   *    "link": "e716c149-761a-4250-b5d1-b5ea55e35774"
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *     "status": true,
   *     "statusCode": 200,
   *     "payload": {
   *        "data": {
   *             "email": "nikhil.prabhakar@tripock.com"
   *             "category": "doctor"
   *         },
   *        "message": "Your link is valid."
   *     }
   * }
   *
   * @apiErrorExample {json} Already-Used-Link-Response:
   * {
   *    "status": false,
   *    "statusCode": 403,
   *    "payload": {
   *        "error": {
   *           "status": "LINK_ALREADY_USED",
   *           "message": "Your link has been used. Same link can't be used twice."
   *        }
   *    }
   * }
   *
   * @apiErrorExample {json} Expired-Link-Response:
   * {
   *    "status": false,
   *    "statusCode": 410,
   *    "payload": {
   *        "error": {
   *           "status": "EVENT_EXPIRED",
   *           "message": "Your invite link has expired."
   *        }
   *    }
   * }
   *
   * @apiErrorExample {json} Cancelled-Event-Response:
   * {
   *    "status": false,
   *    "statusCode": 403,
   *    "payload": {
   *        "error": {
   *           "status": "EVENT_WAS_CANCELLED",
   *           "message": "Your had cancelled your invite previously, so it no longer exists. You may ask for a new invite."
   *        }
   *    }
   * }
   *
   * @apiErrorExample {json} Invalid-Link-Response:
   * {
   *    "status": false,
   *    "statusCode": 401,
   *    "payload": {
   *        "error": {
   *           "status": "INVALID_LINK",
   *           "message": "Your link is invalid."
   *        }
   *    }
   * }
   *
   * @apiErrorExample {json} Invalid-OR-Expired-Token-Response:
   * {
   *    "status": false,
   *    "statusCode": 500,
   *    "payload": {
   *        "error": {
   *           "status": "INTERNAL_SERVER_ERROR",
   *           "message": "Something went wrong. Please try again."
   *        }
   *    }
   * }
   */
  async validateLink(req, res) {
    const { link } = req.body;
    try {
      let result = await eventService.searchByField({ link: link });
      let response;
      if (result.length > 0) {
        // if (result[0].endDate < new Date(Date.now())) {
        //   await eventService.updateEvent(
        //     { link: link },
        //     { status: "expired", invitee: null }
        //   );
        //   throw new Error(constants.EVENT_EXPIRED);
        // }
        if (result[0].status == "completed") {
          throw new Error(constants.LINK_ALREADY_USED);
        } else if (result[0].status == "expired") {
          throw new Error(constants.EVENT_EXPIRED);
        } else if (result[0].status == "cancelled") {
          throw new Error(constants.EVENT_WAS_CANCELLED);
        } else {
          const userCategory = result[0].details.userCategory;
          let userEmail = result[0].details.email;
          if (userCategory === "patient") {
            userEmail = getDecryptedValue(userEmail);
          }
          response = new Response(true, 200);
          if (result[0].eventCategory == EVENT_TYPE.INVITATION) {
            response.setData({
              email: userEmail,
              category: userCategory
            });
          } else if (result[0].eventCategory === EVENT_TYPE.FORGOT_PASSWORD) {
            response.setData({
              email: userEmail
            });
          } else {
            response.setData({});
          }
          response.setMessage("Your link is valid.");
          return res.send(response.getResponse());
        }
      } else if (result.length == 0) {
        throw new Error(constants.EVENT_WAS_CANCELLED);
      }
    } catch (err) {
      let payload;

      switch (err.message) {
        case constants.LINK_ALREADY_USED:
          payload = {
            code: 403,
            error: errMessages.LINK_ALREADY_USED
          };
          break;

        case constants.EVENT_EXPIRED.status:
          payload = {
            code: 410,
            error: errMessages.EVENT_EXPIRED
          };
          break;

        case constants.EVENT_WAS_CANCELLED.status:
          payload = {
            code: 403,
            error: errMessages.EVENT_WAS_CANCELLED
          };
          break;

        case constants.INVALID_LINK.status:
          payload = {
            code: 401,
            error: errMessages.INVALID_LINK
          };
          break;

        default:
          payload = {
            code: 500,
            error: errMessages.INTERNAL_SERVER_ERROR
          };
          break;
      }

      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async getEvents() {
    const { userId, startDate, endDate } = req.body;
    //get events appointment,reminder,userId
  }

  async confirmEvent(req, res) {}
  async cancelEvent(req, res) {
    const { eventId } = req.params;
    const { recurr, scheduleEventId } = req.body;
    if (recurr) {
      //delete event as well as all schedule events
      //
    } else {
      //delete one this schedule event
    }
  }
  async completeEvent(req, res) {}
  async deleteEvent(req, res) {
    const { eventId } = req.params;
    const { recurr, scheduleEventId } = req.body;
    if (recurr) {
      //delete event as well as all schedule events
      //
    } else {
      //delete one this schedule event
    }
  }

  async updateEvent(req, res) {}

  //   const PATIENT = "patient";
  // const SEVERITY_FIELD = "severity";
  // const ON = "on";
  // const AT = "at";
  // const DESCRIPTION = "description";

  async createAdverseEvent(req, res) {
    try {
      const {
        patient,
        severity,
        on,
        at,
        description,
        docs = [],
        medications = []
      } = req.body;
      const eventData = {
        participantOne: req.userDetails.userId,
        participantTwo: patient,
        eventCategory: "adverse",
        details: {
          patient,
          severity,
          on,
          at,
          description,
          docs,
          medications
        }
      };
      const adverseEvent = await eventService.addEvent(eventData);

      const ex = adverseEvent.toObject();
      const value = { ...ex, userId: req.userDetails.userId };

      const result = ActivitySdk.execute({
        eventType: EVENT_TYPE.ADVERSE_EVENT,
        stage: STAGES.INIT,
        data: value
      });
      const response = new Response(true, 200);
      response.setMessage("Adverse event created successfully");
      return res.send(response.getResponse());
    } catch (err) {
      console.log("err(erorororor)----------->", err);
      const payload = {
        code: 500,
        error: errMessages.INTERNAL_SERVER_ERROR
      };
      const response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async getAdverseEvent(req, res) {
    try {
      const { userId } = req.params;
      const adverseEventData = await eventService.getAdverseEvent({
        userId: userId
      });
      let adverseEventList = [];
      let events = {};
      adverseEventData.forEach(value => {
        const {
          _id,
          participantOne,
          eventCategory,
          participantTwo,
          details,
          status
        } = value;
        adverseEventList.push(value._id);
        events = {
          ...events,
          [_id]: {
            _id,
            participantOne,
            participantTwo,
            eventCategory,
            details,
            status
          }
        };
      });
      const response = new Response(true, 200);
      const adverseEvent = {};
      adverseEvent[userId] = adverseEventList;
      response.setData({ adverseEvent: adverseEvent, events: events });
      res.send(response.getResponse());
    } catch (err) {
      const payload = {
        code: 500,
        error: errMessages.INTERNAL_SERVER_ERROR
      };
      const response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async getAppointmentAndReminders(req, res) {
    const { userId, startDate, endDate } = req.query;
    try {
      const { userData: { category } = {} } = req.userDetails;
      const userIdData = await userService.getUserCategory(userId);
      const userIdCategory = userIdData[0].category || {};
      let appointmentsData = {};
      if (userIdCategory === USER_CATEGORY.PATIENT) {
        appointmentsData = await eventService.getEventsByuserId({
          eventCategories: ["appointment", "reminder", "medication-reminder"],
          userId,
          status: [
            "pending",
            "completed",
            "expired",
            "active",
            "taken",
            "skip"
          ],
          startDate: startDate,
          endDate: endDate
        });
      } else {
        appointmentsData = await eventService.getEventsByuserId({
          eventCategories: ["appointment", "reminder"],
          userId,
          status: ["pending", "completed", "expired", "active"],
          startDate: startDate,
          endDate: endDate
        });
      }

      let appointments = {};
      let schedulesEvents = {};
      let scheduleEventListByDate = {};
      let parentEvents = {};
      const eventList = appointmentsData.map(appointment => appointment._id);

      let participants = new Set();
      let eventIds = new Set();
      for (const appointment of appointmentsData) {
        const { _id, participantOne, participantTwo } = appointment;
        participants.add(participantOne);
        participants.add(participantTwo);
        const scheduleEventList = await scheduleService.getScheduleEvent({
          eventId: _id,
          startDate: startDate,
          endDate: endDate
        });
        scheduleEventList.forEach(scheduleEvent => {
          const {
            _id,
            eventType,
            eventId,
            startTime,
            endTime,
            data,
            status,
            completedBy
          } = scheduleEvent;
          eventIds.add(eventId);
          schedulesEvents[_id] = {
            id: _id,
            eventType: eventType,
            eventId: eventId,
            startTime: startTime,
            endTime: endTime,
            data: data,
            status: status,
            completedBy: completedBy
          };
        });

        if (scheduleEventList.length > 0) {
          appointments[appointment._id] = scheduleEventList.map(
            scheduleEvent => scheduleEvent._id
          );
          parentEvents = { ...parentEvents, [appointment._id]: appointment };
        }
      }

      let users = {};
      for (const id of participants) {
        const usersData = await userService.getUserById(id); //need to make batch get
        users[id] = {
          basicInfo: usersData.basicInfo,
          status: usersData.status
        };
      }

      const scheduleEventListData = await scheduleService.getScheduleEventByEventIdGroupByDate(
        { eventIds: eventList, startDate, endDate }
      );

      scheduleEventListData.forEach(scheduleEvent => {
        const { _id, scheduleEvents = [] } = scheduleEvent;
        scheduleEventListByDate[_id] = scheduleEvents;
      });

      //const users = userService.getBasicInfo();//
      const scheduleEventReminderListByDate = await getCurrrentWeekReminderByDate(
        userId,
        category
      );

      const response = new Response(true, 200);
      response.setData({
        appointments: appointments,
        events: { ...schedulesEvents, ...parentEvents },
        scheduleEventListByDate: scheduleEventListByDate,
        userId,
        scheduleEventReminderListByDate: scheduleEventReminderListByDate,
        users: users
      });

      return res.send(response.getResponse());
    } catch (err) {
      console.log("err==========================>", err);
      let payload = {
        error: "something went wrong!",
        code: 500
      };
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async getDashboardReminders(req, res) {
    const { userId, startDate, endDate } = req.query;
    try {
      const { userData: { category } = {} } = req.userDetails;
      let appointmentsData = {};
      if (category === USER_CATEGORY.PATIENT) {
        appointmentsData = await eventService.getEventsByuserId({
          eventCategories: ["reminder", "medication-reminder"],
          userId,
          status: ["pending", "completed", "expired"],
          startDate: startDate,
          endDate: endDate
        });
      } else {
        appointmentsData = await eventService.getEventsByuserId({
          eventCategories: ["reminder"],
          userId,
          status: ["pending", "completed", "expired", "active"],
          startDate: startDate,
          endDate: endDate
        });
      }
      let appointments = {};
      let schedulesEvents = {};
      let scheduleEventListByDate = {};
      let medicines = [];
      const eventList = appointmentsData.map(appointment => appointment._id);
      let participants = new Set();
      let eventIds = new Set();
      for (const appointment of appointmentsData) {
        const {
          _id,
          participantOne,
          participantTwo,
          details: { medicine } = {}
        } = appointment;
        medicines.push(medicine);
        participants.add(participantOne);
        participants.add(participantTwo);
        const scheduleEventList = await scheduleService.getScheduleEvent({
          eventId: _id,
          startDate: startDate,
          endDate: endDate
        });
        scheduleEventList.forEach(scheduleEvent => {
          const {
            _id,
            eventType,
            eventId,
            startTime,
            endTime,
            data,
            status,
            completedBy
          } = scheduleEvent;
          eventIds.add(eventId);
          schedulesEvents[_id] = {
            id: _id,
            eventType: eventType,
            eventId: eventId,
            startTime: startTime,
            endTime: endTime,
            data: data,
            status: status,
            completedBy: completedBy
          };
        });
        appointments[appointment._id] = scheduleEventList.map(
          scheduleEvent => scheduleEvent._id
        );
      }
      let products = {};
      for (const medicine in medicines) {
        const product = medicines[medicine];
        const productData = await productService.getProduct({ _id: product });
        products[product] = productData;
      }
      let users = {};
      for (const id of participants) {
        const usersData = await userService.getUserById(id); //need to make batch get
        users[id] = {
          basicInfo: usersData.basicInfo,
          status: usersData.status
        };
      }

      const events = {};
      for (const id of eventIds) {
        const eventData = await eventService.getEventById(id);
        events[id] = eventData;
      }

      const scheduleEventListData = await scheduleService.getScheduleEventByEventIdGroupByDate(
        { eventIds: eventList, startDate, endDate }
      );

      scheduleEventListData.forEach(scheduleEvent => {
        const { _id, scheduleEvents = [] } = scheduleEvent;
        scheduleEventListByDate[_id] = scheduleEvents;
      });

      //const users = userService.getBasicInfo();//

      const response = new Response(true, 200);
      response.setData({
        appointments: appointments,
        events: { ...schedulesEvents, ...events },
        scheduleEventReminderListByDate: scheduleEventListByDate,
        users: users,
        products: products
      });

      return res.send(response.getResponse());
    } catch (err) {
      let payload = {
        error: "something went wrong!",
        code: 500
      };
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async getEventDataForId(req, res) {
    try {
      const { eventId } = req.params;

      const eventData = await scheduleService.getScheduleEventById(eventId);

      const response = new Response(true, 200);
      response.setData({
        events: eventData
      });
      return res.send(response.getResponse());
    } catch (err) {
      console.log("error", err);

      let payload = {
        error: "something went wrong!",
        code: 500
      };
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }
}

module.exports = new EventController();
