import BaseTemplateVital from "../../../services/templateVital";
import TemplateVitalService from "../../../services/templateVital/templateVital.service";

class TemplateVitalWrapper extends BaseTemplateVital {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data } = this;
    const { id, care_plan_template_id, vital_template_id, details } =
      _data || {};
    return {
      basic_info: {
        id,
        care_plan_template_id,
        vital_template_id,
      },
      details,
    };
  };
}

export default async ({ data = null, id = null }) => {
  if (data !== null) {
    return new TemplateVitalWrapper(data);
  }
  const templateVitalService = new TemplateVitalService();
  const templateVital = await templateVitalService.getByData({ id });
  return new TemplateVitalWrapper(templateVital);
};
