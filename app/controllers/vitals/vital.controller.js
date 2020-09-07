import Controller from "../";
import Logger from "../../../libs/log";

// SERVICES
import VitalTemplateService from "../../services/vitalTemplates/vitalTemplate.service";
import VitalService from "../../services/vitals/vital.service";
import FeatureDetailService from "../../services/featureDetails/featureDetails.service";

// WRAPPERS
import VitalTemplateWrapper from "../../ApiWrapper/web/vitalTemplates";
import VitalWrapper from "../../ApiWrapper/web/vitals";
import FeatureDetailWrapper from "../../ApiWrapper/web/featureDetails";
import CarePlanWrapper from "../../ApiWrapper/web/carePlan";
import DoctorWrapper from "../../ApiWrapper/web/doctor";
import PatientWrapper from "../../ApiWrapper/web/patient";

import {DAYS, EVENT_TYPE, FEATURE_TYPE} from "../../../constant";
import EventSchedule from "../../eventSchedules";

const Log = new Logger("WEB > VITALS > CONTROLLER");

class VitalController extends Controller {
    constructor() {
        super();
    }

    create = async (req, res) => {
        const {raiseSuccess, raiseClientError, raiseServerError} = this;
        Log.debug("req.body --->", req.body);
        try {
            const {
                userDetails: {userId, userData: {category} = {}} = {},
                body : {
                    care_plan_id,
                vital_template_id,
                    repeat_interval_id,
                    start_date,
                    end_date,
                    repeat_days,
                    description
            } = {}} = req;

            const doesVitalExists = await VitalService.getByData({care_plan_id, vital_template_id});

            if(!doesVitalExists) {
                const vitalData = await VitalService.addVital({
                    care_plan_id,
                    vital_template_id,
                    start_date,
                    end_date,
                    details: {
                        repeat_interval_id,
                        repeat_days,
                    },
                    description
                });

                const vitals = await VitalWrapper({id: vitalData.get("id")});
                const carePlan = await CarePlanWrapper(null, vitals.getCarePlanId());

                const doctor = await DoctorWrapper(null, carePlan.getDoctorId());
                const patient = await PatientWrapper(null, carePlan.getPatientId());

                const eventScheduleData = {
                    event_id: vitals.getVitalId(),
                    event_type: EVENT_TYPE.VITALS,
                    critical: false,
                    start_date,
                    end_date,
                    details: vitals.getBasicInfo(),
                    participants: [doctor.getUserId(), patient.getUserId()],
                    actor: {
                        id: userId,
                        category
                    }
                };

                // RRule
                await EventSchedule.create(eventScheduleData);

                return raiseSuccess(
                    res,
                    200,
                    {
                        vitals: {
                            [vitals.getVitalId()]: vitals.getBasicInfo()
                        },
                        ... await vitals.getReferenceInfo(),
                    },
                    "Vital added successfully"
                );
            } else {
                return raiseClientError(res, 422, {}, "Vital already added for the patient");
            }
        } catch(error) {
            Log.debug("vitals create 500 error", error);
            return raiseServerError(res);
        }
    };

    getVitalFormDetails = async (req, res) => {
        const {raiseSuccess, raiseServerError} = this;
        try {

            const vitalData = await FeatureDetailService.getDetailsByData({feature_type: FEATURE_TYPE.VITAL});

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
        } catch(error) {
            Log.debug("getVitalFormDetails 500 error", error);
            return raiseServerError(res);
        }
    };

    search = async (req, res) => {
        const {raiseSuccess, raiseClientError, raiseServerError} = this;
      try {
          Log.debug("req.query --->", req.query);
          const {query: {value} = {}} = req;

          const vitalTemplates = await VitalTemplateService.searchByData(value);
          const templateDetails = {};
          const templateIds = [];

          if(vitalTemplates.length > 0) {
              for(const data of vitalTemplates) {
                  const vitalData = await VitalTemplateWrapper({data});
                  templateDetails[vitalData.getVitalTemplateId()] = vitalData.getBasicInfo();
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
              )
          } else {
              return raiseClientError(res, 422, {}, "No vital exists with this name");
          }
      } catch(error) {
          Log.debug("vitals search 500 error", error);
          return raiseServerError(res);
      }
    };
}

export default new VitalController();