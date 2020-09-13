import BaseVitalTemplates from "../../../services/vitalTemplates";
import VitalTemplateService from "../../../services/vitalTemplates/vitalTemplate.service";

class VitalTemplateWrapper extends BaseVitalTemplates {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
      const {_data} = this;
      const {name, id, unit, details} = _data || {};
      return {
          basic_info: {
              id,
              name,
              unit
          },
          details
      }
    };
}

export default async ({data = null, id = null}) => {
  if(data) {
      return new VitalTemplateWrapper(data);
  }
  const vitalTemplate = await VitalTemplateService.getByData({id});
  return new VitalTemplateWrapper(vitalTemplate);
};