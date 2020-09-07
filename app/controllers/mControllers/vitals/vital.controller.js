import Controller from "../../";
import Logger from "../../../../libs/log";

// SERVICES
import VitalService from "../../../services/vitals/vital.service";
import VitalTemplateService from "../../../services/vitalTemplates/vitalTemplate.service";
import FeatureDetailService from "../../../services/featureDetails/featureDetails.service";

// WRAPPERS
import VitalTemplateWrapper from "../../../ApiWrapper/mobile/vitalTemplates";
import VitalWrapper from "../../../ApiWrapper/mobile/vitals";
import FeatureDetailWrapper from "../../../ApiWrapper/mobile/featureDetails";

import {DAYS, FEATURE_TYPE} from "../../../../constant";

const Log = new Logger("MOBILE > VITALS > CONTROLLER");

class VitalController extends Controller {
    constructor() {
        super();
    }

    createVital = async (req, res) => {
        const {raiseSuccess, raiseClientError, raiseServerError} = this;
        Log.debug("req.body --->", req.body);
        try {
            const {
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

                return raiseSuccess(
                    res,
                    200,
                    {
                        vitals: {
                            ...vitals.getBasicInfo()
                        },
                        ... await vitals.getReferenceInfo(),
                        vital_ids: [vitals.getVitalId()]
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