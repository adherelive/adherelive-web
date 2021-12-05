import {Op} from "sequelize";

import Database from "../../../libs/mysql";
import {USER_CATEGORY} from "../../../constant";

import {TABLE_NAME} from "../../models/exercise";
// import { TABLE_NAME as exerciseUserCreatedMappingTableName } from "../../models/exerciseUserCreatedMapping";
import {TABLE_NAME as exerciseDetailsTableName} from "../../models/exerciseDetails";
import {
  TABLE_NAME as exerciseContentTableName,
  VIDEO_TYPES,
} from "../../models/exerciseContents";
import {TABLE_NAME as repetitionTableName} from "../../models/exerciseRepetition";
import {getFilePath} from "../../helper/filePath";

export default class ExerciseService {
  create = async ({
                    exercise,
                    exercise_details,
                    exercise_content,
                    auth,
                    transaction: continuedTransaction = null,
                  }) => {
    const transaction = continuedTransaction
      ? continuedTransaction
      : await Database.initTransaction();
    try {
      // create exercise + details
      const createdExercise =
        (
          await Database.getModel(TABLE_NAME).create(
            {...exercise, ...auth},
            {
              transaction,
            }
          )
        ).get({plain: true}) || null;
      
      const {id} = createdExercise || null;
      
      // create exercise details
      
      const createdExerciseDetail = await Database.getModel(
        exerciseDetailsTableName
      ).create(
        {exercise_id: id, ...exercise_details, ...auth},
        {
          transaction,
        }
      );
      const {id: detail_id = null} = createdExerciseDetail || {};
      
      // create exercise content
      const {
        video: {
          content_type: video_content_type = VIDEO_TYPES.NONE,
          content: video_content,
        } = {},
      } = exercise_content || {};
      
      if (video_content_type !== VIDEO_TYPES.NONE) {
        const videoContent =
          video_content_type === VIDEO_TYPES.UPLOAD
            ? getFilePath(video_content)
            : video_content;
        await Database.getModel(exerciseContentTableName).create(
          {
            exercise_id: id,
            video_content_type,
            video_content: videoContent,
            ...auth,
          },
          {
            transaction,
          }
        );
      }
      
      await transaction.commit();
      return {id, detail_id};
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };
  
  update = async ({
                    exercise = null,
                    id,
                    exerciseDetails,
                    exercise_content,
                    auth,
                    transaction: continuedTransaction = null,
                  }) => {
    const transaction = continuedTransaction
      ? continuedTransaction
      : await Database.initTransaction();
    try {
      if (exercise) {
        // To prevent the admin and user created exercise update, following check was added
        const exerciseExists =
          (await Database.getModel(TABLE_NAME).findOne({
            where: {id},
          })) || null;
        
        if (exerciseExists) {
          const {creator_type} = exerciseExists || {};
          if (creator_type !== USER_CATEGORY.ADMIN) {
            await Database.getModel(TABLE_NAME).update(exercise, {
              where: {id},
              transaction,
            });
          }
        }
      }
      
      const {data, exercise_detail_id} = exerciseDetails || {};
      
      const {repetition_id} = data || {};
      
      // check for exercise detail already exists
      const exerciseDetailExists =
        (await Database.getModel(exerciseDetailsTableName).findOne({
          where: {
            repetition_id,
            [Op.or]: [auth, {creator_type: USER_CATEGORY.ADMIN}],
          },
        })) || null;
      
      let detail_id = null;
      
      if (exercise_detail_id && exerciseDetailExists) {
        // update
        const {creator_type} = exerciseDetailExists || {};
        // To prevent the admin and user created exercise update, following check was added
        if (creator_type !== USER_CATEGORY.ADMIN) {
          await Database.getModel(exerciseDetailsTableName).update(data, {
            where: {
              id: exercise_detail_id,
            },
            transaction,
          });
        }
        detail_id = exercise_detail_id;
      } else {
        // create
        const detailRecord = await Database.getModel(
          exerciseDetailsTableName
        ).create(
          {...data, exercise_id: id, ...auth},
          {
            transaction,
          }
        );
        
        const {id: record_id = null} = detailRecord || {};
        detail_id = record_id;
      }
      
      // exercise_content
      const {
        video: {
          content_type: video_content_type = VIDEO_TYPES.NONE,
          content: video_content,
        } = {},
      } = exercise_content || {};
      
      const videoContent =
        video_content_type === VIDEO_TYPES.UPLOAD
          ? getFilePath(video_content)
          : video_content;
      
      // check for existing
      const exerciseContentExists = await Database.getModel(
        exerciseContentTableName
      ).findOne({
        where: {
          exercise_id: id,
          ...auth,
        },
      });
      
      if (exerciseContentExists) {
        await Database.getModel(exerciseContentTableName).update(
          {video_content_type, video_content: videoContent},
          {
            where: {
              exercise_id: id,
              ...auth,
            },
            transaction,
          }
        );
      } else {
        if (video_content_type !== VIDEO_TYPES.NONE) {
          await Database.getModel(exerciseContentTableName).create(
            {
              exercise_id: id,
              video_content_type,
              video_content: videoContent,
              ...auth,
            },
            {
              transaction,
            }
          );
        }
      }
      
      await transaction.commit();
      
      return {isUpdated: true, exercise_id: id, detail_id};
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };
  
  delete = async () => {
  };
  
  findOne = async ({auth = {}, id = null, ...data}) => {
    try {
      let whereQuery = {};
      if (id) {
        whereQuery = {
          id,
        };
      } else {
        whereQuery = {
          ...data,
          [Op.or]: [
            auth,
            {
              creator_type: USER_CATEGORY.ADMIN,
            },
          ],
        };
      }
      
      return await Database.getModel(TABLE_NAME).findOne({
        where: whereQuery,
        include: [
          {
            model: Database.getModel(exerciseDetailsTableName),
            include: [Database.getModel(repetitionTableName)],
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  };
  
  findAndCountAll = async ({query = {}, auth = {}, limit, offset}) => {
    try {
      return (
        (await Database.getModel(TABLE_NAME).findAndCountAll({
          where: query,
          include: [
            {
              model: Database.getModel(exerciseDetailsTableName),
              where: {
                [Op.or]: [
                  {
                    creator_type: USER_CATEGORY.ADMIN,
                  },
                  auth,
                ],
              },
              include: [Database.getModel(repetitionTableName)],
            },
          ],
          // limit,
          // offset
        })) || {}
      );
    } catch (error) {
      throw error;
    }
  };
  
  // query builders
  queryBuilder = ({search = null}) => {
    if (search) {
      return {
        [Op.or]: [
          {
            name: {
              [Op.startsWith]: `%${search}`,
            },
          },
          {
            name: {
              [Op.like]: `%${search}%`,
            },
          },
        ],
      };
    }
    return {};
  };
}

/*

Executing (default): SELECT `exercises`.`id`, `exercises`.`name`, `exercises`.`created_at` AS `createdAt`, `exercises`.`updated_at` AS `updatedAt`, `exercises`.`deleted_at` AS `deletedAt`, `exercise_details`.`id` AS `exercise_details.id`, `exercise_details`.`exercise_id` AS `exercise_details.exercise_id`, `exercise_details`.`repetition_id` AS `exercise_details.repetition_id`, `exercise_details`.`calorific_value` AS `exercise_details.calorific_value`, `exercise_details`.`created_at` AS `exercise_details.createdAt`, `exercise_details`.`updated_at` AS `exercise_details.updatedAt`, `exercise_details`.`deleted_at` AS `exercise_details.deletedAt` 
FROM `exercises` AS `exercises` LEFT OUTER JOIN `exercise_details` AS `exercise_details` ON `exercises`.`id` = `exercise_details`.`exercise_id` AND (`exercise_details`.`deleted_at` IS NULL) LEFT OUTER JOIN `exercise_user_created_mappings` AS `exercise_user_created_mapping` ON `exercises`.`id` = `exercise_user_created_mapping`.`exercise_id` AND (`exercise_user_created_mapping`.`deleted_at` IS NULL) WHERE (`exercises`.`deleted_at` IS NULL AND (`exercises`.`name` = 'exercise 1' AND `exercise_user_created_mapping`.`exercise_id` IS NULL)) LIMIT 1;

Executing (default): SELECT `exercises`.*, `exercise_details`.`id` AS `exercise_details.id`, `exercise_details`.`exercise_id` AS `exercise_details.exercise_id`, `exercise_details`.`repetition_id` AS `exercise_details.repetition_id`, `exercise_details`.`calorific_value` AS `exercise_details.calorific_value`, `exercise_details`.`created_at` AS `exercise_details.createdAt`, `exercise_details`.`updated_at` AS `exercise_details.updatedAt`, `exercise_details`.`deleted_at` AS `exercise_details.deletedAt`
 FROM (SELECT `exercises`.`id`, `exercises`.`name`, `exercises`.`created_at` AS `createdAt`, `exercises`.`updated_at` AS `updatedAt`, `exercises`.`deleted_at` AS `deletedAt` FROM `exercises` AS `exercises` WHERE (`exercises`.`deleted_at` IS NULL AND (`exercises`.`name` = 'exercise 1' AND `exercise_user_created_mapping`.`exercise_id` IS NULL)) LIMIT 1) AS `exercises` LEFT OUTER JOIN `exercise_details` AS `exercise_details` ON `exercises`.`id` = `exercise_details`.`exercise_id` AND (`exercise_details`.`deleted_at` IS NULL) LEFT OUTER JOIN `exercise_user_created_mappings` AS `exercise_user_created_mapping` ON `exercises`.`id` = `exercise_user_created_mapping`.`exercise_id` AND (`exercise_user_created_mapping`.`deleted_at` IS NULL);

*/
