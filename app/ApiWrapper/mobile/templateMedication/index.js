import BaseTemplateMedication from "../../../services/templateMedication";
import templateMedicationService from "../../../services/templateMedication/templateMedication.service";

class TemplateMedicationWrapper extends BaseTemplateMedication {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data } = this;
    const { id, care_plan_template_id, medicine_id, schedule_data } =
      _data || {};
    return {
      basic_info: {
        id,
        care_plan_template_id,
        medicine_id,
      },
      schedule_data,
    };
  };
}

export default async (data = null, id = null) => {
  if (data !== null) {
    return new TemplateMedicationWrapper(data);
  }
  const templateMedication =
    await templateMedicationService.getSingleTemplateMedicationByData({ id });
  return new TemplateMedicationWrapper(templateMedication.get());
};
