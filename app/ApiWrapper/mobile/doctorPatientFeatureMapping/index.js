import BaseFeatureMapping from "../../../services/doctorPatientFeatureMapping";
import doctorPatientFeatureMappingService from "../../../services/doctorPatientFeatureMapping/doctorPatientFeatureMapping.service";

class FeatureMappingWrapper extends BaseFeatureMapping {
  constructor(data) {
    super(data);
  }
  
  getBasicInfo = () => {
    const {_data} = this;
    const {id, doctor_id, patient_id, feature_id} = _data || {};
    return {
      basic_info: {
        id,
        doctor_id,
        patient_id,
        feature_id,
      },
    };
  };
}

export default async (data = null, id = null) => {
  if (data !== null) {
    return new FeatureMappingWrapper(data);
  }
  const mapping = await doctorPatientFeatureMappingService.getById(id);
  return new FeatureMappingWrapper(mapping);
};
