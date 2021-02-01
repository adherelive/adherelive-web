import Controller from "../../";
import Logger from "../../../../libs/log";

// services
import carePlanTemplateService from "../../../services/carePlanTemplate/carePlanTemplate.service";

// wrapper
import CarePlanTemplateWrapper from "../../../ApiWrapper/mobile/carePlanTemplate";

import {TEMPLATE_DUPLICATE_TEXT, USER_CATEGORY} from "../../../../constant";
import TemplateVitalService from "../../../services/templateVital/templateVital.service";
import templateAppointmentService from "../../../services/templateAppointment/templateAppointment.service";
import templateMedicationService from "../../../services/templateMedication/templateMedication.service";

const Log = new Logger("MOBILE > CAREPLAN_TEMPLATE > CONTROLLER");

class CarePlanTemplateController extends Controller {
  constructor() {
    super();
  }

  create = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        body,
        userDetails: { userId, userData: { category } } = {}
      } = req;
      const {
        medicationsData,
        appointmentsData,
        vitalsData,
        name
      } = body || {};

      Log.info(`name : ${name}`);

      if(category !== USER_CATEGORY.DOCTOR) {
        return raiseClientError(res, 422, {}, "UNAUTHORIZED");
      }

      const existingTemplate = await carePlanTemplateService.getSingleTemplateByData({
        name
      }) || null;

      if(!existingTemplate) {
        const createTemplate = await carePlanTemplateService.create({
          name,
          user_id: userId,
          template_appointments: appointmentsData,
          template_medications: medicationsData,
          template_vitals: vitalsData
        }) || null;

        Log.debug("createTemplate value", createTemplate);

        if(createTemplate) {
          const template = await CarePlanTemplateWrapper(createTemplate);
         
          const allCareplanTemplates =
          (await carePlanTemplateService.getAllTemplatesForDoctor({
            user_id: userId
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
          
          return raiseSuccess(
              res,
              200,
              {
                ...await template.getReferenceInfo(),
                care_plan_template_ids: carePlanTemplateIds

              },
              "Template created successfully"
          );
        } else {
          return raiseClientError(res, 422, {}, "Please check values entered");
        }
      } else {
        return raiseClientError(res, 422, {}, `Template already present for name ${name}. Please use different to continue`);
      }

    } catch (error) {
      Log.debug("create 500 error", error);
      return raiseServerError(res);
    }
  };

  getAllForDoctor = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        userDetails: {
          userId,
          userData: { category } = {},
          userCategoryId
        } = {}
      } = req;

      if (category !== USER_CATEGORY.DOCTOR) {
        return raiseClientError(res, 422, {}, "Unauthorized");
      }

      const allCareplanTemplates =
          (await carePlanTemplateService.getAllTemplatesForDoctor({
            user_id: userId
          })) || [];

      let carePlanTemplate = {};
      let templateAppointment = {};
      let templateMedication = {};
      let templateVital = {};
      let vitalTemplates = {};
      let medicineData = {};

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
            medicines
          } = await template.getReferenceInfo();

          carePlanTemplate = { ...carePlanTemplate, ...care_plan_templates };
          carePlanTemplateIds.push(template.getCarePlanTemplateId());

          templateAppointment = {
            ...templateAppointment,
            ...template_appointments
          };
          templateMedication = {
            ...templateMedication,
            ...template_medications
          };
          templateVital = { ...templateVital, ...template_vitals };

          vitalTemplates = { ...vitalTemplates, ...vital_templates };
          medicineData = { ...medicineData, ...medicines };
        }

        return raiseSuccess(
            res,
            200,
            {
              care_plan_templates: {
                ...carePlanTemplate
              },
              template_appointments: {
                ...templateAppointment
              },
              template_medications: {
                ...templateMedication
              },
              template_vitals: {
                ...templateVital
              },
              vital_templates: {
                ...vitalTemplates
              },
              medicines: {
                ...medicineData
              },
              care_plan_template_ids: carePlanTemplateIds
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
      const { params: { id } = {}, userDetails: {userId} = {} } = req;
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
          template_appointments
        } = await template.getReferenceInfo();

        const {
          basic_info: {
            name,
            treatment_id,
            severity_id,
            condition_id,
            user_id
          } = {},
          template_appointment_ids,
          template_medication_ids,
          template_vital_ids
        } = care_plan_templates[template.getCarePlanTemplateId()] || {};

        // appointments
        const appointmentData = template_appointment_ids.map(id => {
          const {
            reason,
            time_gap,
            details,
            provider_id,
            provider_name,
          } = template_appointments[id] || {};

          return {
            reason,
            time_gap,
            details,
            provider_id,
            provider_name,
          };
        });

        // medications
        const medicationData = template_medication_ids.map(id => {
          const {
            basic_info: {medicine_id},
            schedule_data
          } = template_medications[id] || {};

          return {
            medicine_id,
            schedule_data
          };
        });

        // vitals (ACTIONS)
        const vitalData = template_vital_ids.map(id => {
          const {basic_info: {vital_template_id}, details} = template_vitals[id] || {};

          return {
            vital_template_id,
            details
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
          template_medications: medicationData,
          template_vitals: vitalData
        };

        // check for existing template names
        const existingTemplate = await carePlanTemplateService.getSingleTemplateByData({name: duplicateName}) || null;

        let isDuplicate = false;

        if(existingTemplate) {
          // check if previousTemplate name is same
          if(id !== `${existingTemplate.get("id")}`) {
            isDuplicate = true;
          }
        }

        if(!isDuplicate) {
          const createCarePlanTemplate = await carePlanTemplateService.create(newTemplateData);
          const carePlanTemplate = await CarePlanTemplateWrapper(createCarePlanTemplate);


          const allCareplanTemplates =
          (await carePlanTemplateService.getAllTemplatesForDoctor({
            user_id: userId
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


          return raiseSuccess(
              res,
              200,
              {
                ...await carePlanTemplate.getReferenceInfo(),
                care_plan_template_ids: carePlanTemplateIds

              },
              "Template duplicate successfully"
          );
        } else {
          return raiseClientError(res, 422, {}, `Template already present with name ${duplicateName}. Change that to continue`);
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
    const {raiseSuccess, raiseClientError, raiseServerError} = this;
    try {
      const {params: {id : careplanTemplateId} = {}, body = {}, userDetails: {userId} = {}} = req;
      Log.info(`careplan template id : ${careplanTemplateId}`);
      Log.debug("request body", body);

      if(!careplanTemplateId) {
        return raiseClientError(res, 422, {}, "Please select correct template to update");
      }

      const {
        medicationsData,
        appointmentsData,
        vitalsData,
        name,
      } = body;

      // check for existing template names
      const existingTemplate = await carePlanTemplateService.getSingleTemplateByData({name}) || null;

      let isDuplicate = false;

      if(existingTemplate) {
        // check if previousTemplate name is same
        if(careplanTemplateId !== `${existingTemplate.get("id")}`) {
          isDuplicate = true;
        }
      }

      if(!isDuplicate) {
        const updateTemplate = await carePlanTemplateService.update({
          name,
        }, careplanTemplateId) || null;

        // template appointments
        if(appointmentsData.length > 0) {
          for(let index = 0; index < appointmentsData.length; index++) {
            const {id = null, ...rest} = appointmentsData[index] || {};
            if(id) {
              // update
              await templateAppointmentService.update(rest, id);
            } else {
              // create
              await templateAppointmentService.addTemplateAppointment({...rest, care_plan_template_id: careplanTemplateId});
            }
          }
        }

        // template medications
        if(medicationsData.length > 0) {
          for(let index = 0; index < medicationsData.length; index++) {
            const {id = null, ...rest} = medicationsData[index] || {};
            if(id) {
              // update
              await templateMedicationService.update(rest, id);
            } else {
              // create
              await templateMedicationService.addTemplateMedication({...rest, care_plan_template_id: careplanTemplateId});
            }
          }
        }

        // template vitals
        if(vitalsData.length > 0) {
          const templateVitalService = new TemplateVitalService();
          for(let index = 0; index < vitalsData.length; index++) {
            const {id = null, ...rest} = vitalsData[index] || {};
            if(id) {
              // update
              await templateVitalService.update(rest, id);
            } else {
              // create
              await templateVitalService.create({...rest, care_plan_template_id: careplanTemplateId});
            }
          }
        }

        Log.debug("updateTemplate value", updateTemplate);

        if(updateTemplate !== null && updateTemplate.length > 0) {
          const template = await CarePlanTemplateWrapper(null, careplanTemplateId);

          return raiseSuccess(
              res,
              200,
              {
                ...await template.getReferenceInfo()
              },
              "Template updated successfully"
          );
        } else {
          return raiseClientError(res, 422, {}, "Please check values for the template");
        }
      } else {
        return raiseClientError(res, 422, {}, `Template already present with name ${name}`);
      }


    } catch(error) {
      Log.debug("update 500 error", error);
      return raiseServerError(res);
    }
  };

  delete = async (req, res) => {
    const {raiseSuccess, raiseClientError, raiseServerError} = this;
    try {
      const {params: {id} = {}, query: {appointment = null, medication = null, vital = null} = {}} = req;

      Log.info(`Template = id : ${id} | appointment : ${appointment} | medication : ${medication} | vital : ${vital}`);

      if(!id) {
        return raiseClientError(res, 422, {}, "Please select valid template");
      }

      let templateData = {};

      const templateVitalService = new TemplateVitalService();

      if(appointment || medication || vital) {

        // appointment
        if(appointment) {
          await templateAppointmentService.deleteAppointment({
            id: appointment
          });
        }

        // medication
        if(medication) {
          await templateMedicationService.deleteMedication({
            id: medication
          });
        }

        // vital
        if(vital) {
          await templateVitalService.deleteVital({
            id: vital
          });
        }

        const updatedTemplate = await CarePlanTemplateWrapper(null, id);
        templateData = {...templateData, ...await updatedTemplate.getReferenceInfo()};
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
      }

      return raiseSuccess(
          res,
          200,
          {
            ...templateData
          },
          "Template related details deleted successfully"
      );
    } catch(error) {
      Log.debug("delete 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new CarePlanTemplateController();
