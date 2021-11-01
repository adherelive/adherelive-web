// services
import BaseCarePlanTemplate from "../../../services/carePlanTemplate";
import carePlanTemplateService from "../../../services/carePlanTemplate/carePlanTemplate.service";
import medicineService from "../../../services/medicine/medicine.service";
import vitalTemplateService from "../../../services/vitalTemplates/vitalTemplate.service";

// wrapper
import TemplateAppointmentWrapper from "../../../ApiWrapper/mobile/templateAppointment";
import TemplateMedicationWrapper from "../../../ApiWrapper/mobile/templateMedication";
import MedicineWrapper from "../../../ApiWrapper/mobile/medicine";
import TemplateVitalWrapper from "../../mobile/templateVital";
import VitalTemplateWrapper from "../../mobile/vitalTemplates";
import TemplateDietWrapper from "../templateDiet";
import TemplateWorkoutWrapper from "../templateWorkout";

class CarePlanTemplateWrapper extends BaseCarePlanTemplate {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data } = this;
    const {
      id,
      name,
      treatment_id,
      severity_id,
      condition_id,
      user_id,
      details = {},
      createdAt = null,
    } = _data || {};

    return {
      basic_info: {
        id,
        name,
        treatment_id,
        severity_id,
        condition_id,
        user_id,
      },
      details,
      created_at: createdAt,
    };
  };

  getBasic = () => {
    const { _data, getCarePlanTemplateId } = this;
    const {
      id,
      name,
      treatment_id,
      severity_id,
      condition_id,
      user_id,
      details = {},
    } = _data || {};

    return {
      care_plan_templates: {
        [getCarePlanTemplateId()]: {
          basic_info: {
            id,
            name,
            treatment_id,
            severity_id,
            condition_id,
            user_id,
          },
          details,
        },
      },
    };
  };

  // TODO ::
  getReferenceInfo = async () => {
    const {
      getBasic,
      getTemplateAppointments,
      getTemplateMedications,
      getTemplateVitals,
      getTemplateDiets,
      getTemplateWorkouts,
    } = this;

    let templateAppointments = [];
    let templateMedications = [];
    let medicines = [];

    let appointmentIds = [];
    let medicationIds = [];
    let medicineIds = [];

    for (const templateAppointment of getTemplateAppointments()) {
      const data = await TemplateAppointmentWrapper(templateAppointment);
      templateAppointments[data.getTemplateAppointmentId()] =
        data.getBasicInfo();
      appointmentIds.push(data.getTemplateAppointmentId());
    }

    for (const templateMedication of getTemplateMedications()) {
      const data = await TemplateMedicationWrapper(templateMedication);
      templateMedications[data.getTemplateMedicationId()] = data.getBasicInfo();
      medicationIds.push(data.getTemplateMedicationId());
      medicineIds.push(data.getTemplateMedicineId());
      // const medicineData = await MedicineWrapper(data.getMedicines());
      // medicines[medicineData.getMedicineId()] = medicineData.getBasicInfo();
    }

    // vital templates (careplan_template)
    let templateVitalIds = [];
    let templateVitals = {};

    // vital templates (vitals)
    let vitalTemplateIds = [];

    const allVitals = getTemplateVitals();
    if (allVitals.length > 0) {
      for (let index = 0; index < allVitals.length; index++) {
        const templateVital = await TemplateVitalWrapper({
          data: allVitals[index],
        });
        templateVitals[templateVital.getId()] = templateVital.getBasicInfo();
        templateVitalIds.push(templateVital.getId());
        vitalTemplateIds.push(templateVital.getVitalTemplateId());
      }
    }

    // get vital templates
    let vitalTemplates = {};

    const allVitalTemplates =
      (await vitalTemplateService.getAllByData({
        id: vitalTemplateIds,
      })) || [];

    if (allVitalTemplates.length > 0) {
      for (let index = 0; index < allVitalTemplates.length; index++) {
        const vitalTemplate = await VitalTemplateWrapper({
          data: allVitalTemplates[index],
        });
        vitalTemplates[vitalTemplate.getVitalTemplateId()] =
          vitalTemplate.getBasicInfo();
      }
    }

    // diet_templates
    let templateDietIds = [];
    let allTemplateDiets = {};
    let allPortions = {};
    let allFoodItemDetails = {};
    let allFoodItems = {};

    const allDiets = getTemplateDiets() || [];
    if (allDiets.length > 0) {
      for (let index = 0; index < allDiets.length; index++) {
        const templateDiet = await TemplateDietWrapper({
          data: allDiets[index],
        });
        const { template_diets, portions, food_item_details, food_items } =
          await templateDiet.getReferenceInfo();
        allTemplateDiets = { ...allTemplateDiets, ...template_diets };
        allFoodItemDetails = { ...allFoodItemDetails, ...food_item_details };
        allFoodItems = { ...allFoodItems, ...food_items };
        allPortions = { ...allPortions, ...portions };
        templateDietIds.push(templateDiet.getId());
      }
    }

    // workout_templates
    let templateWorkoutIds = [];
    let allTemplateWorkouts = {};
    let allRepetitions = {};
    let allExerciseDetails = {};
    let allExercises = {};

    const allWorkouts = getTemplateWorkouts() || [];
    if (allWorkouts.length > 0) {
      for (let index = 0; index < allWorkouts.length; index++) {
        const templateWorkout = await TemplateWorkoutWrapper({
          data: allWorkouts[index],
        });
        const { template_workouts, repetitions, exercise_details, exercises } =
          await templateWorkout.getReferenceInfo();
        allTemplateWorkouts = { ...allTemplateWorkouts, ...template_workouts };
        allExerciseDetails = { ...allExerciseDetails, ...exercise_details };
        allExercises = { ...allExercises, ...exercises };
        allRepetitions = { ...allRepetitions, ...repetitions };
        templateWorkoutIds.push(templateWorkout.getId());
      }
    }

    const medicineData = await medicineService.getMedicineByData({
      id: medicineIds,
    });

    for (const medicine of medicineData) {
      const data = await MedicineWrapper(medicine);
      medicines[data.getMedicineId()] = data.getBasicInfo();
    }

    return {
      care_plan_templates: {
        [this.getCarePlanTemplateId()]: {
          ...this.getBasicInfo(),
          template_appointment_ids: appointmentIds,
          template_medication_ids: medicationIds,
          template_vital_ids: templateVitalIds,
          template_diet_ids: templateDietIds,
          template_workout_ids: templateWorkoutIds,
        },
      },
      template_appointments: {
        ...templateAppointments,
      },
      template_medications: {
        ...templateMedications,
      },
      template_vitals: {
        ...templateVitals,
      },
      template_diets: allTemplateDiets,
      food_items: allFoodItems,
      food_item_details: allFoodItemDetails,
      portions: allPortions,

      template_workouts: allTemplateWorkouts,
      exercise_details: allExerciseDetails,
      exercises: allExercises,
      repetitions: allRepetitions,

      medicines: {
        ...medicines,
      },
      vital_templates: {
        ...vitalTemplates,
      },
      care_plan_template_id: this.getCarePlanTemplateId(),
    };
  };

  getReferenceInfoWithImp = async () => {
    const {
      getTemplateAppointments,
      getTemplateMedications,
      getTemplateVitals,
      getTemplateDiets,
      getTemplateWorkouts,
    } = this;

    let templateAppointments = [];
    let templateMedications = [];
    
    let appointmentIds = [];
    let medicationIds = [];
    let medicineIds = [];

    for (const templateAppointment of getTemplateAppointments()) {
      const data = await TemplateAppointmentWrapper(templateAppointment);
      templateAppointments[data.getTemplateAppointmentId()] =
        data.getBasicInfo();
      appointmentIds.push(data.getTemplateAppointmentId());
    }

    for (const templateMedication of getTemplateMedications()) {
      const data = await TemplateMedicationWrapper(templateMedication);
      templateMedications[data.getTemplateMedicationId()] = data.getBasicInfo();
      medicationIds.push(data.getTemplateMedicationId());
      medicineIds.push(data.getTemplateMedicineId());
      // const medicineData = await MedicineWrapper(data.getMedicines());
      // medicines[medicineData.getMedicineId()] = medicineData.getBasicInfo();
    }

    // vital templates (careplan_template)
    let templateVitalIds = [];
    let templateVitals = {};

    // vital templates (vitals)

    const allVitals = getTemplateVitals();
    if (allVitals.length > 0) {
      for (let index = 0; index < allVitals.length; index++) {
        const templateVital = await TemplateVitalWrapper({
          data: allVitals[index],
        });
        templateVitals[templateVital.getId()] = templateVital.getBasicInfo();
        templateVitalIds.push(templateVital.getId());
      }
    }

    // diet_templates
    let templateDietIds = [];
    const allDiets = getTemplateDiets() || [];
    if (allDiets.length > 0) {
      for (let index = 0; index < allDiets.length; index++) {
        const templateDiet = await TemplateDietWrapper({
          data: allDiets[index],
        });
        templateDietIds.push(templateDiet.getId());
      }
    }
    // workout_templates
    let templateWorkoutIds = [];
    const allWorkouts = getTemplateWorkouts() || [];
    if (allWorkouts.length > 0) {
      for (let index = 0; index < allWorkouts.length; index++) {
        const templateWorkout = await TemplateWorkoutWrapper({
          data: allWorkouts[index],
        });
        templateWorkoutIds.push(templateWorkout.getId());
      }
    }
    return {
      care_plan_templates: {
        [this.getCarePlanTemplateId()]: {
          ...this.getBasicInfo(),
          template_appointment_ids: appointmentIds,
          template_medication_ids: medicationIds,
          template_vital_ids: templateVitalIds,
          template_diet_ids: templateDietIds,
          template_workout_ids: templateWorkoutIds,
        },
      },
      template_appointments: {
        ...templateAppointments,
      },
      template_medications: {
        ...templateMedications,
      },
     
      care_plan_template_id: this.getCarePlanTemplateId(),
    };
  };
}

export default async (data = null, id = null) => {
  if (data) {
    return new CarePlanTemplateWrapper(data);
  }
  const carePlanTemplate =
    await carePlanTemplateService.getCarePlanTemplateById(id);
  return new CarePlanTemplateWrapper(carePlanTemplate);
};
