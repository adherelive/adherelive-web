import BaseProvider from "../../../services/doctorProviderMapping";
import doctorProviderMappingService from "../../../services/doctorProviderMapping/doctorProviderMapping.service";

class DoctorProviderMappingWrapper extends BaseProvider {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data } = this;
    const { id, doctor_id, provider_id } = _data || {};

    return {
      basic_info: {
        id,
        doctor_id,
        provider_id
      }
    };
  };
}

export default async (data = null, id = null) => {
  if (data) {
    return new DoctorProviderMappingWrapper(data);
  }

  const provider = await doctorProviderMappingService.getDoctorProviderMappingByData(
    { id }
  );
  return new DoctorProviderMappingWrapper(provider);
};
