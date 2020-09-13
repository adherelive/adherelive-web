import Controller from "../";
import Logger from "../../../libs/log";
import { getDataForNotification } from "./notification.controller.helper";

const Log = new Logger("WEB > NOTIFICATION > CONTROLLER");

class NotificationController extends Controller {
  constructor() {
    super();
  }

  getNotifications = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { body: { activities } = {}, userDetails: { userId } = {} } = req;
       console.log('43756464865745348=========>>',activities);
      const notificationIds = [];

      let notificationData = {};
      let userData = {};
      let doctorData = {};
      let patientData = {};
      let appointmentData = {};
      let medicationData = {};
      let medicineData = {};
      for (let key in activities) {
        const { activity: activityData, is_read } = activities[key];

        Log.debug("activityData", activityData[0]);
        const { id, verb } = activityData[0] || {};
        notificationIds.push(id);

        const details = await getDataForNotification({
          data: activityData[0] || {},
          loggedInUser: userId,
          is_read: is_read
        });

        Log.debug("details", details);

        const {
          notifications = {},
          users = {},
          doctors = {},
          patients = {},
          appointments = {},
            medications = {},
          medicines = {}
        } = details || {};
        notificationData = { ...notificationData, ...notifications };
        userData = { ...userData, ...users };
        doctorData = { ...doctorData, ...doctors };
        patientData = { ...patientData, ...patients };
        appointmentData = { ...appointmentData, ...appointments };
        medicationData = {...medicationData, ...medications};
        medicineData = { ...medicineData, ...medicines };
      }

      return raiseSuccess(
        res,
        200,
        {
          users: userData,
          doctors: doctorData,
          patients: patientData,
          notifications: notificationData,
          appointments: appointmentData,
          medications: medicationData,
            medicines: medicineData,
          // ids
          notification_ids: Object.keys(notificationData),
          doctor_ids: Object.keys(doctorData),
          patient_ids: Object.keys(patientData),
          appointment_ids: Object.keys(appointmentData),
          user_ids: Object.keys(userData),
            medicine_ids: Object.keys(medicineData),
          medication_ids: Object.keys(medicationData),
        },
        "Notification data fetched successfully"
      );
    } catch (error) {
      Log.debug("getNotifications 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new NotificationController();
