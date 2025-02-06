import BasePatientConsentMapping from "../../../services/patientPaymentConsentMapping";
import patientPaymentConsentMappingService
    from "../../../services/patientPaymentConsentMapping/patientPaymentConsentMapping.service";

class PatientPaymentConsentMappingWrapper extends BasePatientConsentMapping {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data } = this;
    const {
      id,
      patient_id,
      doctor_id,
      provider_terms_mapping_id,
      payment_terms_accepted,
    } = _data || {};

    return {
      basic_info: {
        id,
        patient_id,
        doctor_id,
        provider_terms_mapping_id,
        payment_terms_accepted,
      },
    };
  };
}

export default async (data = null, id = null) => {
  if (data) {
    return new PatientPaymentConsentMappingWrapper(data);
  }
  const response =
    await patientPaymentConsentMappingService.getSingleEntityByData({ id });
  return new PatientPaymentConsentMappingWrapper(response);
};
