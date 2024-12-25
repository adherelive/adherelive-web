import Controller from "../../index";
import moment from "moment";

// Services
import DietService from "../../../services/diet/diet.service";
import queueService from "../../../services/awsQueue/queue.service";
import userPreferenceService from "../../../services/userPreferences/userPreference.service";
import EventService from "../../../services/scheduleEvents/scheduleEvent.service";
import DietResponsesService from "../../../services/dietResponses/dietResponses.service";

// Wrappers
import CareplanWrapper from "../../../apiWrapper/web/carePlan";
import DietWrapper from "../../../apiWrapper/mobile/diet";
import PatientWrapper from "../../../apiWrapper/mobile/patient";
import UserPreferenceWrapper from "../../../apiWrapper/mobile/userPreference";
import EventWrapper from "../../../apiWrapper/common/scheduleEvents";
import DietResponseWrapper from "../../../apiWrapper/mobile/dietResponse";

import * as DietHelper from "../../diet/dietHelper";
import DietJob from "../../../jobSdk/Diet/observer";
import NotificationSdk from "../../../notificationSdk";

import { getTimeWiseDietFoodGroupMappings } from "../../diet/dietHelper";
// import * as medicationHelper from "../../medicationReminder/medicationHelper";

import Log from "../../../../libs/log";

import {
  EVENT_TYPE,
  EVENT_STATUS,
  DAYS,
  USER_CATEGORY,
  MEDICATION_TIMING,
  PATIENT_MEAL_TIMINGS,
} from "../../../../constant";
import carePlanService from "../../../services/carePlan/carePlan.service";

const Logger = new Log("MOBILE DIET CONTROLLER");

class DietController extends Controller {
  constructor() {
    super();
  }

