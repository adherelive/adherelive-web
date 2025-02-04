import Controller from "../../index";

import { createLogger } from "../../../../libs/logger";

// services
import ExerciseService from "../../../services/exercises/exercise.service";
import ExerciseDetailService from "../../../services/exerciseDetails/exerciseDetail.service";
import ExerciseContentService from "../../../services/exerciseContents/exerciseContent.service";

// wrappers
import ExerciseWrapper from "../../../apiWrapper/mobile/exercises";
import ExerciseContentWrapper from "../../../apiWrapper/mobile/exerciseContents";

import * as UploadHelper from "../../../helper/uploadDocuments";
import { DOCUMENT_PARENT_TYPE } from "../../../../constant";

const logger = createLogger("MOBILE > EXERCISE > CONTROLLER");

class ExerciseController extends Controller {
  constructor() {
    super();
  }

  create = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { body, userDetails } = req;
      logger.debug("REQUEST body", body);
      const {
        repetition_id,
        repetition_value,
        name,
        calorific_value,
        video = {},
      } = body || {};

      const { userData: { category } = {}, userCategoryId } = userDetails || {};

      const exerciseService = new ExerciseService();
      const exerciseDetailService = new ExerciseDetailService();
      const exerciseContentService = new ExerciseContentService();

      // todo: check if exercise with name already exists
      const exerciseExists =
        (await exerciseService.findOne({
          name,
          auth: {
            creator_id: userCategoryId,
            creator_type: category,
          },
        })) || null;

      let exerciseId = null,
        detailId = null;

      if (exerciseExists) {
        // create exercise detail only
        const { id } = exerciseExists || {};

        const exerciseDetailExists =
          (await exerciseDetailService.findOne({
            exercise_id: id,
            repetition_id,
            // repetition_value,
            auth: {
              creator_id: userCategoryId,
              creator_type: category,
            },
          })) || null;

        // check if exercise detail already exists
        if (exerciseDetailExists) {
          return raiseClientError(
            res,
            422,
            {},
            "Excercise and detail already exists for the user"
          );
        } else {
          const exerciseDetailId =
            (await exerciseDetailService.create({
              exerciseDetails: {
                exercise_id: id,
                repetition_id,
                repetition_value,
                calorific_value,
              },
              auth: {
                creator_id: userCategoryId,
                creator_type: category,
              },
            })) || null;
          if (exerciseDetailId) {
            exerciseId = id;
            detailId = exerciseDetailId;
          }
        }
      } else {
        const { id = null, detail_id = null } =
          (await exerciseService.create({
            exercise: {
              name,
            },
            exercise_content: {
              video,
            },
            auth: {
              creator_id: userCategoryId,
              creator_type: category,
            },
            exercise_details: {
              repetition_id,
              repetition_value,
              calorific_value,
            },
          })) || null;

        if (id) {
          exerciseId = id;
        }

        if (detail_id) {
          detailId = detail_id;
        }
      }

