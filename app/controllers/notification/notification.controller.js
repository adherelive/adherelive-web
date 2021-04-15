import Controller from "../";
import Logger from "../../../libs/log";
import { getDataForNotification } from "./notification.controller.helper";

import ChatJob from "../../JobSdk/Chat/observer";
import NotificationSdk from "../../NotificationSdk";

import { MESSAGE_TYPES } from "../../../constant"

const Log = new Logger("WEB > NOTIFICATION > CONTROLLER");

class NotificationController extends Controller {
  constructor() {
    super();
  }

  getNotifications = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { body: { activities } = {}, userDetails: { userId, userRoleId } = {} } = req;
      const notificationIds = [];

      let notificationData = {};
      let userData = {};
      let userRoleData = {};
      let doctorData = {};
      let patientData = {};
      let appointmentData = {};
      let medicationData = {};
      let medicineData = {};
      let vitalsData = {};
      let carePlansData = {};
      for (let key in activities) {
        const { activity: activityData, is_read, group_id } = activities[key];

        const { id, verb } = activityData[0] || {};
        notificationIds.push(id);

        const details = await getDataForNotification({
          data: activityData[0] || {},
          loggedInUser: userId,
          loggedInUserRole: userRoleId,
          is_read: is_read,
          group_id
        });

        const {
          notifications = {},
          users = {},
          doctors = {},
          patients = {},
          appointments = {},
          medications = {},
          medicines = {},
          vitals = {},
          care_plans = {},
          user_roles = {}
        } = details || {};
        notificationData = { ...notificationData, ...notifications };
        userData = { ...userData, ...users };
        userRoleData = {...userRoleData, ...user_roles}
        doctorData = { ...doctorData, ...doctors };
        patientData = { ...patientData, ...patients };
        appointmentData = { ...appointmentData, ...appointments };
        medicationData = { ...medicationData, ...medications };
        medicineData = { ...medicineData, ...medicines };
        vitalsData = { ...vitalsData, ...vitals };
        carePlansData = { ...carePlansData, ...care_plans };
      }

      return raiseSuccess(
        res,
        200,
        {
          users: userData,
          user_roles: userRoleData,
          doctors: doctorData,
          patients: patientData,
          notifications: notificationData,
          appointments: appointmentData,
          medications: medicationData,
          medicines: medicineData,
          vitals: vitalsData,
          care_plans: carePlansData,
          // ids
          notification_ids: Object.keys(notificationData),
          doctor_ids: Object.keys(doctorData),
          patient_ids: Object.keys(patientData),
          appointment_ids: Object.keys(appointmentData),
          user_ids: Object.keys(userData),
          user_role_ids: Object.keys(userRoleData),
          medicine_ids: Object.keys(medicineData),
          medication_ids: Object.keys(medicationData),
          vitals_ids: Object.keys(vitalsData),
          care_plan_ids: Object.keys(carePlansData)
        },
        "Notification data fetched successfully"
      );
    } catch (error) {
      Log.debug("getNotifications 500 error", error);
      return raiseServerError(res);
    }
  };

  raiseChatNotification = async(req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try{
      const { body: { message = "", receiver_id = "" } = {}, userDetails  = {} } = req || {};

      const {
        userId,
        userRoleId,
        userData: { category } = {},
        userCategoryData: { basic_info: { full_name = "" } = {} } = {}
      } = userDetails || {};


      const eventData = {
        participants: [userId, receiver_id],
        actor: {
          id: userId,
          user_role_id: userRoleId,
          details: {
            name: full_name,
            category
          }
        },
        details: {
          message
        }
      };

      const chatJob = ChatJob.execute(
        MESSAGE_TYPES.USER_MESSAGE,
        eventData
      );
      await NotificationSdk.execute(chatJob);

      return raiseSuccess(
        res,
        200,
        {
        },
        "Notification sent successfully."
      );

    } catch(err) {
      Log.debug("raiseChatNotification 500 error", error);
      return raiseServerError(res);
    }
  }
}

export default new NotificationController();
