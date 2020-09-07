import Controller from "../../";
import Logger from "../../../../libs/log";
import moment from "moment";

// SERVICES
import VitalService from "../../../services/vitals/vital.service";
import VitalTemplateService from "../../../services/vitalTemplates/vitalTemplate.service";
import FeatureDetailService from "../../../services/featureDetails/featureDetails.service";

// WRAPPERS
import VitalTemplateWrapper from "../../../ApiWrapper/mobile/vitalTemplates";
import VitalWrapper from "../../../ApiWrapper/mobile/vitals";
import FeatureDetailWrapper from "../../../ApiWrapper/mobile/featureDetails";

import { DAYS, FEATURE_TYPE } from "../../../../constant";
import CarePlanWrapper from "../../../ApiWrapper/mobile/carePlan";
import DoctorWrapper from "../../../ApiWrapper/mobile/doctor";
import PatientWrapper from "../../../ApiWrapper/mobile/patient";
import twilioService from "../../../services/twilio/twilio.service";

const Log = new Logger("MOBILE > VITALS > CONTROLLER");

class VitalController extends Controller {
  constructor() {
    super();
  }

  createVital = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    Log.debug("req.body --->", req.body);
    try {
      const {
        body: {
          care_plan_id,
          vital_template_id,
          repeat_interval_id,
          start_date,
          end_date,
          repeat_days,
          description
        } = {}
      } = req;

      const doesVitalExists = await VitalService.getByData({
        care_plan_id,
        vital_template_id
      });

      if (!doesVitalExists) {
        const vitalData = await VitalService.addVital({
          care_plan_id,
          vital_template_id,
          start_date,
          end_date,
          details: {
            repeat_interval_id,
            repeat_days
          },
          description
        });

        const vitals = await VitalWrapper({ id: vitalData.get("id") });

        return raiseSuccess(
          res,
          200,
          {
            vitals: {
              [vitals.getVitalId()]: vitals.getBasicInfo()
            },
            ...(await vitals.getReferenceInfo())
          },
          "Vital added successfully"
        );
      } else {
        return raiseClientError(
          res,
          422,
          {},
          "Vital already added for the patient"
        );
      }
    } catch (error) {
      Log.debug("vitals create 500 error", error);
      return raiseServerError(res);
    }
  };

  getVitalFormDetails = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const vitalData = await FeatureDetailService.getDetailsByData({
        feature_type: FEATURE_TYPE.VITAL
      });

      const vitalDetails = await FeatureDetailWrapper(vitalData);

      return raiseSuccess(
        res,
        200,
        {
          ...vitalDetails.getFeatureDetails(),
          days: DAYS
        },
        "Vital form details fetched successfully"
      );
    } catch (error) {
      Log.debug("getVitalFormDetails 500 error", error);
      return raiseServerError(res);
    }
  };

  search = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      Log.debug("req.query --->", req.query);
      const { query: { value } = {} } = req;

      const vitalTemplates = await VitalTemplateService.searchByData(value);
      const templateDetails = {};
      const templateIds = [];

      if (vitalTemplates.length > 0) {
        for (const data of vitalTemplates) {
          const vitalData = await VitalTemplateWrapper({ data });
          templateDetails[
            vitalData.getVitalTemplateId()
          ] = vitalData.getBasicInfo();
          templateIds.push(vitalData.getVitalTemplateId());
        }

        return raiseSuccess(
          res,
          200,
          {
            vital_templates: {
              ...templateDetails
            },
            vital_template_ids: templateIds
          },
          "Vitals fetched successfully"
        );
      } else {
        return raiseClientError(res, 422, {}, "No vital exists with this name");
      }
    } catch (error) {
      Log.debug("vitals search 500 error", error);
      return raiseServerError(res);
    }
  };

  addVitalResponse = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      Log.debug("req.params --->", req.params);
      const { params: { id } = {}, body: { response = {} } = {} } = req;

      const vital = await VitalWrapper({ data: null, id });
      const vitalTemplate = await VitalTemplateWrapper({
        data: null,
        id: vital.getVitalTemplateId()
      });

      const carePlan = await CarePlanWrapper(null, vital.getCarePlanId());

      const doctorData = await DoctorWrapper(null, carePlan.getDoctorId());
      const patientData = await PatientWrapper(null, carePlan.getPatientId());

      let customMessage = `${vitalTemplate.getName()} Vital Update : `;

      for (const template of vitalTemplate.getTemplate()) {
        customMessage += `${template["label"]}: ${
          response[template["id"]] ? response[template["id"]] : "--"
        }${vitalTemplate.getUnit()}   `;
      }

      const twilioMsg = await twilioService.addSymptomMessage(
        doctorData.getUserId(),
        patientData.getUserId(),
        customMessage
      );

      const updateVitalResponse = await VitalService.update(
        {
          response: {
            vitals: [
              ...vital.getResponseValues(),
              {
                values: response,
                responseTime: moment()
                  .utc()
                  .toDate()
              }
            ]
          }
        },
        id
      );

      Log.debug("updateVitalResponse -->", updateVitalResponse);

      return raiseSuccess(
        res,
        200,
        {},
        `${vitalTemplate.getName().toUpperCase()} vital updated successfully`
      );
    } catch (error) {
      Log.debug("addVitalResponse 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new VitalController();