  get = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        params: { id = null } = {},
        userDetails: {
          userCategoryId = null,
          userData: { category = null } = {},
        } = {},
      } = req;

      const dietService = await new DietService();
      const dietData = await dietService.findOne({ id });

      if (!dietData) {
        return raiseClientError(res, 422, {}, `No Matching Diet Details Found`);
      }

      const dietWrapper = await DietWrapper({ data: dietData });
      const careplan_id = dietWrapper.getCareplanId();
      const careplanWrapper = await CareplanWrapper(null, careplan_id);
      const doctor_id = await careplanWrapper.getDoctorId();
      const patient_id = careplanWrapper.getPatientId();

      // TODO: Why has this been commented in Web, but not in Mobile?
      //  Other doctor's diet as food item and details only visible to creator doc
      if (
        userCategoryId.toString() !== doctor_id.toString() &&
        userCategoryId !== patient_id
      ) {
        return raiseClientError(
          res,
          422,
          {},
          `User Unauthorized to get Diet Details`
        );
      }

      const referenceInfo = await dietWrapper.getReferenceInfo();

      let dietApidata = {},
        dietBasicInfo = {},
        dietFoodGroupsTotalCalories = 0;

      dietBasicInfo[dietWrapper.getId()] = await dietWrapper.getBasicInfo();

      const {
        diet_food_group_mappings = {},
        food_groups = {},
        food_items = {},
        food_item_details = {},
        portions = {},
      } = referenceInfo || {};

      const timeWise = await getTimeWiseDietFoodGroupMappings({
        diet_food_group_mappings,
      });

      for (let eachTime in timeWise) {
        const { mappingIds = [] } = timeWise[eachTime] || {};
        for (let ele of mappingIds) {
          let primary = null,
            related_diet_food_group_mapping_ids = [];

          if (Array.isArray(ele)) {
            ele.sort(function (a, b) {
              return a - b;
            });

            primary = ele[0] || null;
            related_diet_food_group_mapping_ids = ele.slice(1);
          } else {
            primary = ele;
          }

          let currentfodmattedData = {};

          // const related_diet_food_group_mapping_ids = mappingIds.slice(1);
          let similarFoodGroups = [],
            notes = "";

          const current_mapping = diet_food_group_mappings[primary] || {};
          const { basic_info: { time = "", food_group_id = null } = {} } =
            current_mapping;
          const {
            basic_info: { food_item_detail_id = null, serving = null } = {},
            details = {},
          } = food_groups[food_group_id] || {};
          const {
            basic_info: { portion_id = null, calorific_value = 0 } = {},
          } = food_item_details[food_item_detail_id] || {};

          if (details) {
            const { notes: detail_notes = "" } = details;
            notes = detail_notes;
          }

          if (serving) {
            dietFoodGroupsTotalCalories =
              dietFoodGroupsTotalCalories + serving * calorific_value;
          }

          if (related_diet_food_group_mapping_ids.length) {
            for (
              let i = 0;
              i < related_diet_food_group_mapping_ids.length;
              i++
            ) {
              const similarMappingId = related_diet_food_group_mapping_ids[i];

              const {
                basic_info: {
                  food_group_id: similar_food_group_id = null,
                } = {},
              } = diet_food_group_mappings[similarMappingId] || {};
              const {
                basic_info: {
                  food_item_detail_id: similar_food_item_detail_id = null,
                  serving: similar_serving = null,
                } = {},
                details: similar_details = {},
              } = food_groups[similar_food_group_id] || {};

              const {
                basic_info: {
                  portion_id: similar_portion_id = null,
                  calorific_value: similar_calorific_value = 0,
                } = {},
              } = food_item_details[similar_food_item_detail_id] || {};

              let similar_notes = "";
              if (similar_details) {
                const { notes = "" } = similar_details || {};
                similar_notes = notes;
              }

              if (similar_serving) {
                dietFoodGroupsTotalCalories =
                  dietFoodGroupsTotalCalories +
                  similar_serving * similar_calorific_value;
              }

              const similarData = {
                serving: similar_serving,
                portion_id: similar_portion_id,
                food_item_detail_id: similar_food_item_detail_id,
                food_group_id: similar_food_group_id,
                notes: similar_notes,
              };

              similarFoodGroups.push(similarData);
              // delete diet_food_group_mappings[similarMappingId];
            }
          }

          currentfodmattedData = {
            serving,
            portion_id,
            food_group_id,
            notes,
            food_item_detail_id,
            similar: [...similarFoodGroups],
          };

          const currentDietDataForTime = dietApidata[time] || [];
          currentDietDataForTime.push(currentfodmattedData);

          dietApidata[`${time}`] = [...currentDietDataForTime];
        }
      }

      return raiseSuccess(
        res,
        200,
        {
          diets: {
            ...dietBasicInfo,
          },
          diet_food_groups: {
            ...dietApidata,
          },
          food_items,
          food_item_details,
          portions,
          food_groups_total_calories: dietFoodGroupsTotalCalories,
        },
        "Diet Data fetched successfully"
      );
    } catch (error) {
      Logger.debug("get all diet details 500 error", error);
      return raiseServerError(res);
    }
  };

  create = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { userDetails = {} } = req;
      const {
        userId,
        userRoleId,
        userData: { category } = {},
        userCategoryData: { basic_info: { full_name = "" } = {} } = {},
      } = userDetails || {};

      const { body = {} } = req;
      Logger.debug("create request", body);

      // TODO: Check why end date is null ?
      const {
        name = "",
        care_plan_id = null,
        start_date,
        end_date = null,
        total_calories = null,
        not_to_do = "",
        repeat_days = [],
        diet_food_groups = [],
      } = body;

      const dietService = new DietService();
      const diet =
        (await dietService.getByData({ name, care_plan_id })) || null;

      if (diet) {
        return raiseClientError(
          res,
          422,
          {},
          `Diet with name ${name} already exists.`
        );
      }

      const diet_id = await dietService.create({
        name,
        care_plan_id,
        start_date,
        end_date,
        total_calories,
        diet_food_groups,
        details: { not_to_do, repeat_days },
      });

      const dietWrapper = await DietWrapper({ id: diet_id });

      const referenceInfo = await dietWrapper.getReferenceInfo();

      const carePlanId = dietWrapper.getCareplanId();

      const careplanWrapper = await CareplanWrapper(null, carePlanId);
      const patientId = await careplanWrapper.getPatientId();
      const patient = await PatientWrapper(null, patientId);
      const { user_role_id: patientRoleId } = await patient.getAllInfo();

      const eventScheduleData = {
        patient_id: patient.getUserId(),
        type: EVENT_TYPE.DIET,
        event_id: dietWrapper.getId(),
        status: EVENT_STATUS.SCHEDULED,
        start_date,
        end_date,
        participants: [userRoleId, patientRoleId],
        actor: {
          id: userId,
          user_role_id: userRoleId,
          details: { name: full_name, category },
        },
      };

      const QueueService = new queueService();

      const sqsResponse = await QueueService.sendMessage(eventScheduleData);

      Logger.debug("sqsResponse ---> ", sqsResponse);

      const dietJob = DietJob.execute(
        EVENT_STATUS.SCHEDULED,
        eventScheduleData
      );

      await NotificationSdk.execute(dietJob);

      return raiseSuccess(
        res,
        200,
        {
          ...referenceInfo,
        },
        "Diet created successfully."
      );
    } catch (error) {
      Logger.debug("create 500 error - diet create mobile error: ", error);
      return raiseServerError(res);
    }
  };

  getDetails = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { params } = req;
      Logger.debug("getDetails request params", params);

      const { patient_id } = params || {};

      let timings = {};

      if (parseInt(patient_id)) {
        const patient = await PatientWrapper(null, patient_id);
        const timingPreference =
          await userPreferenceService.getPreferenceByData({
            user_id: patient.getUserId(),
          });
        const options = await UserPreferenceWrapper(timingPreference);
        const { timings: userTimings = {} } = options.getAllDetails();

        // const medicationTimings = medicationHelper.getTimings(userTimings);

        // medicationTimings.sort((activityA, activityB) => {
        //   const { time: a } = activityA || {};
        //   const { time: b } = activityB || {};
        //   if (moment(a).isBefore(moment(b))) return -1;

        //   if (moment(a).isAfter(moment(b))) return 1;
        // });

        // medicationTimings.forEach((timing, index) => {
        //   timings[`${index + 1}`] = timing;
        // });
        timings = DietHelper.getTimings(userTimings);
      } else {
        timings = DietHelper.getTimings(PATIENT_MEAL_TIMINGS);
        // timings = MEDICATION_TIMING;
      }

      return raiseSuccess(
        res,
        200,
        {
          timings,
          days: DAYS,
        },
        "Diet related patient details fetched successfully"
      );
    } catch (error) {
      Logger.debug("getDetails 500", error);
      return raiseServerError(res);
    }
  };

  getDietsByCareplan = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { query: { care_plan_id = null } = {} } = req;
      const dietService = await new DietService();
      const { count = null, rows = [] } =
        (await dietService.getAllForCareplanId({
          where: {
            care_plan_id,
          },
          attributes: ["id"],
        })) || [];

      let dietsApiData = {},
        diet_ids = [];

      if (count === 0) {
        return raiseClientError(res, 422, {}, `No Diets Exist for careplan`);
      }

      for (let i = 0; i < rows.length; i++) {
        const { id = null } = rows[i] || {};
        const dietWrapper = await DietWrapper({ id });
        dietsApiData[dietWrapper.getId()] = await dietWrapper.getBasicInfo();
        diet_ids.push(dietWrapper.getId());
      }

      return raiseSuccess(
        res,
        200,
        {
          diets: {
            ...dietsApiData,
          },
          diet_ids,
        },
        "Diets for careplan fetched successfully"
      );
    } catch (error) {
      Logger.debug("getCareplan Diets 500", error);
      return raiseServerError(res);
    }
  };

  update = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        params = {},
        body = {},
        userDetails: {
          userId,
          userRoleId,
          userData: { category } = {},
          userCategoryData: { basic_info: { full_name = "" } = {} } = {},
        } = {},
      } = req;

      const { id: diet_id = null } = params;

      const dietService = new DietService();

      const diet = await dietService.getByData({ id: diet_id });

      if (!diet) {
        return raiseClientError(res, 422, {}, `No Matching Diet Details Found`);
      }

      const {
        name = "",
        care_plan_id = null,
        start_date,
        end_date = null,
        total_calories = null,
        not_to_do = "",
        repeat_days = [],
        diet_food_groups = {},
        delete_food_group_ids = [],
      } = body;

      const existingDiet =
        (await dietService.getByData({ name, care_plan_id })) || null;

      const { id = null } = existingDiet || {};

      if (existingDiet && id.toString() !== diet_id.toString()) {
        return raiseClientError(
          res,
          422,
          {},
          `Diet Exists with the same name for patient`
        );
      }

      const isUpdated = await dietService.update({
        diet_id,
        name,
        care_plan_id,
        start_date,
        end_date,
        total_calories,
        not_to_do,
        repeat_days,
        diet_food_groups,
        delete_food_group_ids,
      });

      let dietsApiData = {};

      const dietWrapper = await DietWrapper({ id: diet_id });
      dietsApiData[dietWrapper.getId()] = await dietWrapper.getBasicInfo();

      // delete existing schedule events created
      const eventService = new EventService();
      await eventService.deleteBatch({
        event_id: diet_id,
        event_type: EVENT_TYPE.DIET,
      });

      // create new schedule events
      const careplanWrapper = await CareplanWrapper(null, care_plan_id);
      const patientId = await careplanWrapper.getPatientId();
      const patient = await PatientWrapper(null, patientId);
      const { user_role_id: patientRoleId } = await patient.getAllInfo();

      const eventScheduleData = {
        patient_id: patient.getUserId(),
        type: EVENT_TYPE.DIET,
        event_id: diet_id,
        status: EVENT_STATUS.SCHEDULED,
        start_date,
        end_date,
        participants: [userRoleId, patientRoleId],
        actor: {
          id: userId,
          user_role_id: userRoleId,
          details: { name: full_name, category },
        },
      };

      const QueueService = new queueService();

      const sqsResponse = await QueueService.sendMessage(eventScheduleData);

      Logger.debug("sqsResponse ---> ", sqsResponse);

      return raiseSuccess(
        res,
        200,
        {
          diets: {
            ...dietsApiData,
          },
        },
        "Diet updated successfully"
      );
    } catch (error) {
      Logger.debug("diet updateeeee 500 error", error);
      return raiseServerError(res);
    }
  };

  delete = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { params: { id } = {} } = req;

      const dietService = new DietService();

      // check if diet exists
      const dietExists = (await dietService.findOne({ id })) || null;

      if (!dietExists) {
        return raiseClientError(
          res,
          422,
          {},
          "Please select a valid diet to delete"
        );
      }

      const isDeleted = await dietService.delete(id);
      let dietApiData = {};

      if (isDeleted) {
        const dietWrapper = await DietWrapper({ id });
        dietApiData[dietWrapper.getId()] = dietWrapper.getBasicInfo();
        return raiseSuccess(
          res,
          200,
          {
            diets: {
              ...dietApiData,
            },
          },
          "Diet deleted successfully"
        );
      } else {
        return raiseClientError(
          res,
          422,
          {},
          "Please select a valid diet to delete"
        );
      }
    } catch (error) {
      Logger.debug("delete 500", error);
      return raiseServerError(res);
    }
  };

  getAllDietsForDoctor = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;

    try {
      const { userDetails = {} } = req;
      // TODO: Web has this:
      // const { userCategoryId = null } = userDetails || {};
      const { userCategoryId = null, userRoleId = null } = userDetails || {};

      let allDietsApiWrapper = {};

      const allCareplansForDoctor =
        (await carePlanService.getCarePlanByData({
          doctor_id: userCategoryId,
          // user_role_id: userRoleId,
        })) || [];
      const dietService = new DietService();
      if (allCareplansForDoctor.length) {
        for (let i = 0; i < allCareplansForDoctor.length; i++) {
          const { id: care_plan_id = null } = allCareplansForDoctor[i] || {};
          const { count = null, rows = [] } =
            await dietService.getAllForCareplanId({
              where: {
                care_plan_id,
              },
              attributes: ["id"],
            });
          if (count > 0) {
            for (let row of rows) {
              const { id: dietId } = row || {};
              const dietWrapper = await DietWrapper({ id: dietId });
              allDietsApiWrapper[dietWrapper.getId()] =
                await dietWrapper.getBasicInfo();
            }
          }
        }
      }

      return raiseSuccess(
        res,
        200,
        {
          diets: {
            ...allDietsApiWrapper,
          },
        },
        "Diet Data fetched successfully"
      );
    } catch (error) {
      Logger.debug("get Doctor Diets details 500 error", error);
      return raiseServerError(res);
    }
  };

  getPatientDiets = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        userDetails: { userData: { category } = {}, userCategoryId } = {},
      } = req;

      if (category !== USER_CATEGORY.PATIENT) {
        return raiseClientError(res, 422, {}, "UNAUTHORIZED");
      }

      const dietService = new DietService();

      let allDiets = {};
      let allDietFoodMappings = {};
      let allFoodGroups = {};
      let allPortions = {};
      let allFoodItems = {};
      let allFoodItemDetails = {};

      const allCareplansForPatient =
        (await carePlanService.getCarePlanByData({
          patient_id: userCategoryId,
        })) || [];
      if (allCareplansForPatient.length) {
        for (let i = 0; i < allCareplansForPatient.length; i++) {
          const { id: care_plan_id = null } = allCareplansForPatient[i] || {};
          const { count = null, rows = [] } =
            await dietService.getAllForCareplanId({
              where: {
                care_plan_id,
              },
              attributes: ["id"],
            });
          if (count > 0) {
            for (let row of rows) {
              const { id: dietId } = row || {};
              const dietWrapper = await DietWrapper({ id: dietId });
              // allDietsApiWrapper[
              //   dietWrapper.getId()
              // ] = await dietWrapper.getBasicInfo();

              const {
                diets,
                diet_food_group_mappings,
                food_groups,
                portions,
                food_items,
                food_item_details,
              } = await dietWrapper.getReferenceInfo();

              allDiets = { ...allDiets, ...diets };
              allDietFoodMappings = {
                ...allDietFoodMappings,
                ...diet_food_group_mappings,
              };
              allFoodGroups = { ...allFoodGroups, ...food_groups };
              allFoodItems = { ...allFoodItems, ...food_items };
              allFoodItemDetails = {
                ...allFoodItemDetails,
                ...food_item_details,
              };
              allPortions = { ...allPortions, ...portions };
            }
          }
        }
      }

      return raiseSuccess(
        res,
        200,
        {
          diets: allDiets,
          diet_food_group_mappings: allDietFoodMappings,
          food_groups: allFoodGroups,
          food_items: allFoodItems,
          food_item_details: allFoodItemDetails,
          portions: allPortions,
        },
        "Diet Data fetched successfully"
      );
    } catch (error) {
      Logger.debug("getPatientDiets 500", error);
      return raiseServerError(res);
    }
  };

  getDietResponseTimeline = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      Logger.debug("73575273512732 req.params diet id--->", req.params);
      const { params: { id } = {} } = req;
      const eventService = new EventService();

      const today = moment().utc().toISOString();

      const dietService = new DietService();
      const dietResponsesService = new DietResponsesService();

      const dietExists = (await dietService.findOne({ id })) || null;

      if (!dietExists) {
        return raiseClientError(
          res,
          422,
          {},
          "Please select a valid diet id to get timeline"
        );
      }

      const diet = await DietWrapper({ id });

      const completeEvents = await eventService.getAllPassedByData({
        event_id: id,
        event_type: EVENT_TYPE.DIET,
        date: diet.getStartDate(),
        sort: "DESC",
        paranoid: false,
      });

      let dateWiseDietData = {};

      const timelineDates = [];

      if (completeEvents.length > 0) {
        for (const scheduleEvent of completeEvents) {
          const event = await EventWrapper(scheduleEvent);

          const dietResponseData =
            (await dietResponsesService.getByData({
              diet_id: id,
              schedule_event_id: event.getScheduleEventId(),
            })) || null;

          let allDietResponseData = {};

          if (dietResponseData) {
            const dietResponse = await DietResponseWrapper({
              data: dietResponseData,
            });

            const { diet_responses, upload_documents, diet_response_id } =
              (await dietResponse.getReferenceInfo()) || {};

            allDietResponseData = {
              diet_responses,
              upload_documents,
              diet_response_id,
            };
          }

          let eventData = {
            ...(await event.getAllInfo()),
            ...allDietResponseData,
          };

          if (dateWiseDietData.hasOwnProperty(event.getDate())) {
            dateWiseDietData[event.getDate()].push({ ...eventData });
          } else {
            dateWiseDietData[event.getDate()] = [];
            dateWiseDietData[event.getDate()].push({ ...eventData });
            timelineDates.push(event.getDate());
          }
        }

        return raiseSuccess(
          res,
          200,
          {
            diet_timeline: {
              ...dateWiseDietData,
            },
            diet_date_ids: timelineDates,
          },
          "Diet responses fetched successfully"
        );
      } else {
        return raiseSuccess(
          res,
          200,
          {},
          "No response updated yet for the diet"
        );
      }
    } catch (error) {
      Logger.debug("getDietResponse 500 error", error);
      return raiseServerError(res);
    }
  };

  updateTotalCalories = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { query = {} } = req;

      const { id: diet_id = null, total_calories = 0 } = query;

      const dietService = new DietService();

      const diet = await dietService.getByData({ id: diet_id });

      if (!diet) {
        return raiseClientError(res, 422, {}, `No Matching Diet Details Found`);
      }

      const isUpdated = await dietService.updateDietTotalCalories({
        diet_id,
        total_calories,
      });

      let dietsApiData = {};

      const dietWrapper = await DietWrapper({ id: diet_id });
      dietsApiData[dietWrapper.getId()] = await dietWrapper.getBasicInfo();

      return raiseSuccess(
        res,
        200,
        {
          diets: {
            ...dietsApiData,
          },
        },
        "Diet total calories updated successfully"
      );
    } catch (error) {
      Logger.debug("diet total calories updateeeee 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new DietController();