      if (exerciseId) {
        const exercise = await ExerciseWrapper({ id: exerciseId });

        let exerciseContentData = {};
        const exerciseContentExists =
          (await exerciseContentService.findOne({
            exercise_id: exerciseId,
            creator_id: userCategoryId,
            creator_type: category,
          })) || null;

        if (exerciseContentExists) {
          const exerciseContentWrapper = await ExerciseContentWrapper({
            exercise_id: exerciseId,
            auth: { creator_id: userCategoryId, creator_type: category },
          });
          exerciseContentData[exerciseContentWrapper.getId()] =
            exerciseContentWrapper.getBasicInfo();
        }

        return raiseSuccess(
          res,
          200,
          {
            ...(await exercise.getReferenceInfo()),
            exercise_contents: exerciseContentData,
            exercise_id: exerciseId,
            exercise_detail_id: detailId,
          },
          "Exercise created successfully"
        );
      } else {
        return raiseClientError(res, 422, {}, "Please check details entered");
      }
    } catch (error) {
      logger.debug("create 500 - exercise created success", error);
      return raiseServerError(res);
    }
  };

  update = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { params, body, userDetails } = req;
      logger.debug("REQUEST ", { params, body });
      const { id } = params;
      let exerciseId = null,
        detailId = null;

      const {
        name,
        // considering 1 exercise detail update
        exercise_detail_id = null,
        repetition_id,
        repetition_value,
        calorific_value,
        video = {},
      } = body || {};

      const { userData: { category } = {}, userCategoryId } = userDetails || {};

      const exerciseService = new ExerciseService();
      const exerciseContentService = new ExerciseContentService();

      // todo: check if exercise with name already exists
      const exerciseExists =
        (await exerciseService.findOne({
          name,
          auth: {
            creator_id: userCategoryId,
            creator_type: category,
          },
        })) || null;

      if (exerciseExists) {
        const { id: existing_exercise_id } = exerciseExists || {};

        if (parseInt(id) !== existing_exercise_id) {
          return raiseClientError(
            res,
            422,
            {},
            `Exercise already exists for name : ${name}`
          );
        }
      }

      const {
        isUpdated: isExerciseUpdated = false,
        exercise_id,
        detail_id,
      } = (await exerciseService.update({
        exercise: { name },
        id,
        exerciseDetails: {
          exercise_detail_id,
          data: { repetition_id, repetition_value, calorific_value },
        },
        exercise_content: {
          video,
        },
        auth: {
          creator_id: userCategoryId,
          creator_type: category,
        },
      })) || false;

      exerciseId = exercise_id;
      detailId = detail_id;
      if (isExerciseUpdated) {
        const updatedExercise = await ExerciseWrapper({ id });

        let exerciseContentData = {};
        const exerciseContentExists =
          (await exerciseContentService.findOne({
            exercise_id: id,
            creator_id: userCategoryId,
            creator_type: category,
          })) || null;

        if (exerciseContentExists) {
          const exerciseContentWrapper = await ExerciseContentWrapper({
            exercise_id: id,
            auth: { creator_id: userCategoryId, creator_type: category },
          });
          exerciseContentData[exerciseContentWrapper.getId()] =
            exerciseContentWrapper.getBasicInfo();
        }

        return raiseSuccess(
          res,
          200,
          {
            ...(await updatedExercise.getReferenceInfo()),
            exercise_id: exerciseId,
            exercise_detail_id: detailId,
            exercise_contents: exerciseContentData,
          },
          "Exercise updated successfully"
        );
      } else {
        return raiseClientError(res, 422, {}, "Please check details entered");
      }
    } catch (error) {
      logger.debug("update 500", error);
      return raiseServerError(res);
    }
  };
  /* todo: can add limit to search results at a time */
  search = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { query, userDetails } = req;
      logger.debug("REQUEST query", query);
      const { name } = query || {};

      const { userData: { category } = {}, userCategoryId } = userDetails || {};

      const exerciseService = new ExerciseService();

      const { rows: searchedExercises = [] } =
        (await exerciseService.findAndCountAll({
          query: exerciseService.queryBuilder({ search: name }),
          auth: {
            creator_id: userCategoryId,
            creator_type: category,
          },
        })) || null;

      let allExercises = {};
      let allExerciseDetails = {};
      let allRepetitions = {};

      if (searchedExercises.length > 0) {
        let exerciseIds = [];
        for (let index = 0; index < searchedExercises.length; index++) {
          const exercise = await ExerciseWrapper({
            data: searchedExercises[index],
          });
          const { exercises, exercise_details, repetitions } =
            await exercise.getReferenceInfo();
          allExercises = { ...allExercises, ...exercises };
          allExerciseDetails = { ...allExerciseDetails, ...exercise_details };
          allRepetitions = { ...allRepetitions, ...repetitions };
          exerciseIds.push(exercise.getId());
        }

        // exercise contents
        const exerciseContentService = new ExerciseContentService();
        const { count: totalExerciseContent, rows: exerciseContents = [] } =
          (await exerciseContentService.findAndCountAll({
            exercise_id: exerciseIds,
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
            exercises: allExercises,
            exercise_details: allExerciseDetails,
            repetitions: allRepetitions,
            exercise_contents: allExerciseContents,
          },
          "Searched exercise fetched successfully"
        );
      } else {
        return raiseSuccess(
          res,
          201,
          {},
          "No exercise exists for the searched name"
        );
      }
    } catch (error) {
      logger.debug("search 500", error);
      return raiseServerError(res);
    }
  };

  uploadContent = async (req, res) => {
    const { raiseSuccess, raiseServerError, raiseClientError } = this;
    try {
      const { file, userDetails: { userId } = {} } = req;

      if (!file) {
        return raiseClientError(res, 422, {}, "Please select files to upload");
      }
      let documents = [];

      const { originalname } = file || {};
      const fileUrl = await UploadHelper.upload({
        file,
        id: userId,
        folder: DOCUMENT_PARENT_TYPE.EXERCISE_CONTENT,
      });
      documents.push({
        name: originalname,
        file: fileUrl,
      });

      return raiseSuccess(
        res,
        200,
        {
          documents,
        },
        "Content uploaded successfully"
      );
    } catch (error) {
      logger.debug("uploadContent 500", error);
      return raiseServerError(res);
    }
  };
}

export default new ExerciseController();
