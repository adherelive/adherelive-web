import BaseTreatment from "../../../services/treatment";
import treatmentService from "../../../services/treatment/treatment.service";

class TreatmentWrapper extends BaseTreatment {
  constructor(data) {
    super(data);
  }
  
  getBasicInfo = () => {
    const {_data} = this;
    const {id, name} = _data || {};
    return {
      basic_info: {
        id,
        name,
      },
    };
  };
}

export default async (data = null, id = null) => {
  if (data !== null) {
    return new TreatmentWrapper(data);
  }
  const treatment = await treatmentService.getByData({id});
  return new TreatmentWrapper(treatment.get());
};
