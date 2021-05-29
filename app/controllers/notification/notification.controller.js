import Controller from "../";
import Logger from "../../../libs/log";
import { getDataForNotification } from "./notification.controller.helper";

import ChatJob from "../../JobSdk/Chat/observer";
import NotificationSdk from "../../NotificationSdk";

import { MESSAGE_TYPES, NOTIFICATION_STAGES, NOTIFICATION_VERB , EVENT_TYPE , AGORA_CALL_NOTIFICATION_TYPES} from "../../../constant"
// import ScheduleEventService from "../../services/scheduleEvents/scheduleEvent.service";
import ScheduleEventService from "../../services/scheduleEvents/scheduleEvent.service";
import userService from "../../services/user/user.service";
import careplanAppointmentService from "../../services/carePlanAppointment/carePlanAppointment.service";

import UserWrapper from "../../ApiWrapper/web/user";
import AppointmentWrapper from "../../ApiWrapper/web/appointments";
import ScheduleEventWrapper from "../../ApiWrapper/common/scheduleEvents";

const Log = new Logger("WEB > NOTIFICATION > CONTROLLER");

class NotificationController extends Controller {
  constructor() {
    super();
  }

  getNotifications = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { body: { activities } = {}, userDetails: { userId,  userData: { category } = {}} = {} } = req;
      const notificationIds = [];

      const scheduleEventService = new ScheduleEventService();

      let notificationData = {};
      let userData = {};
      let doctorData = {};
      let patientData = {};
      let appointmentData = {};
      let medicationData = {};
      let medicineData = {};
      let vitalsData = {};
      let carePlansData = {};
      let scheduleEventsData = {};
      let symptomsData = {};
      let vitalTemplatesData = {};
      for (let key in activities) {
        const { activity: activityData, is_read, group_id } = activities[key];

        const { id, verb } = activityData[0] || {};
        notificationIds.push(id);

        const details = await getDataForNotification({
          data: activityData[0] || {},
          loggedInUser: userId,
          is_read: is_read,
          group_id,
          category
        });

        const {
          notifications = {},
          users = {},
          doctors = {},
          patients = {},
          medications = {},
          medicines = {},
          vitals = {},
          care_plans = {},
          symptoms = {},
          appointments = {},
          schedule_events = {},
          vital_templates = {}
        } = details || {};

        // for (let each in appointments){
        //   const appt = appointments[each];
        //   const {basic_info : {id : appointmentId = null } ={} } = appt;
        //   const apptData = await AppointmentWrapper(null,appointmentId);
        //   if(apptData){

        //     const {care_plan_id = null } = await careplanAppointmentService.getCareplanByAppointment({
        //       appointment_id:appointmentId
        //     }) || {};

        //     appointments[each] = { ...appt , care_plan_id }

        //   }
        // }


        // for(let each in notifications){
        //   const noti = notifications[each] ;
        //   const {stage = '',foreign_id=null , type = '' , actor = null } = noti ; 

        //   let actor_category_id = null;
        //   let actor_category_type = '' ;

        //   if( ( type === MESSAGE_TYPES.USER_MESSAGE ||
        //       type === EVENT_TYPE.SYMPTOMS ||
        //       type === AGORA_CALL_NOTIFICATION_TYPES.MISSED_CALL ) && actor ){

        //     const user = await userService.getUser(actor);

        //     // if(user){
        //     //   const userData= await UserWrapper(user);
        //     //   const {userCategoryId} = await userData.getCategoryInfo();
        //     //   const category = await userData.getCategory(); 
        //     //   actor_category_type = category;
        //     //   actor_category_id = userCategoryId;

        //     //   notifications[each] = { ...noti, actor_category_type, actor_category_id };
              
        //     // }
        //   }

        //   if(stage === NOTIFICATION_STAGES.START || stage === NOTIFICATION_STAGES.PRIOR ) {

        //     const scheduleEventData = await scheduleEventService.getEventByData({
        //       id: parseInt(foreign_id, 10)
        //     });

        //     if(scheduleEventData){
        //       const scheduleEventDetails = await ScheduleEventWrapper(scheduleEventData);
        //       scheduleEventsData[scheduleEventDetails.getScheduleEventId()] = 
        //         scheduleEventDetails.getAllInfo();
        //     }
        //   }

        // }


        notificationData = { ...notificationData, ...notifications };
        userData = { ...userData, ...users };
        doctorData = { ...doctorData, ...doctors };
        patientData = { ...patientData, ...patients };
        appointmentData = { ...appointmentData, ...appointments };
        medicationData = { ...medicationData, ...medications };
        medicineData = { ...medicineData, ...medicines };
        vitalsData = { ...vitalsData, ...vitals };
        carePlansData = { ...carePlansData, ...care_plans };
        scheduleEventsData = { ...scheduleEventsData, ...schedule_events};
        symptomsData = {...symptomsData, ...symptoms};
        vitalTemplatesData = {...vitalTemplatesData, ...vital_templates};
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
          vitals: vitalsData,
          vital_templates: vitalTemplatesData,
          care_plans: carePlansData,
          schedule_events:scheduleEventsData,
          symptoms: symptomsData,
          // ids
          notification_ids: Object.keys(notificationData),
          doctor_ids: Object.keys(doctorData),
          patient_ids: Object.keys(patientData),
          appointment_ids: Object.keys(appointmentData),
          user_ids: Object.keys(userData),
          medicine_ids: Object.keys(medicineData),
          medication_ids: Object.keys(medicationData),
          vitals_ids: Object.keys(vitalsData),
          care_plan_ids: Object.keys(carePlansData),
          symptom_ids: Object.keys(symptomsData)
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
        userData: { category } = {},
        userCategoryData: { basic_info: { full_name = "" } = {} } = {}
      } = userDetails || {};


      const eventData = {
        participants: [userId, receiver_id],
        actor: {
          id: userId,
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
