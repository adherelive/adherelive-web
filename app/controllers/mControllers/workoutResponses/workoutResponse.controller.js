import Controller from "../../index";

// services
import WorkoutResponseService from "../../../services/workoutResponses/workoutResponses.service";
import EventService from "../../../services/scheduleEvents/scheduleEvent.service";
import WorkoutService from "../../../services/workouts/workout.service";
import ExerciseContentService from "../../../services/exerciseContents/exerciseContent.service";
import carePlanService from "../../../services/carePlan/carePlan.service";

// wrappers
import WorkoutResponseWrapper from "../../../ApiWrapper/mobile/workoutResponse";
import WorkoutWrapper from "../../../ApiWrapper/mobile/workouts";
import CareplanWrapper from "../../../ApiWrapper/mobile/carePlan";
import DoctorWrapper from "../../../ApiWrapper/mobile/doctor";
import EventWrapper from "../../../ApiWrapper/common/scheduleEvents";
import ExerciseContentWrapper from "../../../ApiWrapper/mobile/exerciseContents";

import WorkoutJob from "../../../JobSdk/Workout/observer";
import NotificationSdk from "../../../NotificationSdk";

import Logger from "../../../../libs/log";
import {
  EVENT_STATUS,
  NOTIFICATION_STAGES,
  USER_CATEGORY,
  WORKOUT_RESPONSE_STATUS,
} from "../../../../constant";

const Log = new Logger("MOBILE > WORKOUT_RESPONSE > CONTROLLER");

class WorkoutResponseController extends Controller {
  constructor() {
    super();
  }

  create = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      Log.debug("request body", req.body);
      const {
        body = {},
        userDetails: {
          userId,
          userData: { category } = {},
          userCategoryData: { basic_info: { full_name } = {} } = {},
        } = {},
      } = req;
      const {
        schedule_event_id,
        workout_id,
        status,
        exercise_group_id,
        sets,
        repetition_value,
        repetition_id,
        calorific_value
      } = body || {};

      const workoutResponseService = new WorkoutResponseService();
      const eventService = new EventService();

      const eventExists = await eventService.getEventByData({
        id: schedule_event_id,
      });

      if (!eventExists) {
        return raiseClientError(
          res,
          422,
          {},
          "No event exists for the mentioned schedule event id"
        );
      }

      const { status: eventStatus } = eventExists || {};

      if (
        eventStatus !== EVENT_STATUS.SCHEDULED &&
        eventStatus !== EVENT_STATUS.COMPLETED &&
        eventStatus !== EVENT_STATUS.EXPIRED
      ) {
        return raiseClientError(
          res,
          422,
          {},
          "Event is not yet scheduled. Cannot add response before event is scheduled"
        );
      }

      const responseExists = await workoutResponseService.findOne({
        schedule_event_id,
        exercise_group_id,
      });

      if (responseExists) {
        return raiseClientError(
          res,
          422,
          {},
          "Workout already captured for this time."
        );
      }

      const workoutResponseId =
        (await workoutResponseService.create({
          schedule_event_id,
          workout_id,
          exercise_group_id,
          status,
          sets,
          repetition_value,
          repetition_id,
          other_details: {
            calorific_value
          },
        })) || null;

      await eventService.update(
        {
          status: EVENT_STATUS.COMPLETED,
        },
        schedule_event_id
      );

