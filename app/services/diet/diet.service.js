import { Op } from "sequelize";

import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/diet";
import { TABLE_NAME as carePlanTableName } from "../../models/carePlan";
import { TABLE_NAME as dietFoodGroupMappingTableName } from "../../models/dietFoodGroupMapping";
import { TABLE_NAME as similiarFoodMappingTableName } from "../../models/similarFoodMapping";
import { TABLE_NAME as foodGroupTableName } from "../../models/foodGroups";
import { TABLE_NAME as scheduleEventTableName } from "../../models/scheduleEvents";
import { DAYS_INTEGER, EVENT_TYPE } from "../../../constant";
import moment from "moment";

const DEFAULT_ORDER = [["created_at", "DESC"]];

class DietService {
  // create = async (data) => {
  //   const transaction = await Database.initTransaction();
  //   try {
  //     const {
  //       name = "",
  //       care_plan_id = null,
  //       start_date = "",
  //       end_date = "",
  //       total_calories = null,
  //       details = {},
  //       diet_food_groups = [],
  //     } = data || {};

  //     const diet = await Database.getModel(TABLE_NAME).create(
  //       { name, care_plan_id, start_date, end_date, total_calories, details },
  //       {
  //         raw: true,
  //         transaction,
  //       }
  //     );

  //     // some conditions to consider: same food item should not be added
  //     // multiple times at same time.
  //     // but same food item can be added as similar food item, but it will come single entry
  //     // from frontend.

  //     // have to check that what will happen if same entry goes into food-groups.
  //     // have to create similar food groups
  //     const { id: diet_id } = diet || {};

  //     for (let index = 0; index < diet_food_groups.length; index++) {
  //       const {
  //         day = null,
  //         time = null,
  //         food_groups: food_groups_array = [],
  //         similar_food_groups = {},
  //       } = diet_food_groups[index] || {};
  //       const allFoodGroups = await Database.getModel(
  //         foodGroupTableName
  //       ).bulkCreate(food_groups_array, {
  //         raw: true,
  //         transaction,
  //       });

  //       let dietFoodGroupMappingData = [];
  //       let foodGroupToFoodItemDetailsMapping = {};
  //       for (let food_group of allFoodGroups) {
  //         const { id: food_group_id, food_item_detail_id = null } =
  //           food_group || {};
  //         dietFoodGroupMappingData.push({
  //           diet_id,
  //           food_group_id,
  //           time,
  //           day,
  //         });

  //         foodGroupToFoodItemDetailsMapping[
  //           `${time}-${day}-${food_group_id}-${diet_id}`
  //         ] = food_item_detail_id;
  //       }

  //       if (dietFoodGroupMappingData && dietFoodGroupMappingData.length) {
  //         const allDietFoodGroupMappings = await Database.getModel(
  //           dietFoodGroupMappingTableName
  //         ).bulkCreate(dietFoodGroupMappingData, {
  //           raw: true,
  //           transaction,
  //         });

  //         let reverseMapping = {};
  //         for (let allData of allDietFoodGroupMappings) {
  //           const { id, diet_id, food_group_id, time, day } = allData || {};
  //           const {
  //             [`${time}-${day}-${food_group_id}-${diet_id}`]: food_item_details_id = null,
  //           } = foodGroupToFoodItemDetailsMapping;
  //           reverseMapping[food_item_details_id] = id;
  //         }

  //         const similarFoodGroupIds = Object.keys(similar_food_groups);
  //         for (const primaryId of similarFoodGroupIds) {
  //           const { [primaryId]: relatedIds = [] } = similar_food_groups;
  //           const { [primaryId]: related_to_id } = reverseMapping || {};
  //           for (const relatedId of relatedIds) {
  //             const { [relatedId]: secondary_id } = reverseMapping || {};
  //             const similarFoodMapping = await Database.getModel(
  //               similiarFoodMappingTableName
  //             ).create(
  //               {
  //                 related_to_id,
  //                 secondary_id,
  //               },
  //               {
  //                 raw: true,
  //                 transaction,
  //               }
  //             );
  //           }
  //         }
  //       }
  //     }

