import Controller from "../index";

import Logger from "../../../libs/log";
import moment from "moment";

// services
import WorkoutService from "../../services/workouts/workout.service";
import RepetitionService from "../../services/exerciseRepetitions/repetition.service";
import QueueService from "../../services/awsQueue/queue.service";
import EventService from "../../services/scheduleEvents/scheduleEvent.service";
import carePlanService from "../../services/carePlan/carePlan.service";
import ExerciseContentService from "../../services/exerciseContents/exerciseContent.service";
import WorkoutResponseService from "../../services/workoutResponses/workoutResponses.service";

// import WorkoutTemplateService from "../../../services/workoutTemplates/workoutTemplate.service";

// wrappers
import WorkoutWrapper from "../../ApiWrapper/web/workouts";
import CareplanWrapper from "../../ApiWrapper/web/carePlan";
import PatientWrapper from "../../ApiWrapper/web/patient";
import ExerciseContentWrapper from "../../ApiWrapper/web/exerciseContents";
import WorkoutResponseWrapper from "../../ApiWrapper/web/workoutResponse";
import EventWrapper from "../../ApiWrapper/common/scheduleEvents";
// import WorkoutTemplateWrapper from "../../../ApiWrapper/mobile/workoutTemplates";

import WorkoutJob from "../../jobSdk/Workout/observer";
import NotificationSdk from "../../notificationSdk";

import {
  DAYS,
  EVENT_STATUS,
  EVENT_TYPE,
  USER_CATEGORY,
} from "../../../constant";

import WorkoutResponsesService from "../../services/workoutResponses/workoutResponses.service";

const Log = new Logger("WEB > WORKOUT > CONTROLLER");

class WorkoutController extends Controller {
  constructor() {
    super();
  }

  create = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { body, userDetails } = req;
      Log.debug("request body", body);

      const {
        userId,
        userRoleId,
        userData: { category } = {},
        userCategoryData: { basic_info: { full_name = "" } = {} } = {},
      } = userDetails || {};

      const {
        name = "",
        care_plan_id = null,
        start_date,
        end_date = null,
        time = null,
        total_calories = null,
        not_to_do = "",
        repeat_days = [],
        workout_exercise_groups = [],
      } = body;

      const careplanWrapper = await CareplanWrapper(null, care_plan_id);
      const current_careplan_doctor_id = await careplanWrapper.getDoctorId();
      const patientId = await careplanWrapper.getPatientId();
      const patient = await PatientWrapper(null, patientId);
      const { user_role_id: patientRoleId } = await patient.getAllInfo();

      const { count = 0, rows = [] } = await carePlanService.findAndCountAll({
        where: {
          doctor_id: current_careplan_doctor_id,
          patient_id: patientId,
          user_role_id: userRoleId,
        },
        attributes: ["id"],
        userRoleId: userRoleId,
      });

      if (count > 0) {
        for (let each in rows) {
          const { id: careplan_id = null } = rows[each] || {};
          const eachCareplanWrapper = await CareplanWrapper(null, careplan_id);
          if (eachCareplanWrapper) {
            const { workout_ids = [] } = await eachCareplanWrapper.getAllInfo();

            for (let id of workout_ids) {
              const workoutWrapper = await WorkoutWrapper({ id });
              const workoutTime = await workoutWrapper.getTime();
              const fomattedTime = moment(time).toISOString();
              const formattedWorkoutTime = moment(workoutTime).toISOString();
              if (fomattedTime === formattedWorkoutTime) {
                return raiseClientError(
                  res,
                  422,
                  {},
                  `Workout for this patient with same time already exists`
                );
              }
            }
          }
        }
      }

      const workoutService = new WorkoutService();

      const workoutExists =
        (await workoutService.findOne({ name, care_plan_id })) || null;

      if (workoutExists) {
        return raiseClientError(
          res,
          422,
          {},
          `Workout with name ${name} already exists`
        );
      }

      const workout_id = await workoutService.create({
        name,
        care_plan_id,
        start_date,
        end_date,
        total_calories,
        workout_exercise_groups,
        time,
        details: { not_to_do, repeat_days },
      });

      const workout = await WorkoutWrapper({ id: workout_id });

      const carePlanId = workout.getCareplanId();

      const eventScheduleData = {
        patient_user_id: patient.getUserId(),
        type: EVENT_TYPE.WORKOUT,
        event_id: workout.getId(),
        // status: EVENT_STATUS.SCHEDULED,
        start_date,
        end_date,
        participants: [userRoleId, patientRoleId],
        actor: {
          id: userId,
          user_role_id: userRoleId,
          details: { name: full_name, category },
        },
      };

