import Database from "../../../libs/mysql";

import { TABLE_NAME } from "../../models/workoutTemplate";
import { TABLE_NAME as workoutTemplateExerciseMappingTableName } from "../../models/workoutTemplateExerciseMapping";
import { TABLE_NAME as exerciseDetailTableName } from "../../models/exerciseDetails";
import { TABLE_NAME as repetitionTableName } from "../../models/exerciseRepetition";

export default class WorkoutTemplateService {
  create = async ({
    workoutTemplate = {},
    exerciseDetails = [],
    transaction: continuedTransaction = null
  }) => {
    const transaction = continuedTransaction
      ? continuedTransaction
      : await Database.initTransaction();
    try {
      const workoutTemplateCreated =
        (await Database.getModel(TABLE_NAME).create(workoutTemplate, {
          raw: true,
          transaction
        })) || null;

      const { id: workout_template_id } = workoutTemplateCreated || {};

      // create exercise detail mappings
      const exerciseDetailMapping = exerciseDetails.map(id => {
        return { workout_template_id, exercise_detail_id: id };
      });

      await Database.getModel(
        workoutTemplateExerciseMappingTableName
      ).bulkCreate(exerciseDetailMapping, {
        raw: true,
        transaction
      });
      await transaction.commit();
      return workout_template_id;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  update = async ({
    workoutTemplate = {},
    exerciseDetails = [],
    id: workout_template_id,
    transaction: continuedTransaction = null
  }) => {
    const transaction = continuedTransaction
      ? continuedTransaction
      : await Database.initTransaction();
    try {
      (await Database.getModel(TABLE_NAME).update(workoutTemplate, {
        where: { id: workout_template_id },
        transaction
      })) || null;

      // delete existing exercise details mappings
      await Database.getModel(workoutTemplateExerciseMappingTableName).destroy({
        where: {
          workout_template_id
        },
        transaction
      });

      // create exercise detail mappings
      const exerciseDetailMapping = exerciseDetails.map(id => {
        return { workout_template_id, exercise_detail_id: id };
      });

      await Database.getModel(
        workoutTemplateExerciseMappingTableName
      ).bulkCreate(exerciseDetailMapping, {
        raw: true,
        transaction
      });
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  delete = async ({ id, transaction: continuedTransaction = null }) => {
    const transaction = continuedTransaction
      ? continuedTransaction
      : await Database.initTransaction();
    try {
      await Database.getModel(TABLE_NAME).destroy({
        where: {
          id
        },
        transaction
      });

      await Database.getModel(workoutTemplateExerciseMappingTableName).destroy({
        where: {
          workout_template_id: id
        },
        transaction
      });

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  findOne = async data => {
    try {
      return (
        (await Database.getModel(TABLE_NAME).findOne({
          where: data,
          include: [
            {
              model: Database.getModel(exerciseDetailTableName),
              include: [Database.getModel(repetitionTableName)]
            }
          ]
        })) || null
      );
    } catch (error) {
      throw error;
    }
  };

  findAndCountAll = async data => {
    try {
      return (
        (await Database.getModel(TABLE_NAME).findAndCountAll({
          where: data,
          include: [
            {
              model: Database.getModel(exerciseDetailTableName),
              include: [Database.getModel(repetitionTableName)]
            }
          ]
        })) || []
      );
    } catch (error) {
      throw error;
    }
  };
}
