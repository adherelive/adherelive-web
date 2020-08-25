import Controller from "../";
import Logger from "../../../libs/log";
import {getDataForNotification} from "./notification.controller.helper";

const Log = new Logger("WEB > NOTIFICATION > CONTROLLER");

class NotificationController extends Controller {
    constructor() {
        super();
    }

    getNotifications = async (req, res) => {
        const {raiseSuccess, raiseClientError, raiseServerError} = this;
        try {
            const {body : {activities} = {}, userDetails: {userId} = {}} = req;

            const notificationIds = [];

            let notificationData = {};
            let userData = {};
            let doctorData = {};
            let patientData = {};
            let eventData = {};
            for(let key in activities) {
                const { activity: activityData, is_read } = activities[key];
                const { id, verb } = activityData[0] || {};
                notificationIds.push(id);

                const details = await getDataForNotification({
                    data: activityData[0] || {},
                    loggedInUser: userId,
                    is_read: is_read
                });

                const {notifications, users, doctors, patients, events} = details || {};
                notificationData = {...notificationData, ...notifications};
                userData = {...userData, ...users};
                doctorData = {...doctorData, doctors};
                patientData = {...patientData, ...patients};
                eventData = {...eventData, ...events};
            }

            return raiseSuccess(
                res,
                200,
                {
                    users: userData,
                    doctors: doctorData,
                    patients: patientData,
                    notifications: notificationData,
                    events: eventData,
                    // ids
                    notification_ids: Object.keys(notificationData),
                    doctor_ids: Object.keys(doctorData),
                    patient_ids: Object.keys(patientData),
                    event_ids: Object.keys(eventData),
                    user_ids: Object.keys(userData),
                },
                "Notification data fetched successfully"
            );

        } catch(error) {
            Log.debug("getNotifications 500 error", error);
            return raiseServerError(res);
        }
    };

}

export default new NotificationController();