      const queueService = new QueueService();
      const sqsResponse = await queueService.sendMessage(eventScheduleData);

      Log.debug("sqsResponse ---> ", sqsResponse);

      const workoutJob = WorkoutJob.execute(
        EVENT_STATUS.SCHEDULED,
        eventScheduleData
      );

      await NotificationSdk.execute(workoutJob);

      return raiseSuccess(
        res,
        200,
        {
          ...(await workout.getReferenceInfo()),
          care_plans: {
            [careplanWrapper.getCarePlanId()]:
              await careplanWrapper.getAllInfo(),
          },
        },
        "Workout created successfully."
      );
    } catch (error) {
      Log.debug("create 500 - workout controller created", error);
      return raiseServerError(res);
    }
  };

  update = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { params, body, userDetails } = req;
      Log.debug("request params, body", { params, body });

      const {
        userId,
        userRoleId,
        userData: { category } = {},
        userCategoryData: { basic_info: { full_name = "" } = {} } = {},
      } = userDetails || {};

      const { id: workout_id } = params || {};

      const {
        name = "",
        care_plan_id = null,
        start_date,
        end_date = null,
        total_calories = null,
        not_to_do = "",
        repeat_days = [],
        time = null,
        workout_exercise_groups = [],
        delete_exercise_group_ids = [],
      } = body;

      const careplanWrapper = await CareplanWrapper(null, care_plan_id);
      const current_careplan_doctor_id = await careplanWrapper.getDoctorId();
      const patientId = await careplanWrapper.getPatientId();

      const { count = 0, rows = [] } = await carePlanService.findAndCountAll({
        where: {
          doctor_id: current_careplan_doctor_id,
          patient_id: patientId,
          user_role_id: userRoleId,
        },
        attributes: ["id"],
        userRoleId: userRoleId,
      });

      if (count > 0) {
        for (let each in rows) {
          const { id: careplan_id = null } = rows[each] || {};
          const eachCareplanWrapper = await CareplanWrapper(null, careplan_id);
          if (eachCareplanWrapper) {
            const { workout_ids = [] } = await eachCareplanWrapper.getAllInfo();

            for (let id of workout_ids) {
              const workoutWrapper = await WorkoutWrapper({ id });
              const workoutTime = await workoutWrapper.getTime();
              const fomattedTime = moment(time).toISOString();
              const formattedWorkoutTime = moment(workoutTime).toISOString();
              if (
                id.toString() !== workout_id.toString() &&
                fomattedTime === formattedWorkoutTime
              ) {
                return raiseClientError(
                  res,
                  422,
                  {},
                  `Workout for this patient with same time already exists`
                );
              }
            }
          }
        }
      }

      const workoutService = new WorkoutService();

      const workoutExists =
        (await workoutService.findOne({ id: workout_id })) || null;

      if (!workoutExists) {
        return raiseClientError(
          res,
          422,
          {},
          `No Matching Workout Details Found`
        );
      }

      const existingWorkout =
        (await workoutService.findOne({ name, care_plan_id })) || null;

      const { id = null } = existingWorkout || {};

      if (existingWorkout && id !== parseInt(workout_id)) {
        return raiseClientError(
          res,
          422,
          {},
          `Workout Exists with the same name for patient`
        );
      }

      const isUpdated = await workoutService.update({
        workout_id,
        name,
        care_plan_id,
        start_date,
        end_date,
        total_calories,
        details: { not_to_do, repeat_days },
        time,
        workout_exercise_groups,
        delete_exercise_group_ids,
      });

      if (isUpdated) {
        const workout = await WorkoutWrapper({ id: workout_id });

        // delete existing schedule events created
        const eventService = new EventService();
        await eventService.deleteBatch({
          event_id: workout_id,
          event_type: EVENT_TYPE.WORKOUT,
        });

        // create new schedule events
        const careplanWrapper = await CareplanWrapper(null, care_plan_id);
        const patientId = await careplanWrapper.getPatientId();
        const patient = await PatientWrapper(null, patientId);
        const { user_role_id: patientRoleId } = await patient.getAllInfo();

        const eventScheduleData = {
          patient_user_id: patient.getUserId(),
          type: EVENT_TYPE.WORKOUT,
          event_id: workout_id,
          start_date,
          end_date,
          participants: [userRoleId, patientRoleId],
          actor: {
            id: userId,
            user_role_id: userRoleId,
            details: { name: full_name, category },
          },
        };

        const queueService = new QueueService();

        const sqsResponse = await queueService.sendMessage(eventScheduleData);

        Log.debug("sqsResponse ---> ", sqsResponse);

        return raiseSuccess(
          res,
          200,
          { ...(await workout.getReferenceInfo()) },
          "Workout updated successfully"
        );
      }
    } catch (error) {
      Log.debug("update 500", error);
      return raiseServerError(res);
    }
  };

  delete = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { params: { id } = {} } = req;

      const workoutService = new WorkoutService();

      // check if diet exists
      const workoutExists = (await workoutService.findOne({ id })) || null;

      if (!workoutExists) {
        return raiseClientError(
          res,
          422,
          {},
          "Please select a valid workout to delete"
        );
      }

      const isDeleted = await workoutService.delete({ id });

      let workoutApiData = {};

      if (isDeleted) {
        const workoutWrapper = await WorkoutWrapper({ id });
        workoutApiData[workoutWrapper.getId()] = workoutWrapper.getBasicInfo();
        return raiseSuccess(
          res,
          200,
          {
            workouts: {
              ...workoutApiData,
            },
          },
          "Workout deleted successfully"
        );
      } else {
        return raiseClientError(
          res,
          422,
          {},
          "Please select a valid workout to delete"
        );
      }
    } catch (error) {
      Log.debug("delete 500", error);
      return raiseServerError(res);
    }
  };

  updateTotalCalories = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { query, userDetails } = req;
      Log.debug("request query, body", { query });

      const { id: workout_id, total_calories = 0 } = query || {};

      const workoutService = new WorkoutService();

      const workoutExists =
        (await workoutService.findOne({ id: workout_id })) || null;

      if (!workoutExists) {
        return raiseClientError(
          res,
          422,
          {},
          `No Matching Workout Details Found`
        );
      }

      const isUpdated = await workoutService.updateWorkotTotalCalories({
        total_calories,
        workout_id,
      });

      const workout = await WorkoutWrapper({ id: workout_id });
      return raiseSuccess(
        res,
        200,
        { ...(await workout.getReferenceInfo()) },
        "Workout Total Calories updated successfully"
      );
    } catch (error) {
      Log.debug("update cal 500", error);
      return raiseServerError(res);
    }
  };

  details = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      // get repetition ids
      const repetitionService = new RepetitionService();

      const { count, rows: repetitions = [] } =
        (await repetitionService.findAndCountAll()) || {};
      if (count) {
        let allRepetitions = {};

        for (let index = 0; index < repetitions.length; index++) {
          const { id, type } = repetitions[index] || {};
          allRepetitions[id] = { id, type };
        }

        return raiseSuccess(
          res,
          200,
          {
            repetitions: {
              ...allRepetitions,
            },
            days: DAYS,
            start_time: {
              hours: process.config.app.workout_start_hours,
              minutes: process.config.app.workout_start_minutes,
            },
          },
          "Workout details fetched successfully"
        );
      } else {
        return raiseSuccess(
          res,
          201,
          {},
          "No repetition present at the moment"
        );
      }
    } catch (error) {
      Log.debug("details 500", error);
      return raiseServerError(res);
    }
  };

  getAll = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { query, userDetails } = req;
      Log.debug("request query", query);

      const { patient_id = null } = query || {};
      const { userData: { category } = {}, userCategoryId } = userDetails;

      if (
        (category === USER_CATEGORY.DOCTOR || category === USER_CATEGORY.HSP) &&
        !patient_id
      ) {
        return raiseClientError(
          res,
          422,
          {},
          "Please select patient to continue"
        );
      }

      let getAllCareplanQuery = {};

      if (category === USER_CATEGORY.PATIENT) {
        getAllCareplanQuery = {
          patient_id: userCategoryId,
        };
      } else if (
        category === USER_CATEGORY.DOCTOR ||
        category === USER_CATEGORY.HSP
      ) {
        getAllCareplanQuery = {
          patient_id,
          // TODO: Check if the below line is correct, else remove it
          doctor_id: userCategoryId,
        };
      }

      const allCarePlans =
        (await carePlanService.getMultipleCarePlanByData(
          getAllCareplanQuery
        )) || [];

      if (allCarePlans.length > 0) {
        let carePlanIds = [];
        for (let index = 0; index < allCarePlans.length; index++) {
          const { id } = allCarePlans[index];
          carePlanIds.push(id);
        }

        // get all diets
        const workoutService = new WorkoutService();
        const { count: totalWorkouts, rows: allWorkouts = [] } =
          await workoutService.findAndCountAll({
            where: { care_plan_id: carePlanIds },
          });

        if (totalWorkouts) {
          let allWorkoutData = {},
            // allWorkoutExerciseGroupMappings = {},
            allExerciseGroups = {},
            allExerciseDetails = {},
            allExercises = {},
            allRepetitions = {};
          for (let index = 0; index < allWorkouts.length; index++) {
            const workout = await WorkoutWrapper({ data: allWorkouts[index] });

            const {
              workouts,
              // workout_exercise_group_mappings,
              exercise_groups,
              exercise_details,
              exercises,
              repetitions,
            } = await workout.getReferenceInfo();
            allWorkoutData = { ...allWorkoutData, ...workouts };
            // allWorkoutExerciseGroupMappings = {
            //   ...allWorkoutExerciseGroupMappings,
            //   ...workout_exercise_group_mappings,
            // };
            allExerciseGroups = { ...allExerciseGroups, ...exercise_groups };
            allExerciseDetails = { ...allExerciseDetails, ...exercise_details };
            allExercises = { ...allExercises, ...exercises };
            allRepetitions = { ...allRepetitions, ...repetitions };
          }

          // exercise contents
          const exerciseContentService = new ExerciseContentService();
          const { count: totalExerciseContent, rows: exerciseContents = [] } =
            (await exerciseContentService.findAndCountAll({
              exercise_id: Object.keys(allExercises),
              creator_id: userCategoryId,
              creator_type: category,
            })) || {};

          let allExerciseContents = {};
          if (totalExerciseContent) {
            for (let index = 0; index < exerciseContents.length; index++) {
              const exerciseContent = await ExerciseContentWrapper({
                data: exerciseContents[index],
              });
              allExerciseContents[exerciseContent.getId()] =
                exerciseContent.getBasicInfo();
            }
          }

          return raiseSuccess(
            res,
            200,
            {
              workouts: allWorkoutData,
              // workout_exercise_group_mappings: allWorkoutExerciseGroupMappings,
              exercise_groups: allExerciseGroups,
              exercise_details: allExerciseDetails,
              exercises: allExercises,
              repetitions: allRepetitions,
              exercise_contents: allExerciseContents,
            },
            "Workouts fetched successfully"
          );
        } else {
          return raiseSuccess(
            res,
            201,
            {},
            "No active exercises present for the patient at the moment"
          );
        }
      } else {
        return raiseSuccess(
          res,
          201,
          {},
          "No active treatment plans present for the patient at the moment"
        );
      }
    } catch (error) {
      Log.debug("getAll 500", error);
      return raiseServerError(res);
    }
  };

  get = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { params, userDetails } = req;
      Log.debug("get request params", { params });
      const { id } = params || {};

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
          creator_type: [USER_CATEGORY.DOCTOR, USER_CATEGORY.HSP],
        };
      }

      const workoutService = new WorkoutService();

      const workoutExists = (await workoutService.findOne({ id })) || null;

      if (!workoutExists) {
        return raiseClientError(
          res,
          422,
          {},
          "Workout does not exists for the given id"
        );
      }

      const workout = await WorkoutWrapper({ id });
      const { exercises, exercise_groups, exercise_details } =
        await workout.getReferenceInfo();

      // exercise contents
      const exerciseContentService = new ExerciseContentService();
      const { count: totalExerciseContent, rows: exerciseContents = [] } =
        (await exerciseContentService.findAndCountAll({
          exercise_id: Object.keys(exercises),
          ...auth,
        })) || {};

      let allExerciseContents = {};
      let allExerciseContentMappings = {};
      let workoutExerciseGroupsTotalCalories = 0;

      if (totalExerciseContent) {
        for (let index = 0; index < exerciseContents.length; index++) {
          const exerciseContent = await ExerciseContentWrapper({
            data: exerciseContents[index],
          });
          allExerciseContents[exerciseContent.getId()] =
            exerciseContent.getBasicInfo();
          allExerciseContentMappings[exerciseContent.getExerciseId()] =
            exerciseContent.getId();
        }
      }

      // workout responses
      const workoutResponsesService = new WorkoutResponsesService();
      const { count: totalWorkoutResponses, rows: workoutResponses } =
        await workoutResponsesService.findAndCountAll({
          workout_id: id,
        });

      let allWorkoutResponses = {};
      let allScheduleEvents = {};
      let allWorkoutResponseExerciseGroups = {};

      if (totalWorkoutResponses) {
        for (let index = 0; index < totalWorkoutResponses; index++) {
          const workoutResponse = await WorkoutResponseWrapper({
            data: workoutResponses[index],
          });

          const { workout_responses, schedule_events } =
            await workoutResponse.getReferenceInfo();
          allWorkoutResponseExerciseGroups[
            workoutResponse.getExerciseGroupId()
          ] = workoutResponse.getId();

          allWorkoutResponses = {
            ...allWorkoutResponses,
            ...workout_responses,
          };
          allScheduleEvents = { ...allScheduleEvents, ...schedule_events };
        }
      }

      let workout_exercise_groups = [];

      for (const exerciseGroupId of Object.keys(exercise_groups)) {
        const {
          basic_info: { id: exercise_group_id, exercise_detail_id } = {},
          sets = null,
          details = {},
        } = exercise_groups[exerciseGroupId] || {};

        const { basic_info: { exercise_id } = {}, calorific_value = 0 } =
          exercise_details[exercise_detail_id] || {};

        if (sets) {
          workoutExerciseGroupsTotalCalories =
            workoutExerciseGroupsTotalCalories + sets * calorific_value;
        }

        const exerciseContentId =
          allExerciseContentMappings[exercise_id] || null;

        const workoutResponseId =
          allWorkoutResponseExerciseGroups[exercise_group_id] || null;

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
          workout_exercise_groups,
          exercise_contents: allExerciseContents,
          workout_responses: allWorkoutResponses,
          schedule_events: allScheduleEvents,
          exercise_groups_total_calories: workoutExerciseGroupsTotalCalories,
        },
        "Workout details fetched successfully"
      );
    } catch (error) {
      Log.debug("get 500", error);
      return raiseServerError(res);
    }
  };

  timeline = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { params: { id } = {} } = req;

      const workoutService = new WorkoutService();
      const eventService = new EventService();

      const workoutResponseService = new WorkoutResponseService();
      // get workout and details
      const workoutExists = await workoutService.findOne({ id });

      if (!workoutExists) {
        return raiseClientError(
          res,
          422,
          {},
          "Exercises does not exists for the mentioned id"
        );
      }

      const workout = await WorkoutWrapper({ id });

      const { exercise_groups } = await workout.getReferenceInfo();

      // get events
      const completeEvents = await eventService.getAllPassedByData({
        event_id: id,
        event_type: EVENT_TYPE.WORKOUT,
        date: workout.getStartDate(),
        sort: "DESC",
        paranoid: false,
      });

      let dateWiseWorkoutData = {};

      const timelineDates = [];

      if (completeEvents.length > 0) {
        for (let index = 0; index < completeEvents.length; index++) {
          const event = await EventWrapper(completeEvents[index]);

          const { count: totalWorkoutResponses, rows: workoutResponses = [] } =
            await workoutResponseService.findAndCountAll({
              where: { schedule_event_id: event.getScheduleEventId() },
            });

          let allWorkoutResponses = {};
          let allWorkoutResponseIds = [];

          if (totalWorkoutResponses) {
            for (
              let innerIndex = 0;
              innerIndex < totalWorkoutResponses;
              innerIndex++
            ) {
              const workoutResponse = await WorkoutResponseWrapper({
                data: workoutResponses[innerIndex],
              });

              const { workout_responses, workout_response_id } =
                (await workoutResponse.getReferenceInfo()) || {};

              allWorkoutResponses = {
                ...allWorkoutResponses,
                ...workout_responses,
              };
              allWorkoutResponseIds.push(workout_response_id);
            }
          }

          let eventData = {
            ...event.getAllInfo(),
            workout_responses: allWorkoutResponses,
            workout_response_ids: allWorkoutResponseIds,
            total: Object.keys(exercise_groups).length,
            complete: allWorkoutResponseIds.length,
          };

          if (dateWiseWorkoutData.hasOwnProperty(event.getDate())) {
            dateWiseWorkoutData[event.getDate()].push({ ...eventData });
          } else {
            dateWiseWorkoutData[event.getDate()] = [];
            dateWiseWorkoutData[event.getDate()].push({ ...eventData });
            timelineDates.push(event.getDate());
          }
        }

        return raiseSuccess(
          res,
          200,
          {
            workout_timeline: {
              ...dateWiseWorkoutData,
            },
            workout_date_ids: timelineDates,
          },
          "Exercises timeline fetched successfully"
        );
      } else {
        return raiseSuccess(
          res,
          200,
          {},
          "No event scheduled yet for the exercises"
        );
      }
    } catch (error) {
      Log.debug("timeline 500", error);
      return raiseServerError(res);
    }
  };
}

export default new WorkoutController();
