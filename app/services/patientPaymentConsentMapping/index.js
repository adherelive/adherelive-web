export default class PatientConsentMapping {
  constructor(data) {
    this._data = data;
  }

  getId = () => {
    return this._data.id;
    }   

  getProviderTermsMappingId = () => {
    return this._data.provider_terms_mapping_id;
    }

  getPatientId = () => {
    return this._data.patient_id;
    }

  getDoctorId = () => {
    return this._data.doctor_id;
    }

  getPaymentTermsAccepted = () => {
    return this._data.payment_terms_accepted;
    }
}
