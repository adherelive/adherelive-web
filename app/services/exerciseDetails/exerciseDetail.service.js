import { Op } from "sequelize";

import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/exerciseDetails";
import { TABLE_NAME as repetitionTableName } from "../../models/exerciseRepetition";
import { TABLE_NAME as exerciseTableName } from "../../models/exercise";

import { USER_CATEGORY } from "../../../constant";

export default class ExerciseDetailService {
  create = async ({
    exerciseDetails,
    auth,
    transaction: continuedTransaction = null,
  }) => {
    const transaction = continuedTransaction
      ? continuedTransaction
      : await Database.initTransaction();
    try {
      const createdExerciseDetail =
        (await Database.getModel(TABLE_NAME).create(
          { ...exerciseDetails, ...auth },
          {
            transaction,
          }
        )) || null;

      const { id } = createdExerciseDetail || {};

      await transaction.commit();
      return id;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  findOne = async ({ auth = {}, id, ...data }) => {
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

      return (
        (await Database.getModel(TABLE_NAME).findOne({
          where: whereQuery,
          include: [Database.getModel(repetitionTableName)],
        })) || null
      );
    } catch (error) {
      throw error;
    }
  };

  findAndCountAll = async ({ query = {}, auth = {}, limit, offset }) => {
    try {
      return (
        (await Database.getModel(TABLE_NAME).findAndCountAll({
          where: query,
          include: [
            Database.getModel(repetitionTableName),
            Database.getModel(exerciseTableName),
          ],
          // limit,
          // offset
        })) || {}
      );
    } catch (error) {
      throw error;
    }
  };

  queryBuilder = ({ exercise_id = null, auth = {} }) => {
    if (exercise_id) {
      return {
        exercise_id,
        [Op.or]: [
          {
            creator_type: USER_CATEGORY.ADMIN,
          },
          auth,
        ],
      };
    }
    return {};
  };
}
