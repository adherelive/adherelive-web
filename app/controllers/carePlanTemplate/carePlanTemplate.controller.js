import Controller from "../";
import moment from "moment";
import Log from "../../../libs/log_new";

// services
import carePlanTemplateService from "../../services/carePlanTemplate/carePlanTemplate.service";

// wrapper
import CarePlanTemplateWrapper from "../../ApiWrapper/web/carePlanTemplate";

Log.fileName("WEB > CAREPLAN_TEMPLATE > CONTROLLER");

class CarePlanTemplateController extends Controller {
  constructor() {
    super();
  }

  create = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const {
        body,
        userDetails: { userId, userData: { category } } = {}
      } = req;
      const {
        medicationsData,
        appointmentsData,
        treatment_id,
        severity_id,
        condition_id,
        name
      } = body || {};

      let appointmentsArr = [];
      let medicationsArr = [];

      for (const appointment of appointmentsData) {
        const {
          schedule_data: {
            description = "",
            end_time = "",
            organizer = {},
            treatment = "",
            participant_two = {},
            start_time = "",
            date = ""
          } = {},
          reason = "",
          time_gap = "",
          provider_id = null,
          provider_name = null,
          type = "",
          type_description = "",
          critical = false
        } = appointment || {};

        appointmentsArr.push({
          reason,
          time_gap,
          provider_id,
          // care_plan_template_id: carePlanTemplate.getCarePlanTemplateId(),
          details: {
            date,
            description,
            type_description,
            critical,
            appointment_type: type
          }
        });
      }

      for (const medication of medicationsData) {
        const {
          schedule_data: {
            end_date = "",
            description = "",
            start_date = "",
            unit = "",
            when_to_take = "",
            repeat = "",
            quantity = "",
            repeat_days = [],
            strength = "",
            start_time = "",
            repeat_interval = "",
            medication_stage = ""
          } = {},
          medicine_id = ""
        } = medication || {};

        medicationsArr.push({
          medicine_id,
          // care_plan_template_id: carePlanTemplate.getCarePlanTemplateId(),
          schedule_data: {
            unit,
            repeat,
            quantity,
            strength,
            repeat_days,
            when_to_take,
            repeat_interval,
            duration: moment(start_date).diff(moment(end_date), "days")
          }
        });
      }

      // create carePlan template for treatment
      const createCarePlanTemplate = await carePlanTemplateService.create({
        name,
        treatment_id,
        severity_id,
        condition_id,
        user_id: userId,
        template_appointments: [...appointmentsArr],
        template_medications: [...medicationsArr]
      });

      const carePlanTemplate = await CarePlanTemplateWrapper(
        createCarePlanTemplate
      );
      // await carePlanTemplate.getReferenceInfo();
      Log.debug(
        "appointmentsData --------------------->",
        createCarePlanTemplate
      );

      return raiseSuccess(
        res,
        200,
        {
          ...(await carePlanTemplate.getReferenceInfo())
        },
        "Care plan template created successfully"
      );
    } catch (error) {
      Log.debug("create 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new CarePlanTemplateController();
