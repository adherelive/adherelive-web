import Controller from "../";
import Logger from "../../../libs/log";
import { getDataForNotification } from "./notification.controller.helper";

import ChatJob from "../../JobSdk/Chat/observer";
import NotificationSdk from "../../NotificationSdk";

import {
  MESSAGE_TYPES,
  NOTIFICATION_STAGES,
  NOTIFICATION_VERB,
  EVENT_TYPE,
  AGORA_CALL_NOTIFICATION_TYPES,
} from "../../../constant";
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
      const {
        body: { activities } = {},
        userDetails: { userId, userRoleId, userData: { category } = {} } = {},
      } = req;

      const notificationIds = [];

      // const scheduleEventService = new ScheduleEventService();

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
      let scheduleEventsData = {};
      let symptomsData = {};
      let vitalTemplatesData = {};

      // diets
      let dietData = {};
      let dietFoodGroupMappingData = {};
      let foodGroupData = {};
      let foodItemDetailData = {};
      let foodItemData = {};
      let portionData = {};
      let dietResponseData = {};

      // workouts
      let workoutData = {};
      // let dietFoodGroupMappingData = {};
      let exerciseGroupData = {};
      let exerciseDetailData = {};
      let exerciseData = {};
      let repetitionData = {};
      let workoutResponseData = {};

      let uploadDocumentsData = {};

      for (let key in activities) {
        const { activity: activityData, is_read, group_id } = activities[key];

        const { id, verb } = activityData[0] || {};
        notificationIds.push(id);

        const details = await getDataForNotification({
          data: activityData[0] || {},
          loggedInUser: userId,
          loggedInUserRole: userRoleId,
          is_read: is_read,
          group_id,
          category,
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
          user_roles = {},
          symptoms = {},
          appointments = {},
          schedule_events = {},
          vital_templates = {},
          diet_responses = null,
          upload_documents = null,
          diets = null,
          diet_food_group_mappings = null,
          food_groups = null,
          food_item_details = null,
          food_items = null,
          portions = null,

          workouts = null,
          exercise_groups = null,
          exercise_details = null,
          exercises = null,
          repetitions = null,
          workout_responses = null,
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
        userRoleData = { ...userRoleData, ...user_roles };
        doctorData = { ...doctorData, ...doctors };
        patientData = { ...patientData, ...patients };
        appointmentData = { ...appointmentData, ...appointments };
        medicationData = { ...medicationData, ...medications };
        medicineData = { ...medicineData, ...medicines };
        vitalsData = { ...vitalsData, ...vitals };
        carePlansData = { ...carePlansData, ...care_plans };
        scheduleEventsData = { ...scheduleEventsData, ...schedule_events };
        symptomsData = { ...symptomsData, ...symptoms };
        vitalTemplatesData = { ...vitalTemplatesData, ...vital_templates };

        if (diets) {
          dietData = { ...dietData, ...diets };
        }

        if (diet_food_group_mappings) {
          dietFoodGroupMappingData = {
            ...dietFoodGroupMappingData,
            ...diet_food_group_mappings,
          };
        }

        if (food_groups) {
          foodGroupData = { ...foodGroupData, ...food_groups };
        }

        if (food_item_details) {
          foodItemDetailData = { ...foodItemDetailData, ...food_item_details };
        }

        if (food_items) {
          foodItemData = { ...foodItemData, ...food_items };
        }

        if (portions) {
          portionData = { ...portionData, ...portions };
        }

        if (diet_responses) {
          dietResponseData = { ...dietResponseData, ...diet_responses };
        }

        if (upload_documents) {
          uploadDocumentsData = { ...uploadDocumentsData, ...upload_documents };
        }

        if (workouts) {
          workoutData = { ...workoutData, ...workouts };
        }

        if (exercise_groups) {
          exerciseGroupData = { ...exerciseGroupData, ...exercise_groups };
        }

        if (exercise_details) {
          exerciseDetailData = { ...exerciseDetailData, ...exercise_details };
        }

        if (exercises) {
          exerciseData = { ...exerciseData, ...exercises };
        }

        if (repetitions) {
          repetitionData = { ...repetitionData, ...repetitions };
        }

        if (workout_responses) {
          workoutResponseData = {
            ...workoutResponseData,
            ...workout_responses,
          };
        }
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
          vital_templates: vitalTemplatesData,
          care_plans: carePlansData,
          schedule_events: scheduleEventsData,
          symptoms: symptomsData,

          // diets
          diets: dietData,
          diet_food_group_mappings: dietFoodGroupMappingData,
          food_groups: foodGroupData,
          food_item_details: foodItemDetailData,
          food_items: foodItemData,
          portions: portionData,
          diet_responses: dietResponseData,
          upload_documents: uploadDocumentsData,

          // workouts
          workouts: workoutData,
          exercise_groups: exerciseGroupData,
          exercise_details: exerciseDetailData,
          exercises: exerciseData,
          repetitions: repetitionData,
          workout_responses: workoutResponseData,

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
          care_plan_ids: Object.keys(carePlansData),
          symptom_ids: Object.keys(symptomsData),
          diet_response_ids: Object.keys(dietResponseData),
          workout_response_ids: Object.keys(workoutResponseData),
          upload_document_ids: Object.keys(uploadDocumentsData),
        },
        "Notification data fetched successfully"
      );
    } catch (error) {
      Log.debug("getNotifications 500 error", error);
      return raiseServerError(res);
    }
  };

  raiseChatNotification = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const {
        body: { message = "", receiver_id = "", receiver_role_id = "" } = {},
        userDetails = {},
      } = req || {};

      const {
        userId,
        userRoleId,
        userData: { category } = {},
        userCategoryData: { basic_info: { full_name = "" } = {} } = {},
      } = userDetails || {};

      const eventData = {
        participants: [userRoleId, receiver_role_id],
        actor: {
          id: userId,
          user_role_id: userRoleId,
          details: {
            name: full_name,
            category,
          },
        },
        details: {
          message,
        },
      };

      const chatJob = ChatJob.execute(MESSAGE_TYPES.USER_MESSAGE, eventData);
      await NotificationSdk.execute(chatJob);

      return raiseSuccess(res, 200, {}, "Notification sent successfully.");
    } catch (error) {
      Log.debug("raiseChatNotification 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new NotificationController();