      if (workoutResponseId) {
        // get doctor for workout
        const workout = await WorkoutWrapper({ id: workout_id });
        const carePlan = await CareplanWrapper(null, workout.getCareplanId());
        const doctor = await DoctorWrapper(null, carePlan.getDoctorId());

        const workoutResponse = await WorkoutResponseWrapper({
          id: workoutResponseId,
        });

        const workoutJob = WorkoutJob.execute(
          NOTIFICATION_STAGES.RESPONSE_ADDED,
          {
            participants: [userId, doctor.getUserId()],
            actor: {
              id: userId,
              details: { name: full_name, category },
            },
            id: workoutResponseId,
            ...(await workoutResponse.getReferenceInfo()),
          }
        );

        await NotificationSdk.execute(workoutJob);
        return raiseSuccess(
          res,
          200,
          { ...(await workoutResponse.getReferenceInfo()) },
          "Workout response added successfully"
        );
      } else {
        return raiseClientError(res, 422, {}, "Please check details entered");
      }
    } catch (error) {
      Log.debug("create 500", error);
      return raiseServerError(res);
    }
  };

  update = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        params: { id } = {},
        // userDetails: {
        //   userId,
        //   userData: { category } = {},
        //   userCategoryData: { basic_info: { full_name } = {} } = {},
        // } = {},
        body = {},
      } = req;

      const {
        sets,
        repetition_value,
        repetition_id,
        exercise_group_id,
        schedule_event_id,
        calorific_value
      } = body || {};

      const workoutResponseService = new WorkoutResponseService();
      const eventService = new EventService();

      const eventExists = await eventService.getEventByData({
        id: schedule_event_id,
      });

      if (!eventExists) {
        return raiseClientError(
          res,
          422,
          {},
          "No event exists for the mentioned schedule event id"
        );
      }

      const { status } = eventExists || {};

      if (status !== EVENT_STATUS.COMPLETED) {
        return raiseClientError(
          res,
          422,
          {},
          "Event is not yet completed. Cannot update response before event is completed"
        );
      }

      const responseExists = await workoutResponseService.findOne({
        schedule_event_id,
        exercise_group_id,
      });

      if (!responseExists) {
        return raiseClientError(
          res,
          422,
          {},
          "No response captured for this exercise at the moment."
        );
      }

      const isUpdated =
        (await workoutResponseService.update({
          schedule_event_id,
          exercise_group_id,
          sets,
          repetition_value,
          repetition_id,
          other_details: {
            calorific_value
          },
          id,
        })) || null;

      if (isUpdated) {
        const workoutResponse = await WorkoutResponseWrapper({
          id,
        });

        return raiseSuccess(
          res,
          200,
          { ...(await workoutResponse.getReferenceInfo()) },
          "Workout response updated successfully"
        );
      } else {
        return raiseClientError(res, 422, {}, "Please check details entered");
      }
    } catch (error) {
      Log.debug("create 500", error);
      return raiseServerError(res);
    }
  };

  skip = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { body = {} } = req;
      const { schedule_event_id } = body;

      if (!schedule_event_id) {
        return raiseClientError(res, 422, {}, "Please select event to skip");
      }

      const event = await EventWrapper(null, schedule_event_id);

      if (
        event.getStatus() !== EVENT_STATUS.SCHEDULED &&
        event.getStatus() !== EVENT_STATUS.EXPIRED
      ) {
        return raiseClientError(
          res,
          422,
          {},
          "Event is not yet scheduled and cannot be skipped"
        );
      }

      const { details: { workouts, workout_id } = {} } = event.getAllInfo();
      const { exercise_group_ids } = workouts[workout_id] || {};

      const workout = await WorkoutWrapper({ id: workout_id });

      const {
        exercise_groups,
        exercise_details,
      } = await workout.getReferenceInfo();

      let responseData = [];
      for (let index = 0; index < exercise_group_ids.length; index++) {
        const exercise_group_id = exercise_group_ids[index];

        const { basic_info: { exercise_detail_id } = {}, sets } =
          exercise_groups[exercise_group_id] || {};

        const { basic_info: { repetition_id, repetition_value } = {} } =
          exercise_details[exercise_detail_id] || {};

        responseData.push({
          workout_id,
          schedule_event_id,
          exercise_group_id,
          sets,
          repetition_id,
          repetition_value,
          status: WORKOUT_RESPONSE_STATUS.SKIPPED,
        });
      }

      const workoutResponseService = new WorkoutResponseService();

      await workoutResponseService.bulkCreate(responseData);

      const eventService = new EventService();

      await eventService.update(
        {
          status: EVENT_STATUS.CANCELLED,
        },
        schedule_event_id
      );

      return raiseSuccess(
        res,
        200,
        {},
        "Workout response skipped successfully"
      );
    } catch (error) {
      Log.debug("skip 500", error);
      return raiseServerError(res);
    }
  };

  get = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { query: { schedule_event_id } = {}, userDetails } = req;

      if (!parseInt(schedule_event_id)) {
        return raiseClientError(
          res,
          422,
          {},
          "Please select valid event id to continue"
        );
      }

      const { userData: { category } = {}, userCategoryId } = userDetails;

      let auth = {
        creator_id: userCategoryId,
        creator_type: category,
      };
      if (category === USER_CATEGORY.PATIENT) {
        const patientCareplans = await carePlanService.getAllDoctors({
          patient_id: userCategoryId,
        });

        const doctorIds = patientCareplans.map(
          (patientCareplan) => patientCareplan.doctor_id
        );

        auth = {
          creator_id: doctorIds,
          creator_type: USER_CATEGORY.DOCTOR,
        };
      }

      const workoutResponseService = new WorkoutResponseService();

      const {
        count: totalWorkoutResponses,
        rows: workoutResponses = [],
      } = await workoutResponseService.findAndCountAll({
        where: { schedule_event_id },
      });

      // if (totalWorkoutResponses) {
      const eventService = new EventService();

      const eventData = await eventService.getEventByData({
        id: schedule_event_id,
        paranoid: false,
      });

      const event = await EventWrapper(eventData);
      const workout = await WorkoutWrapper({ id: event.getEventId() });

      const {
        exercises,
        exercise_groups,
        exercise_details,
      } = await workout.getReferenceInfo();

      // exercise contents
      const exerciseContentService = new ExerciseContentService();
      const { count: totalExerciseContent, rows: exerciseContents = [] } =
        (await exerciseContentService.findAndCountAll({
          exercise_id: Object.keys(exercises),
          ...auth,
        })) || {};

      let allExerciseContents = {};
      let allExerciseContentMappings = {};
      if (totalExerciseContent) {
        for (let index = 0; index < exerciseContents.length; index++) {
          const exerciseContent = await ExerciseContentWrapper({
            data: exerciseContents[index],
          });
          allExerciseContents[
            exerciseContent.getId()
          ] = exerciseContent.getBasicInfo();
          allExerciseContentMappings[
            exerciseContent.getExerciseId()
          ] = exerciseContent.getId();
        }
      }

      let allWorkoutResponseExerciseGroups = {};
      let allWorkoutResponses = {};

      for (let index = 0; index < totalWorkoutResponses; index++) {
        const workoutResponse = await WorkoutResponseWrapper({
          data: workoutResponses[index],
        });

        const { workout_responses } = await workoutResponse.getReferenceInfo();

        allWorkoutResponseExerciseGroups[
          workoutResponse.getExerciseGroupId()
        ] = workoutResponse.getId();

        allWorkoutResponses = {
          ...allWorkoutResponses,
          ...workout_responses,
        };
      }
        let workout_exercise_groups = [] , exerciseContentData = {};

      for (const exerciseGroupId of Object.keys(exercise_groups)) {
        const {
          basic_info: { id: exercise_group_id, exercise_detail_id } = {},
          sets,
          details = {},
        } = exercise_groups[exerciseGroupId] || {};

        const { basic_info: { exercise_id } = {} } =
          exercise_details[exercise_detail_id] || {};

        const exerciseContentId =
          allExerciseContentMappings[exercise_id] || null;

        const workoutResponseId =
          allWorkoutResponseExerciseGroups[exercise_group_id] || null;

          if(exerciseContentId){
            const exerciseContentWrapper = await ExerciseContentWrapper({
              id:exerciseContentId
            });

            exerciseContentData[
              exerciseContentWrapper.getId()
            ] = exerciseContentWrapper.getBasicInfo();
          }
          
        workout_exercise_groups.push({
          exercise_group_id,
          exercise_detail_id,
          sets,
          exercise_content_id: exerciseContentId,
          workout_response_id: workoutResponseId,
          ...details,
        });
      }

      return raiseSuccess(
        res,
        200,
        {
          ...(await workout.getReferenceInfo()),
          workout_responses: allWorkoutResponses,
          schedule_events: {
            [event.getScheduleEventId()]: event.getAllInfo(),
          },
          workout_exercise_groups,
          exercise_contents:{...exerciseContentData}

        }, "Workout responses fetched succesfully");
      // } else {
      //   return raiseSuccess(
      //     res,
      //     201,
      //     {},
      //     "No responses added yet for the event"
      //   );
      // }
    } catch (error) {
      Log.debug("get 500", error);
      return raiseServerError(res);
    }
  };
}

export default new WorkoutResponseController();
