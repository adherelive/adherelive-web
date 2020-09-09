import Logger from "../../../../libs/log";

import BaseVital from "../../../services/vitals";

// SERVICES
import VitalService from "../../../services/vitals/vital.service";

// WRAPPERS
import VitalTemplateWrapper from "../../../ApiWrapper/mobile/vitalTemplates";
import CarePlanWrapper from "../../../ApiWrapper/mobile/carePlan";

const Log = new Logger("MOBILE > API_WRAPPER > VITALS");

class VitalWrapper extends BaseVital {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
        const {_data} = this;
        const {id, vital_template_id, care_plan_id, start_date, end_date, details, description} = _data || {};

        return {
            basic_info: {
                id,
                vital_template_id,
                care_plan_id
            },
            details,
            start_date,
            end_date,
            description
        };
    };

    getReferenceInfo = async () => {
        const {_data} = this;
        const {getVitalId, vital_template, care_plan} = _data || {};

        const vitalTemplateData = {};
        const carePlanData = {};

        const vitalTemplates = await VitalTemplateWrapper({data: vital_template});
        vitalTemplateData[vitalTemplates.getVitalTemplateId()] = vitalTemplates.getBasicInfo();

        const carePlans = await CarePlanWrapper(care_plan);
        carePlanData[carePlans.getCarePlanId()] = await carePlans.getAllInfo();

        return {
            vital_templates: {
                ...vitalTemplateData
            },
            care_plans: {
                ...carePlanData,
            }
        }
    };
}

export default async ({data = null, id = null}) => {
  if(data) {
      return new VitalWrapper(data);
  }
  const vital = await VitalService.getByData({id});
  return new VitalWrapper(vital);
};