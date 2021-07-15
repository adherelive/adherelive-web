import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/workout";
import { TABLE_NAME as exerciseGroupTableName } from "../../models/exerciseGroup";
import { TABLE_NAME as exerciseDetailTableName } from "../../models/exerciseDetails";
import { TABLE_NAME as exerciseTableName } from "../../models/exercise";
import { TABLE_NAME as repetitionTableName } from "../../models/exerciseRepetition";
import { TABLE_NAME as workoutExerciseGroupMappingTableName } from "../../models/workoutExerciseGroupMapping";
import {TABLE_NAME as scheduleEventTableName} from "../../models/scheduleEvents";
import { EVENT_TYPE } from "../../../constant";
import moment from "moment";

const DEFAULT_ORDER = [["created_at", "DESC"]];

export default class WorkoutService {
  create = async ({
    transaction: continuedTransaction = null,
    ...workoutData
  }) => {
    const transaction = continuedTransaction
      ? continuedTransaction
      : await Database.initTransaction();
    try {
      const {
        name,
        care_plan_id,
        start_date,
        end_date,
        total_calories,
        details,
        time,
        workout_exercise_groups = [],
      } = workoutData || {};
      // data for workout
      const workout = await Database.getModel(TABLE_NAME).create(
        {
          name,
          care_plan_id,
          start_date,
          end_date,
          total_calories,
          details,
          time,
        },
        {
          transaction,
        }
      );

      const { id: workout_id } = workout || {};

      // create mappings
      for (let index = 0; index < workout_exercise_groups.length; index++) {
        const currentExerciseCollection = workout_exercise_groups[index] || {};

        const {
          sets,
          exercise_detail_id,
          notes,
          // similar = [],
        } = currentExerciseCollection || {};

        // create exercise group
        const exerciseGroup = await Database.getModel(
          exerciseGroupTableName
        ).create(
          {
            sets,
            exercise_detail_id,
            details: { notes },
          },
          {
            transaction,
          }
        );

        // create workout exercise group mapping
        (await Database.getModel(workoutExerciseGroupMappingTableName).create(
          {
            // time,
            workout_id,
            exercise_group_id: exerciseGroup.id,
          },
          {
            transaction,
          }
        )) || null;
      }

      await transaction.commit();
      return workout_id;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  update = async ({
    workout_exercise_groups,
    delete_exercise_group_ids,
    workout_id,
    transaction: continuedTransaction = null,
    ...workoutData
  }) => {
    const transaction = continuedTransaction
      ? continuedTransaction
      : await Database.initTransaction();
    try {
      // delete previous workout group ids

      // delete mappings
      await Database.getModel(workoutExerciseGroupMappingTableName).destroy({
        where: {
          workout_id,
          exercise_group_id: delete_exercise_group_ids,
        },
        transaction,
      });

      // delete exercise groups
      await Database.getModel(exerciseGroupTableName).destroy({
        where: {
          id: delete_exercise_group_ids,
        },
        transaction,
      });

        for (let index = 0; index < workout_exercise_groups.length; index++) {
          const {
            exercise_group_id = null,
            sets,
            exercise_detail_id,
            notes,
          } = workout_exercise_groups[index];

          if (exercise_group_id) {
            // update
            await Database.getModel(exerciseGroupTableName).update(
              {
                sets,
                exercise_detail_id,
                details: { notes },
              },
              {
                where: { id: exercise_group_id },
                transaction,
              }
            );

            // await Database.getModel(
            //   workoutExerciseGroupMappingTableName
            // ).update(
            //   {
            //     time,
            //   },
            //   {
            //     where: {exercise_group_id},
            //     transaction,
            //   }
            // );
          } else {
            // create
            const exerciseGroup = await Database.getModel(
              exerciseGroupTableName
            ).create(
              {
                sets,
                exercise_detail_id,
                details: { notes },
              },
              {
                transaction,
              }
            );

            await Database.getModel(
              workoutExerciseGroupMappingTableName
            ).create(
              {
                // time,
                workout_id,
                exercise_group_id: exerciseGroup.id,
              },
              {
                transaction,
              }
            );
          }
        }

      // workout update
      await Database.getModel(TABLE_NAME).update(workoutData, {
        where: { id: workout_id },
        transaction,
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
      // const {
      //   count: totalExerciseGroupMappings,
      //   rows: allExerciseGroupMappings = [],
      // } = await Database.getModel(
      //   workoutExerciseGroupMappingTableName
      // ).findAndCountAll({
      //   where: {
      //     workout_id: id,
      //   },
      //   attributes: ["exercise_group_id"],
      // });

      // let exerciseGroupIds = [];
      // if (totalExerciseGroupMappings) {
      //   for (let index = 0; index < allExerciseGroupMappings.length; index++) {
      //     const { exercise_group_id } = allExerciseGroupMappings[index] || {};
      //     exerciseGroupIds.push(exercise_group_id);
      //   }
      // }

      // // exercise groups
      // await Database.getModel(exerciseGroupTableName).destroy({
      //   where: {
      //     id: exerciseGroupIds,
      //   },
      //   transaction,
      // });

      // // workout exercise group mappings
      // await Database.getModel(workoutExerciseGroupMappingTableName).destroy({
      //   where: {
      //     workout_id: id,
      //   },
      //   transaction,
      // });

      // schedule event created
      await Database.getModel(scheduleEventTableName).destroy({
        where: {
          event_id: id,
          event_type: EVENT_TYPE.WORKOUT,
        },
        transaction,
      });

      await Database.getModel(TABLE_NAME).update({expired_on:moment()},{
        where: {
            id,
        },
        transaction
      });

      // data for workout delete
      // await Database.getModel(TABLE_NAME).destroy({
      //   where: { id },
      //   transaction,
      // });

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  findOne = async (data) => {
    try {
      return await Database.getModel(TABLE_NAME).findOne({
        where: data,
        include: [
          {
            model: Database.getModel(exerciseGroupTableName),
            include: [
              {
                model: Database.getModel(exerciseDetailTableName),
                include: [
                  Database.getModel(exerciseTableName),
                  Database.getModel(repetitionTableName),
                ],
              },
            ],
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  };

  findAndCountAll = async ({ where, order = DEFAULT_ORDER, attributes }) => {
    try {
      return Database.getModel(TABLE_NAME).findAndCountAll({
        where,
        order,
        attributes,
        include: [
          {
            model: Database.getModel(exerciseGroupTableName),
            include: [
              {
                model: Database.getModel(exerciseDetailTableName),
                include: [
                  Database.getModel(exerciseTableName),
                  Database.getModel(repetitionTableName),
                ],
              },
            ],
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  };
}
