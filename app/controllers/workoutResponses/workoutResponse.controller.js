import Controller from "../index";

// services
import WorkoutResponseService from "../../services/workoutResponses/workoutResponses.service";
import ExerciseContentService from "../../services/exerciseContents/exerciseContent.service";
import EventService from "../../services/scheduleEvents/scheduleEvent.service";

// wrappers
import WorkoutResponseWrapper from "../../apiWrapper/web/workoutResponse";
import WorkoutWrapper from "../../apiWrapper/web/workouts";
import EventWrapper from "../../apiWrapper/common/scheduleEvents";
import ExerciseContentWrapper from "../../apiWrapper/web/exerciseContents";
import CarePlanWrapper from "../../apiWrapper/web/carePlan";
import Logger from "../../../libs/log";

const Log = new Logger("WEB > WORKOUT_RESPONSE > CONTROLLER");

class WorkoutResponseController extends Controller {
  constructor() {
    super();
  }

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

      const workoutResponseService = new WorkoutResponseService();

      const { count: totalWorkoutResponses, rows: workoutResponses = [] } =
        await workoutResponseService.findAndCountAll({
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

      const { exercises, exercise_groups, exercise_details } =
        await workout.getReferenceInfo();
      const workoutCareplanId = await workout.getCareplanId();
      const carePlanWrapper = await CarePlanWrapper(null, workoutCareplanId);
      const careplanCreatorId = carePlanWrapper.getDoctorId();

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
          allExerciseContents[exerciseContent.getId()] =
            exerciseContent.getBasicInfo();
          allExerciseContentMappings[exerciseContent.getExerciseId()] =
            exerciseContent.getId();
        }
      }

      let allWorkoutResponseExerciseGroups = {};
      let allWorkoutResponses = {};

      for (let index = 0; index < totalWorkoutResponses; index++) {
        const workoutResponse = await WorkoutResponseWrapper({
          data: workoutResponses[index],
        });

        const { workout_responses } = await workoutResponse.getReferenceInfo();

        allWorkoutResponseExerciseGroups[workoutResponse.getExerciseGroupId()] =
          workoutResponse.getId();

        allWorkoutResponses = {
          ...allWorkoutResponses,
          ...workout_responses,
        };
      }

      let workout_exercise_groups = [],
        exerciseContentData = {};

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

        let isContentAuthCreated = false;

        if (exerciseContentId) {
          const exerciseContentWrapper = await ExerciseContentWrapper({
            id: exerciseContentId,
          });

          exerciseContentData[exerciseContentWrapper.getId()] =
            exerciseContentWrapper.getBasicInfo();

          const { creator_id } = exerciseContentWrapper.getBasicInfo();

          if (creator_id.toString() === careplanCreatorId.toString()) {
            isContentAuthCreated = true;
          }
        }

        workout_exercise_groups.push({
          exercise_group_id,
          exercise_detail_id,
          sets,
          exercise_content_id: isContentAuthCreated ? exerciseContentId : null,
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
          exercise_contents: { ...exerciseContentData },
        },
        "Workout responses fetched succesfully"
      );
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
