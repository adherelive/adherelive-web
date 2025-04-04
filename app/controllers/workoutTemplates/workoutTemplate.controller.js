import Controller from "../index";
import { createLogger } from "../../../libs/logger";

// Services
import WorkoutTemplateService from "../../services/workoutTemplates/workoutTemplate.service";

// Wrappers
import WorkoutTemplateWrapper from "../../apiWrapper/mobile/workoutTemplates";

const logger = createLogger("WEB > WORKOUT_TEMPLATE > CONTROLLER");

class WorkoutTemplateController extends Controller {
  constructor() {
    super();
  }

  create = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { body, userDetails } = req;
      logger.debug("create request", body);

      const { name, exercise_detail_ids: exerciseDetails = [] } = body || {};
      const { userData: { category } = {}, userCategoryId } = userDetails || {};

      const workoutTemplateService = new WorkoutTemplateService();

      // check if name already exists
      const workoutTemplateExistsForName =
        (await workoutTemplateService.findOne({
          name,
        })) || null;

      if (workoutTemplateExistsForName) {
        return raiseClientError(
          res,
          422,
          {},
          `Workout Template already exists with ${name}`
        );
      }

      const workoutTemplateId =
        (await workoutTemplateService.create({
          workoutTemplate: {
            name,
            creator_id: userCategoryId,
            creator_type: category,
          },
          exerciseDetails,
        })) || null;

      if (workoutTemplateId !== null) {
        const workoutTemplates = await WorkoutTemplateWrapper({
          id: workoutTemplateId,
        });

        return raiseSuccess(
          res,
          200,
          {
            ...(await workoutTemplates.getReferenceInfo()),
          },
          "Workout Template created successfully"
        );
      } else {
        return raiseClientError(
          res,
          422,
          {},
          "Please verify the details shared and try again"
        );
      }
    } catch (error) {
      logger.error("create 500 - workout controller", error);
      return raiseServerError(res);
    }
  };

  update = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { body, params, userDetails } = req;
      logger.debug("update request", { body, params });

      const { id } = params || {};
      const { name, exercise_detail_ids: exerciseDetails = [] } = body || {};
      const { userData: { category } = {}, userCategoryId } = userDetails || {};

      const workoutTemplateService = new WorkoutTemplateService();

      // check if name already exists
      // todo: up for discussion
      const workoutTemplateExists =
        (await workoutTemplateService.findOne({
          name,
          creator_id: userCategoryId,
          creator_type: category,
        })) || null;

      if (workoutTemplateExists) {
        const { id: existing_template_id } = workoutTemplateExists || {};

        if (parseInt(id) !== existing_template_id) {
          return raiseClientError(
            res,
            422,
            {},
            `Workout Template already exists for name : ${name}`
          );
        }
      }

      const isWorkoutTemplateUpdated =
        (await workoutTemplateService.update({
          workoutTemplate: {
            name,
          },
          exerciseDetails,
          id,
        })) || false;

      if (isWorkoutTemplateUpdated) {
        const updatedWorkoutTemplate = await WorkoutTemplateWrapper({ id });

        return raiseSuccess(
          res,
          200,
          {
            ...(await updatedWorkoutTemplate.getReferenceInfo()),
          },
          "Workout template updated successfully"
        );
      } else {
        return raiseClientError(
          res,
          422,
          {},
          "Please check the workout template selected to delete"
        );
      }
    } catch (error) {
      logger.error("update 500", error);
      return raiseServerError(res);
    }
  };

  delete = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { params } = req;
      logger.debug("delete request", params);

      const { id } = params || {};

      const workoutTemplateService = new WorkoutTemplateService();

      // check if name already exists
      const workoutTemplateExists =
        (await workoutTemplateService.findOne({
          id,
        })) || null;

      if (!workoutTemplateExists) {
        return raiseClientError(
          res,
          422,
          {},
          "Workout Template does not exists"
        );
      }

      const deleteWorkoutTemplate =
        (await workoutTemplateService.delete({ id })) || false;

      if (deleteWorkoutTemplate) {
        return raiseSuccess(
          res,
          200,
          {},
          "Workout template deleted successfully"
        );
      } else {
        return raiseClientError(
          res,
          422,
          {},
          "Please check the workout template selected to delete"
        );
      }
    } catch (error) {
      logger.error("delete 500", error);
      return raiseServerError(res);
    }
  };
}

export default new WorkoutTemplateController();