  //     await transaction.commit();
  //     return diet_id;
  //   } catch (error) {
  //     await transaction.rollback();
  //     throw error;
  //   }
  // };

  createDaysDiet = async (foodGroupsForDay, diet_id, transaction) => {
    try {
      for (let time of Object.keys(foodGroupsForDay)) {
        const foodGroupsArr = foodGroupsForDay[time] || {};

        for (let index = 0; index < foodGroupsArr.length; index++) {
          const currentFoodCollection = foodGroupsArr[index] || {};

          const {
            portion_id,
            serving,
            food_item_detail_id,
            notes,
            similar = [],
          } = currentFoodCollection || {};

          // main create
          const primaryFoodGroup = await Database.getModel(
            foodGroupTableName
          ).create(
            {
              portion_id,
              serving,
              food_item_detail_id,
              details: { notes },
            },
            {
              transaction,
            }
          );

          const primaryFoodGroupMapping =
            (await Database.getModel(dietFoodGroupMappingTableName).create(
              {
                time,
                diet_id,
                food_group_id: primaryFoodGroup.id,
              },
              {
                transaction,
              }
            )) || [];

          let similarFoodGroupMappings = null;

          // similar bulkCreate
          if (similar.length > 0) {
            let similarFoodGroupBulk = [];
            for (let i = 0; i < similar.length; i++) {
              const eachFoodGroup = similar[i] || {};

              const { portion_id, serving, food_item_detail_id, notes } =
                eachFoodGroup || {};

              similarFoodGroupBulk.push({
                portion_id,
                serving,
                food_item_detail_id,
                details: { notes },
              });
            }

            // main create
            const similarFoodGroups =
              (await Database.getModel(foodGroupTableName).bulkCreate(
                similarFoodGroupBulk,
                {
                  transaction,
                }
              )) || [];

            const similarDietFoodGroupMappingBulk =
              similarFoodGroups.map((similarFoodGroup) => {
                return {
                  time,
                  diet_id,
                  food_group_id: similarFoodGroup.id,
                };
              }) || [];

            similarFoodGroupMappings =
              (await Database.getModel(
                dietFoodGroupMappingTableName
              ).bulkCreate(similarDietFoodGroupMappingBulk, { transaction })) ||
              [];
          }

          if (similarFoodGroupMappings) {
            const relatedIds =
              similarFoodGroupMappings.map((similarFoodGroupMapping) => {
                return {
                  secondary_id: similarFoodGroupMapping.id,
                  related_to_id: primaryFoodGroupMapping.id,
                };
              }) || [];

            const similarFoodMapping = await Database.getModel(
              similiarFoodMappingTableName
            ).bulkCreate(relatedIds, {
              raw: true,
              transaction,
            });
          }
        }
      }

      return true;
    } catch (error) {
      throw error;
    }
  };

