import Controller from "../../";
import Logger from "../../../../libs/log";

// services
import carePlanTemplateService from "../../../services/carePlanTemplate/carePlanTemplate.service";
import TemplateVitalService from "../../../services/templateVital/templateVital.service";
import templateAppointmentService from "../../../services/templateAppointment/templateAppointment.service";
import templateMedicationService from "../../../services/templateMedication/templateMedication.service";
import TemplateDietService from "../../../services/templateDiet/templateDiet.service";
import TemplateWorkoutService from "../../../services/templateWorkouts/templateWorkout.service";
import ExerciseContentService from "../../../services/exerciseContents/exerciseContent.service";

// wrapper
import ExerciseContentWrapper from "../../../apiWrapper/mobile/exerciseContents";
import CarePlanTemplateWrapper from "../../../apiWrapper/mobile/carePlanTemplate";

import {
  TEMPLATE_DUPLICATE_TEXT,
  USER_CATEGORY,
  EVENT_LONG_TERM_VALUE,
} from "../../../../constant";

import PERMISSIONS from "../../../../config/permissions";

const Log = new Logger("MOBILE > CAREPLAN_TEMPLATE > CONTROLLER");

class CarePlanTemplateController extends Controller {
  constructor() {
    super();
  }

  create = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { body } = req;
      const {
        userDetails: {
          userId,
          userData: { category } = {},
          userCategoryId,
        } = {},
        permissions = [],
      } = req;

      // will get userId From below data
      let doctor_id = null;
      let provider_id = null;

      if (req.userDetails.userRoleData.basic_info.linked_with === "doctor") {
        doctor_id = req.userDetails.userCategoryData.basic_info.id;
      }

      if (req.userDetails.userRoleData.basic_info.linked_with === "provider") {
        provider_id = req.userDetails.userRoleData.basic_info.linked_id;
        doctor_id = req.userDetails.userCategoryData.basic_info.id;
      }

      const {
        medicationsData,
        appointmentsData,
        vitalsData,
        dietData = [],
        workoutData = [],
        name,
        is_public_in_provider,
      } = body || {};

      Log.info(`name : ${name}`);

      if (
        !permissions.includes(PERMISSIONS.MEDICATIONS.ADD) &&
        medicationsData.length > 0
      ) {
        return raiseClientError(
          res,
          422,
          {},
          `Medication creation is not allowed. Please remove the same to continue`
        );
      }

      const existingTemplate =
        (await carePlanTemplateService.getSingleTemplateByData({
          name,
          user_id: userId,
        })) || null;

      if (!existingTemplate) {
        const createTemplate =
          (await carePlanTemplateService.create({
            name,
            user_id: userId,
            doctor_id,
            provider_id,
            is_public_in_provider,
            template_appointments: appointmentsData,
            ...(permissions.includes(PERMISSIONS.MEDICATIONS.TEMPLATE) && {
              template_medications: medicationsData,
            }),
            template_vitals: vitalsData,
            template_diets: dietData,
            template_workouts: workoutData,
          })) || null;

        Log.debug("createTemplate value", createTemplate);

        if (createTemplate) {
          const template = await CarePlanTemplateWrapper(createTemplate);

          const allCareplanTemplates =
            (await carePlanTemplateService.getAllTemplatesForDoctor({
              user_id: userId,
            })) || [];

          let carePlanTemplateIds = [];

          if (allCareplanTemplates.length > 0) {
            for (let index = 0; index < allCareplanTemplates.length; index++) {
              const template = await CarePlanTemplateWrapper(
                allCareplanTemplates[index]
              );

              carePlanTemplateIds.push(template.getCarePlanTemplateId());
            }
          }

          const { exercises: allExercises = {} } =
            await template.getReferenceInfo();

          let exerciseContentData = {};
          const exerciseContentService = new ExerciseContentService();

          for (let each in allExercises) {
            const exercise = allExercises[each] || {};
            const { basic_info: { id = null } = {} } = exercise || {};
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
          }

          return raiseSuccess(
            res,
            200,
            {
              ...(await template.getReferenceInfo()),
              care_plan_template_ids: carePlanTemplateIds,
              exercise_contents: exerciseContentData,
            },
            "Template created successfully"
          );
        } else {
          return raiseClientError(res, 422, {}, "Please check values entered");
        }
      } else {
        return raiseClientError(
          res,
          422,
          {},
          `Template already present for name ${name} for this user. Please use different to continue`
        );
      }
    } catch (error) {
      Log.debug("create 500 error - template already present", error);
      return raiseServerError(res);
    }
  };

  getAllForDoctor = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const {
        userDetails: {
          userId,
          userData: { category } = {},
          userCategoryId,
        } = {},
        permissions = [],
      } = req;

      let doctor_id = null;
      let provider_id = null;

      if (req.userDetails.userRoleData.basic_info.linked_with === "doctor") {
        doctor_id = req.userDetails.userCategoryData.basic_info.id;
      }

      if (req.userDetails.userRoleData.basic_info.linked_with === "provider") {
        provider_id = req.userDetails.userRoleData.basic_info.linked_id;
        doctor_id = req.userDetails.userCategoryData.basic_info.id;
      }

      const allCareplanTemplates =
        (await carePlanTemplateService.getAllTemplatesForDoctor({
          user_id: userId,
          provider_id,
          doctor_id,
        })) || [];

      let carePlanTemplate = {};
      let templateAppointment = {};
      let templateMedication = {};
      let templateVital = {};
      let vitalTemplates = {};
      let medicineData = {};

      let allTemplateDiets = {};
      let allFoodItems = {};
      let allFoodItemDetails = {};
      let allPortions = {};

      let allTemplateWorkouts = {};
      let allExercises = {};
      let allExerciseDetails = {};
      let allRepetitions = {};

      let carePlanTemplateIds = [];

      if (allCareplanTemplates.length > 0) {
        for (let index = 0; index < allCareplanTemplates.length; index++) {
          const template = await CarePlanTemplateWrapper(
            allCareplanTemplates[index]
          );
          const {
            care_plan_templates,
            template_appointments,
            template_medications,
            template_vitals,
            vital_templates,
            medicines,
            template_diets,
            food_item_details,
            food_items,
            portions,
            template_workouts,
            exercise_details,
            exercises,
            repetitions,
          } = await template.getReferenceInfo();

          carePlanTemplate = { ...carePlanTemplate, ...care_plan_templates };
          carePlanTemplateIds.push(template.getCarePlanTemplateId());

          templateAppointment = {
            ...templateAppointment,
            ...template_appointments,
          };

          if (permissions.includes(PERMISSIONS.MEDICATIONS.TEMPLATE)) {
            templateMedication = {
              ...templateMedication,
              ...template_medications,
            };
          }

          templateVital = { ...templateVital, ...template_vitals };

          vitalTemplates = { ...vitalTemplates, ...vital_templates };

          if (permissions.includes(PERMISSIONS.MEDICATIONS.TEMPLATE)) {
            medicineData = { ...medicineData, ...medicines };
          }

          allTemplateDiets = { ...allTemplateDiets, ...template_diets };
          allFoodItems = { ...allFoodItems, ...food_items };
          allFoodItemDetails = { ...allFoodItemDetails, ...food_item_details };
          allPortions = { ...allPortions, ...portions };

          allTemplateWorkouts = {
            ...allTemplateWorkouts,
            ...template_workouts,
          };
          allExercises = { ...allExercises, ...exercises };
          allExerciseDetails = { ...allExerciseDetails, ...exercise_details };
          allRepetitions = { ...allRepetitions, ...repetitions };
        }

        let exerciseContentData = {};
        const exerciseContentService = new ExerciseContentService();

        for (let each in allExercises) {
          const exercise = allExercises[each] || {};
          const { basic_info: { id = null } = {} } = exercise || {};
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
        }

        return raiseSuccess(
          res,
          200,
          {
            care_plan_templates: {
              ...carePlanTemplate,
            },
            template_appointments: {
              ...templateAppointment,
            },
            ...(permissions.includes(PERMISSIONS.MEDICATIONS.TEMPLATE) && {
              template_medications: {
                ...templateMedication,
              },
            }),
            template_vitals: {
              ...templateVital,
            },
            template_diets: allTemplateDiets,
            food_items: allFoodItems,
            food_item_details: allFoodItemDetails,
            portions: allPortions,

            template_workouts: allTemplateWorkouts,
            exercise_details: allExerciseDetails,
            exercises: allExercises,
            exercise_contents: exerciseContentData,
            repetitions: allRepetitions,

            vital_templates: {
              ...vitalTemplates,
            },
            ...(permissions.includes(PERMISSIONS.MEDICATIONS.TEMPLATE) && {
              medicines: {
                ...medicineData,
              },
            }),
            care_plan_template_ids: carePlanTemplateIds,
          },
          "Templates fetched successfully"
        );
      } else {
        return raiseSuccess(res, 200, {}, "No templates created at the moment");
      }
    } catch (error) {
      Log.debug("getAllForDoctor 500 error", error);
      return raiseServerError(res);
    }
  };

  // gaurav changes

  searchAllTemplatesForDoctor = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const {
        userDetails: {
          userId,
          userData: { category } = {},
          userCategoryId,
        } = {},
        permissions = [],
      } = req;

      let keyword = "";
      if (req.query.keyword) keyword = req.query.keyword;

      let doctor_id = null;
      let provider_id = null;

      if (req.userDetails.userRoleData.basic_info.linked_with === "doctor") {
        doctor_id = req.userDetails.userCategoryData.basic_info.id;
      }

      if (req.userDetails.userRoleData.basic_info.linked_with === "provider") {
        provider_id = req.userDetails.userRoleData.basic_info.linked_id;
        doctor_id = req.userDetails.userCategoryData.basic_info.id;
      }

      const allCareplanTemplates =
        (await carePlanTemplateService.searchAllTemplatesForDoctor({
          user_id: userId,
          provider_id,
          doctor_id,
          keyword,
        })) || [];

      let carePlanTemplate = {};
      let templateAppointment = {};
      let templateMedication = {};
      let templateVital = {};
      let vitalTemplates = {};
      let medicineData = {};

      let allTemplateDiets = {};
      let allFoodItems = {};
      let allFoodItemDetails = {};
      let allPortions = {};

      let allTemplateWorkouts = {};
      let allExercises = {};
      let allExerciseDetails = {};
      let allRepetitions = {};

      let carePlanTemplateIds = [];

      if (allCareplanTemplates.length > 0) {
        for (let index = 0; index < allCareplanTemplates.length; index++) {
          const template = await CarePlanTemplateWrapper(
            allCareplanTemplates[index]
          );
          const {
            care_plan_templates,
            template_appointments,
            template_medications,
            template_vitals,
            vital_templates,
            medicines,
            template_diets,
            food_item_details,
            food_items,
            portions,
            template_workouts,
            exercise_details,
            exercises,
            repetitions,
          } = await template.getReferenceInfo();

          carePlanTemplate = { ...carePlanTemplate, ...care_plan_templates };
          carePlanTemplateIds.push(template.getCarePlanTemplateId());

          templateAppointment = {
            ...templateAppointment,
            ...template_appointments,
          };

          if (permissions.includes(PERMISSIONS.MEDICATIONS.TEMPLATE)) {
            templateMedication = {
              ...templateMedication,
              ...template_medications,
            };
          }

          templateVital = { ...templateVital, ...template_vitals };

          vitalTemplates = { ...vitalTemplates, ...vital_templates };

          if (permissions.includes(PERMISSIONS.MEDICATIONS.TEMPLATE)) {
            medicineData = { ...medicineData, ...medicines };
          }

          allTemplateDiets = { ...allTemplateDiets, ...template_diets };
          allFoodItems = { ...allFoodItems, ...food_items };
          allFoodItemDetails = { ...allFoodItemDetails, ...food_item_details };
          allPortions = { ...allPortions, ...portions };

          allTemplateWorkouts = {
            ...allTemplateWorkouts,
            ...template_workouts,
          };
          allExercises = { ...allExercises, ...exercises };
          allExerciseDetails = { ...allExerciseDetails, ...exercise_details };
          allRepetitions = { ...allRepetitions, ...repetitions };
        }

        let exerciseContentData = {};
        const exerciseContentService = new ExerciseContentService();

        for (let each in allExercises) {
          const exercise = allExercises[each] || {};
          const { basic_info: { id = null } = {} } = exercise || {};
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
        }

        return raiseSuccess(
          res,
          200,
          {
            care_plan_templates: {
              ...carePlanTemplate,
            },
            template_appointments: {
              ...templateAppointment,
            },
            ...(permissions.includes(PERMISSIONS.MEDICATIONS.TEMPLATE) && {
              template_medications: {
                ...templateMedication,
              },
            }),
            template_vitals: {
              ...templateVital,
            },
            template_diets: allTemplateDiets,
            food_items: allFoodItems,
            food_item_details: allFoodItemDetails,
            portions: allPortions,

            template_workouts: allTemplateWorkouts,
            exercise_details: allExerciseDetails,
            exercises: allExercises,
            exercise_contents: exerciseContentData,
            repetitions: allRepetitions,

            vital_templates: {
              ...vitalTemplates,
            },
            ...(permissions.includes(PERMISSIONS.MEDICATIONS.TEMPLATE) && {
              medicines: {
                ...medicineData,
              },
            }),
            care_plan_template_ids: carePlanTemplateIds,
          },
          "Templates fetched successfully"
        );
      } else {
        return raiseSuccess(res, 200, {}, "No templates created at the moment");
      }
    } catch (error) {
      Log.debug("getAllForDoctor 500 error", error);
      return raiseServerError(res);
    }
  };

  duplicate = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { params: { id } = {} } = req;
      const {
        userDetails: {
          userId,
          userData: { category } = {},
          userCategoryId,
        } = {},
        permissions = [],
      } = req;

      Log.info(`careplan template id to duplicate : ${id}`);

      if (!id) {
        return raiseClientError(
          res,
          422,
          {},
          "Please select correct template to duplicate"
        );
      }

      const currentTemplate =
        (await carePlanTemplateService.getCarePlanTemplateById(id)) || null;

      if (currentTemplate) {
        const template = await CarePlanTemplateWrapper(currentTemplate);
        const {
          care_plan_templates,
          template_vitals,
          template_medications,
          template_appointments,
          template_diets,
          template_workouts,
        } = await template.getReferenceInfo();

        const {
          basic_info: { name, treatment_id, severity_id, condition_id } = {},
          template_appointment_ids,
          template_medication_ids,
          template_vital_ids,
          template_diet_ids,
          template_workout_ids,
        } = care_plan_templates[template.getCarePlanTemplateId()] || {};

        // appointments
        const appointmentData = template_appointment_ids.map((id) => {
          const { reason, time_gap, details, provider_id, provider_name } =
            template_appointments[id] || {};

          return {
            reason,
            time_gap,
            details,
            provider_id,
            provider_name,
          };
        });

        // medications
        let medicationData = {};

        if (permissions.includes(PERMISSIONS.MEDICATIONS.TEMPLATE)) {
          medicationData = template_medication_ids.map((id) => {
            const {
              basic_info: { medicine_id },
              schedule_data,
            } = template_medications[id] || {};

            return {
              medicine_id,
              schedule_data,
            };
          });
        }

        // vitals (ACTIONS)
        const vitalData = template_vital_ids.map((id) => {
          const {
            basic_info: { vital_template_id },
            details,
          } = template_vitals[id] || {};

          return {
            vital_template_id,
            details,
          };
        });

        // diets
        const dietData = template_diet_ids.map((id) => {
          const {
            basic_info: { name },
            total_calories,
            duration,
            details,
          } = template_diets[id] || {};

          return {
            name: `${name} Copy`,
            total_calories,
            duration,
            details,
          };
        });

        // workouts
        const workoutData = template_workout_ids.map((id) => {
          const {
            basic_info: { name },
            total_calories,
            duration,
            time,
            details,
          } = template_workouts[id] || {};

          return {
            name: `${name} Copy`,
            total_calories,
            duration,
            time,
            details,
          };
        });

        const duplicateName = `${name}${TEMPLATE_DUPLICATE_TEXT}`;

        const newTemplateData = {
          name: duplicateName,
          treatment_id,
          severity_id,
          condition_id,
          user_id: userId,
          template_appointments: appointmentData,
          ...(permissions.includes(PERMISSIONS.MEDICATIONS.TEMPLATE) && {
            template_medications: medicationData,
          }),
          template_vitals: vitalData,
          template_diets: dietData,
          template_workouts: workoutData,
        };

        // check for existing template names
        const existingTemplate =
          (await carePlanTemplateService.getSingleTemplateByData({
            name: duplicateName,
            user_id: userId,
          })) || null;

        let isDuplicate = false;

        if (existingTemplate) {
          // check if previousTemplate name is same
          if (id !== `${existingTemplate.get("id")}`) {
            isDuplicate = true;
          }
        }

        if (!isDuplicate) {
          const createCarePlanTemplate = await carePlanTemplateService.create(
            newTemplateData
          );
          const carePlanTemplate = await CarePlanTemplateWrapper(
            createCarePlanTemplate
          );

          //------------------>>>

          const allCareplanTemplates =
            (await carePlanTemplateService.getAllTemplatesForDoctor({
              user_id: userId,
            })) || [];

          let carePlanTemplateIds = [];

          if (allCareplanTemplates.length > 0) {
            for (let index = 0; index < allCareplanTemplates.length; index++) {
              const template = await CarePlanTemplateWrapper(
                allCareplanTemplates[index]
              );

              carePlanTemplateIds.push(template.getCarePlanTemplateId());
            }
          }

          //<<---------------------

          let exerciseContentData = {};
          const { exercises: allExercises = {} } =
            await carePlanTemplate.getReferenceInfo();

          const exerciseContentService = new ExerciseContentService();

          for (let each in allExercises) {
            const exercise = allExercises[each] || {};
            const { basic_info: { id = null } = {} } = exercise || {};
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
          }

          return raiseSuccess(
            res,
            200,
            {
              ...(await carePlanTemplate.getReferenceInfo()),
              care_plan_template_ids: carePlanTemplateIds,
              exercise_contents: exerciseContentData,
            },
            "Template duplicate successfully"
          );
        } else {
          return raiseClientError(
            res,
            422,
            {},
            `Template already present with name ${duplicateName} for this user. Change that to continue`
          );
        }
      } else {
        return raiseSuccess(
          res,
          200,
          {},
          "No template present for the id to duplicate"
        );
      }
    } catch (error) {
      Log.debug("duplicate 500 error", error);
      return raiseServerError(res);
    }
  };

  update = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        params: { id: careplanTemplateId } = {},
        body = {},
        permissions = [],
      } = req;
      Log.info(`careplan template id : ${careplanTemplateId}`);
      Log.debug("request body", body);

      const {
        userDetails: {
          userId,
          userData: { category } = {},
          userCategoryId,
        } = {},
      } = req;

      if (!careplanTemplateId) {
        return raiseClientError(
          res,
          422,
          {},
          "Please select correct template to update"
        );
      }

      const {
        medicationsData,
        appointmentsData,
        vitalsData,
        dietData,
        workoutData,
        name,
      } = body;

      if (
        !permissions.includes(PERMISSIONS.MEDICATIONS.ADD) &&
        medicationsData.length > 0
      ) {
        return raiseClientError(
          res,
          422,
          {},
          `Medication creation is not allowed. Please remove the same to continue`
        );
      }

      // check for existing template names
      const existingTemplate =
        (await carePlanTemplateService.getSingleTemplateByData({
          name,
          user_id: userId,
        })) || null;

      let isDuplicate = false;

      if (existingTemplate) {
        // check if previousTemplate name is same
        if (careplanTemplateId !== `${existingTemplate.get("id")}`) {
          isDuplicate = true;
        }
      }

      if (!isDuplicate) {
        const updateTemplate =
          (await carePlanTemplateService.update(
            {
              name,
            },
            careplanTemplateId
          )) || null;

        // template appointments
        if (appointmentsData.length > 0) {
          for (let index = 0; index < appointmentsData.length; index++) {
            const { id = null, ...rest } = appointmentsData[index] || {};
            if (id) {
              // update
              await templateAppointmentService.update(rest, id);
            } else {
              // create
              await templateAppointmentService.addTemplateAppointment({
                ...rest,
                care_plan_template_id: careplanTemplateId,
              });
            }
          }
        }

        // template medications
        if (
          permissions.includes(PERMISSIONS.MEDICATIONS.TEMPLATE) &&
          medicationsData.length > 0
        ) {
          for (let index = 0; index < medicationsData.length; index++) {
            const { id = null, ...rest } = medicationsData[index] || {};
            if (id) {
              // update
              await templateMedicationService.update(rest, id);
            } else {
              // create
              await templateMedicationService.addTemplateMedication({
                ...rest,
                care_plan_template_id: careplanTemplateId,
              });
            }
          }
        }

        // template vitals
        if (vitalsData.length > 0) {
          const templateVitalService = new TemplateVitalService();
          for (let index = 0; index < vitalsData.length; index++) {
            const { id = null, ...rest } = vitalsData[index] || {};
            if (id) {
              // update
              await templateVitalService.update(rest, id);
            } else {
              // create
              await templateVitalService.create({
                ...rest,
                care_plan_template_id: careplanTemplateId,
              });
            }
          }
        }

        // template diets
        if (dietData.length > 0) {
          const templateDietService = new TemplateDietService();
          for (let index = 0; index < dietData.length; index++) {
            const {
              id = null,
              start_date,
              end_date,
              ...rest
            } = dietData[index] || {};

            if (id) {
              // update
              await templateDietService.update(rest, id);
            } else {
              // create
              await templateDietService.create({
                ...rest,
                care_plan_template_id: careplanTemplateId,
              });
            }
          }
        }

        // template workouts
        if (workoutData.length > 0) {
          const templateWorkoutService = new TemplateWorkoutService();
          for (let index = 0; index < workoutData.length; index++) {
            const {
              id = null,
              start_date,
              end_date,
              ...rest
            } = workoutData[index] || {};

            if (id) {
              // update
              await templateWorkoutService.update(rest, id);
            } else {
              // create
              await templateWorkoutService.create({
                ...rest,
                care_plan_template_id: careplanTemplateId,
              });
            }
          }
        }

        Log.debug("updateTemplate value", updateTemplate);

        if (updateTemplate !== null && updateTemplate.length > 0) {
          const template = await CarePlanTemplateWrapper(
            null,
            careplanTemplateId
          );

          let exerciseContentData = {};
          const { exercises: allExercises = {} } =
            await template.getReferenceInfo();

          const exerciseContentService = new ExerciseContentService();

          for (let each in allExercises) {
            const exercise = allExercises[each] || {};
            const { basic_info: { id = null } = {} } = exercise || {};
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
          }

          return raiseSuccess(
            res,
            200,
            {
              ...(await template.getReferenceInfo()),
              exercise_contents: exerciseContentData,
            },
            "Template updated successfully"
          );
        } else {
          return raiseClientError(
            res,
            422,
            {},
            "Please check values for the template"
          );
        }
      } else {
        return raiseClientError(
          res,
          422,
          {},
          `Template already present with name ${name} for this user.`
        );
      }
    } catch (error) {
      Log.debug("update 500 error", error);
      return raiseServerError(res);
    }
  };

  delete = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        params: { id } = {},
        query: {
          appointment = null,
          medication = null,
          vital = null,
          diet = null,
          workout = null,
        } = {},
        permissions = [],
      } = req;

      Log.info(
        `Template = id : ${id} | appointment : ${appointment} | medication : ${medication} | vital : ${vital} | diet : ${diet} | workout : ${workout}`
      );

      if (!id) {
        return raiseClientError(res, 422, {}, "Please select valid template");
      }

      let templateData = {};

      const templateVitalService = new TemplateVitalService();
      const templateDietService = new TemplateDietService();
      const templateWorkoutService = new TemplateWorkoutService();

      if (appointment || medication || vital || diet || workout) {
        // appointment
        if (appointment) {
          await templateAppointmentService.deleteAppointment({
            id: appointment,
          });
        }

        // medication
        if (
          permissions.includes(PERMISSIONS.MEDICATIONS.TEMPLATE) &&
          medication
        ) {
          await templateMedicationService.deleteMedication({
            id: medication,
          });
        }

        // vital
        if (vital) {
          await templateVitalService.deleteVital({
            id: vital,
          });
        }

        // diet
        if (diet) {
          await templateDietService.delete({
            id: diet,
          });
        }

        // workout
        if (workout) {
          await templateWorkoutService.delete({
            id: workout,
          });
        }

        const updatedTemplate = await CarePlanTemplateWrapper(null, id);
        templateData = {
          ...templateData,
          ...(await updatedTemplate.getReferenceInfo()),
        };
      } else {
        // delete template

        await carePlanTemplateService.deleteTemplate({
          id,
        });

        // delete all other templates attached to template id
        await templateAppointmentService.deleteAppointment({
          care_plan_template_id: id,
        });

        await templateMedicationService.deleteMedication({
          care_plan_template_id: id,
        });

        await templateVitalService.deleteVital({
          care_plan_template_id: id,
        });

        await templateDietService.delete({
          care_plan_template_id: id,
        });

        await templateWorkoutService.delete({
          care_plan_template_id: id,
        });
      }

      return raiseSuccess(
        res,
        200,
        {
          ...templateData,
        },
        "Template related details deleted successfully"
      );
    } catch (error) {
      Log.debug("delete 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new CarePlanTemplateController();