  create = async (data) => {
    const transaction = await Database.initTransaction();
    try {
      const {
        name,
        care_plan_id,
        start_date,
        end_date,
        total_calories,
        diet_food_groups = {},
        details,
      } = data || {};

      // create diet
      const diet =
        (await Database.getModel(TABLE_NAME).create(
          { name, care_plan_id, start_date, end_date, total_calories, details },
          {
            raw: true,
            transaction,
          }
        )) || null;

      const { id: diet_id } = diet || {};

      let isCreated = false;

      isCreated = await this.createDaysDiet(
        diet_food_groups,
        diet_id,
        transaction
      );

      // if (isSameAllDays) {
      //   for (let day of Object.values(DAYS_INTEGER)) {
      //     isCreated = await this.createDaysDiet(
      //       diet_food_groups,
      //       day,
      //       diet_id,
      //       transaction
      //     );
      //   }
      // } else {
      //   // for each DAY
      //   log.info("31738129312 else food_groups", diet_food_groups);
      //   for (let day of Object.keys(diet_food_groups)) {
      //     const foodGroupsForDay = diet_food_groups[day] || {};
      //     log.info("31738129312 else day", day);
      //     isCreated = await this.createDaysDiet(
      //       foodGroupsForDay,
      //       day,
      //       diet_id,
      //       transaction
      //     );
      //   }
      // }

      await transaction.commit();

      return diet_id;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  getByData = async (data) => {
    try {
      return await Database.getModel(TABLE_NAME).findOne({
        where: data,
        raw: true,
      });
    } catch (error) {
      throw error;
    }
  };

  // update = async (data, id) => {
  //   const transaction = await Database.initTransaction();
  //   try {
  //     const record = await Database.getModel(TABLE_NAME).update(data, {
  //       where: {
  //         id,
  //       },
  //       include: [Database.getModel(carePlanTableName)],
  //       raw: true,
  //       transaction,
  //     });
  //     await transaction.commit();
  //     return record;
  //   } catch (error) {
  //     await transaction.rollback();
  //     throw error;
  //   }
  // };

  findAndCountAll = async ({ where, order = DEFAULT_ORDER, attributes }) => {
    try {
      return await Database.getModel(TABLE_NAME).findAndCountAll({
        where,
        order,
        attributes,
        raw: true,
        include: [Database.getModel(dietFoodGroupMappingTableName)],
      });
    } catch (error) {
      throw error;
    }
  };

  findOne = async (data) => {
    try {
      const diet = await Database.getModel(TABLE_NAME).findOne({
        where: data,
        include: [Database.getModel(dietFoodGroupMappingTableName)],
      });

      /* nested raw true is not allowed by sequelize
                                            Links:
                                            https://github.com/sequelize/sequelize/issues/3897 (closed)
                                            https://github.com/sequelize/sequelize/issues/5193 (open)
                                          */
      return JSON.parse(JSON.stringify(diet));
    } catch (error) {
      throw error;
    }
  };

  delete = async (id) => {
    const transaction = await Database.initTransaction();
    try {
      // diet food group mappings

      // const { count: totalFoodGroupMappings, rows: allFoodGroupMappings = [] } =
      //   (await Database.getModel(dietFoodGroupMappingTableName).findAndCountAll(
      //     {
      //       where: {
      //         diet_id: id,
      //       },
      //       attributes: ["id", "food_group_id"],
      //       transaction,
      //     }
      //   )) || {};

      // if (totalFoodGroupMappings) {
      //   let foodGroupIds = [];
      //   let dietFoodGroupMappingIds = [];
      //   for (let index = 0; index < totalFoodGroupMappings; index++) {
      //     const { id: diet_food_group_mapping_id, food_group_id } =
      //       allFoodGroupMappings[index] || {};
      //     foodGroupIds.push(food_group_id);
      //     dietFoodGroupMappingIds.push(diet_food_group_mapping_id);
      //   }

      //   // delete similar mappings (if any)
      //   await Database.getModel(similiarFoodMappingTableName).destroy({
      //     where: {
      //       [Op.or]: [
      //         {
      //           related_to_id: dietFoodGroupMappingIds,
      //         },
      //         {
      //           secondary_id: dietFoodGroupMappingIds,
      //         },
      //       ],
      //     },
      //     transaction,
      //   });

      //   // delete all food groups
      //   await Database.getModel(foodGroupTableName).destroy({
      //     where: {
      //       id: foodGroupIds,
      //     },
      //     transaction,
      //   });

      //   // delete food group mappings
      //   await Database.getModel(dietFoodGroupMappingTableName).destroy({
      //     where: {
      //       id: dietFoodGroupMappingIds,
      //     },
      //     transaction,
      //   });
      // }

      // delete all schedule event created
      await Database.getModel(scheduleEventTableName).destroy({
        where: {
          event_id: id,
          event_type: EVENT_TYPE.DIET,
        },
      });

      // todo: delete all diet responses and it's uploaded documents (if needed)

      await Database.getModel(TABLE_NAME).update(
        { expired_on: moment() },
        {
          where: {
            id,
          },
          transaction,
        }
      );

      // await Database.getModel(TABLE_NAME).destroy({
      //   where: {
      //     id,
      //   },
      //   transaction,
      // });

      await transaction.commit();
      return true;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  };

  getAllForCareplanId = async ({
    where,
    order = DEFAULT_ORDER,
    attributes,
  }) => {
    try {
      const records = await Database.getModel(TABLE_NAME).findAndCountAll({
        where,
        order,
        attributes,
        raw: true,
      });
      return records;
    } catch (err) {
      throw err;
    }
  };

  update = async (data) => {
    const transaction = await Database.initTransaction();
    try {
      const {
        diet_id = null,
        name = "",
        care_plan_id = null,
        start_date = "",
        end_date = "",
        total_calories = null,
        not_to_do = "",
        repeat_days = [],
        diet_food_groups = {},
        delete_food_group_ids = [],
      } = data || {};

      for (let i = 0; i < delete_food_group_ids.length; i++) {
        const deleted_food_group_id = delete_food_group_ids[i];

        const { id: mappings_id = null } =
          (await this.getDietFoodGroupMapping({
            food_group_id: deleted_food_group_id,
            diet_id,
          })) || {};

        const { count: is_primary_to_count = null, rows = [] } =
          (await Database.getModel(
            similiarFoodMappingTableName
          ).findAndCountAll({
            where: {
              related_to_id: mappings_id,
            },
            order: DEFAULT_ORDER,
            attributes: ["id"],
            raw: true,
          })) || {};

        if (is_primary_to_count > 0) {
          // is primary

          for (let row of rows) {
            const { id: similar_record_id } = row || {};

            await Database.getModel(similiarFoodMappingTableName).destroy({
              where: {
                id: similar_record_id,
              },
              transaction,
            });
          }
        } else {
          // is secondary

          const {
            count: is_secondary_to_count = null,
            rows: secondary_rows = [],
          } =
            (await Database.getModel(
              similiarFoodMappingTableName
            ).findAndCountAll({
              where: {
                secondary_id: mappings_id,
              },
              order: DEFAULT_ORDER,
              attributes: ["id"],
              raw: true,
            })) || {};

          if (is_secondary_to_count > 0) {
            for (let row of secondary_rows) {
              const { id: similar_record_id } = row || {};

              await Database.getModel(similiarFoodMappingTableName).destroy({
                where: {
                  id: similar_record_id,
                },
                transaction,
              });
            }
          }
        }

        await Database.getModel(dietFoodGroupMappingTableName).destroy({
          where: {
            id: mappings_id,
          },
          transaction,
        });

        await Database.getModel(foodGroupTableName).destroy({
          where: {
            id: deleted_food_group_id,
          },
          transaction,
        });
      }

      // loop over each diet food group entry based on time
      for (const time in diet_food_groups) {
        const foodGroupsForTime = diet_food_groups[time] || [];

        // loop over each food group for the time
        for (let index = 0; index < foodGroupsForTime.length; index++) {
          const foodGroup = foodGroupsForTime[index] || {};

          const {
            food_group_id = null,
            similar = [],
            notes,
            ...foodGroupData
          } = foodGroup || {};

          let currentFoodGroupMappingId = null;

          if (food_group_id) {
            // update
            await Database.getModel(foodGroupTableName).update(
              { ...foodGroupData, details: { notes } },
              {
                where: {
                  id: food_group_id,
                },
                transaction,
              }
            );

            const dietFoodGroupMapping = await Database.getModel(
              dietFoodGroupMappingTableName
            ).findOne({
              where: {
                diet_id,
                food_group_id,
              },
              attributes: ["id"],
            });

            currentFoodGroupMappingId = dietFoodGroupMapping.id;
          } else {
            // create
            const createdFoodGroup =
              (await Database.getModel(foodGroupTableName).create(
                { ...foodGroupData, details: { notes } },
                {
                  transaction,
                  raw: true,
                }
              )) || {};

            // add diet food group mapping
            const createdFoodGroupMapping =
              (await Database.getModel(dietFoodGroupMappingTableName).create(
                {
                  time,
                  diet_id,
                  food_group_id: createdFoodGroup.id,
                },
                {
                  transaction,
                }
              )) || [];

            currentFoodGroupMappingId = createdFoodGroupMapping.id;
          }

          // if there is any similar food groups to update or add
          if (similar.length > 0) {
            let similarMappings = [];
            for (
              let similarIndex = 0;
              similarIndex < similar.length;
              similarIndex++
            ) {
              const similarFoodGroup = similar[similarIndex] || {};
              const {
                food_group_id: similar_food_group_id = null,
                notes,
                ...similarFoodGroupData
              } = similarFoodGroup || {};

              let currentSimilarFoodGroupMappingId = null;
              if (similar_food_group_id) {
                // update
                await Database.getModel(foodGroupTableName).update(
                  { ...similarFoodGroupData, details: { notes } },
                  {
                    where: {
                      id: similar_food_group_id,
                    },
                    transaction,
                  }
                );

                // check if mapping exists
                const similarDietFoodGroupMapping = await Database.getModel(
                  dietFoodGroupMappingTableName
                ).findOne({
                  where: {
                    diet_id,
                    food_group_id: similar_food_group_id,
                  },
                  attributes: ["id"],
                });

                currentSimilarFoodGroupMappingId =
                  similarDietFoodGroupMapping.id;

                const similarMappingExists =
                  (await Database.getModel(
                    similiarFoodMappingTableName
                  ).findOne({
                    where: {
                      related_to_id: currentFoodGroupMappingId,
                      secondary_id: currentSimilarFoodGroupMappingId,
                    },
                  })) || null;

                if (!similarMappingExists) {
                  // create new mapping
                  similarMappings.push({
                    related_to_id: currentFoodGroupMappingId,
                    secondary_id: currentSimilarFoodGroupMappingId,
                  });
                }
              } else {
                // create

                const createdSimilarFoodGroup =
                  (await Database.getModel(foodGroupTableName).create(
                    { ...similarFoodGroupData, details: { notes } },
                    {
                      transaction,
                      raw: true,
                    }
                  )) || {};

                // add diet food group mapping for similar
                const createdSimilarFoodGroupMapping =
                  (await Database.getModel(
                    dietFoodGroupMappingTableName
                  ).create(
                    {
                      time,
                      diet_id,
                      food_group_id: createdSimilarFoodGroup.id,
                    },
                    {
                      transaction,
                    }
                  )) || [];

                currentSimilarFoodGroupMappingId =
                  createdSimilarFoodGroupMapping.id;

                // add similar table row for newly created mapping
                similarMappings.push({
                  related_to_id: currentFoodGroupMappingId,
                  secondary_id: currentSimilarFoodGroupMappingId,
                });
              }

              // end of similar specific for loop
            }

            await Database.getModel(similiarFoodMappingTableName).bulkCreate(
              similarMappings,
              {
                raw: true,
                transaction,
              }
            );
          }

          // end of time specific for loop
        }
      }

      // for( let time in diet_food_groups ){

      //   const timeData = diet_food_groups[time] || [];

      //   for( let food_group of timeData ){

      //     let { similar = [] } = food_group;

      //     const { food_group_id , mappingId:primary_mapping_id} = await this.getFoodGroupIdAndMappingId({
      //       food_group,
      //       transaction,
      //       diet_id,
      //       time
      //     });

      //     if(similar.length && primary_mapping_id){

      //         let similarFoodGroupMappingIds=[];
      //         for( let eachSimilar of similar ){

      //           const {food_group_id : similar_food_group_id ,mappingId : similar_mappingId } = await this.getFoodGroupIdAndMappingId({
      //             food_group:eachSimilar,
      //             transaction,
      //             diet_id,
      //             time
      //           });

      //           if(similar_mappingId){
      //             similarFoodGroupMappingIds.push(similar_mappingId);
      //           }

      //         }

      //         for(let each of similarFoodGroupMappingIds ){

      //           const { id : existingId  } = await Database.getModel(similiarFoodMappingTableName).findOne({
      //             where : {
      //               secondary_id:each,
      //               related_to_id: primary_mapping_id
      //             },
      //             attributes:["id"]
      //           }) || {};

      //           if(!existingId){

      //             const similarFoodMapping = await Database.getModel(similiarFoodMappingTableName).create({
      //               secondary_id:each,
      //               related_to_id: primary_mapping_id
      //             }, {
      //               raw: true,
      //               transaction,
      //             }) || {};

      //           }

      //         }
      //     }
      //   }
      // }

      const dietDataToUpdate = {
        name,
        start_date,
        end_date,
        total_calories,
        details: { not_to_do, repeat_days },
      };

      await Database.getModel(TABLE_NAME).update(dietDataToUpdate, {
        where: {
          id: diet_id,
        },
        raw: true,
        transaction,
      });

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  };

  getFoodGroupIdAndMappingId = async ({
    food_group,
    // transaction,
    diet_id,
    time,
  }) => {
    try {
      let { food_group_id = null } = food_group;
      let mappingId = null;

      const {
        serving = null,
        portion_id = null,
        food_item_detail_id = null,
        notes = "",
      } = food_group || {};

      if (food_group_id) {
        const updateFoodGroupData = {
          serving,
          portion_id,
          food_item_detail_id,
          notes,
        };

        await Database.getModel(foodGroupTableName).update(
          updateFoodGroupData,
          {
            where: {
              id: food_group_id,
            },
            raw: true,
            // transaction
          }
        );

        const getMappingRespo =
          (await this.getDietFoodGroupMapping({
            food_group_id,
            diet_id,
          })) || {};

        const { id: mappings_id = null } = getMappingRespo;
        mappingId = mappings_id;
      } else {
        const newFoodGroup =
          (await Database.getModel(foodGroupTableName).create(
            {
              serving,
              portion_id,
              food_item_detail_id,
              details: notes ? { notes } : {},
            },
            {
              // transaction,
            }
          )) || {};

        const { id: new_group_id } = newFoodGroup || {};
        food_group_id = new_group_id;
        const newMapping =
          (await Database.getModel(dietFoodGroupMappingTableName).create(
            {
              diet_id,
              food_group_id: new_group_id,
              time,
            },
            {
              // transaction,
            }
          )) || {};

        const { id: new_mapping_id } = newMapping;
        mappingId = new_mapping_id;
      }

      return { food_group_id, mappingId };
    } catch (error) {
      throw error;
    }
  };

  getAllSimilarRecordsForData = async ({
    where,
    order = DEFAULT_ORDER,
    attributes,
  }) => {
    try {
      const records = await Database.getModel(
        similiarFoodMappingTableName
      ).findAndCountAll({
        where,
        order,
        attributes,
        raw: true,
      });
      return records;
    } catch (err) {
      throw err;
    }
  };

  getDietFoodGroupMapping = async (data) => {
    try {
      return await Database.getModel(dietFoodGroupMappingTableName).findOne({
        where: data,
        attributes: ["id"],
        raw: true,
      });
    } catch (error) {
      throw error;
    }
  };

  updateDietTotalCalories = async ({ total_calories, diet_id }) => {
    const transaction = await Database.initTransaction();
    try {
      await Database.getModel(TABLE_NAME).update(
        { total_calories, diet_id },
        {
          where: {
            id: diet_id,
          },
          raw: true,
          transaction,
        }
      );

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  };
}

export default DietService;
