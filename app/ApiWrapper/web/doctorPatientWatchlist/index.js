import BaseFeatureMapping from "../../../services/doctorPatientWatchlist";
import doctorPatientWatchlistService from "../../../services/doctorPatientWatchlist/doctorPatientWatchlist.service";

class DoctorPatientWatchlistWrapper extends BaseFeatureMapping {
  constructor(data) {
    super(data);
  }
  
  getBasicInfo = () => {
    const {_data} = this;
    const {id, doctor_id, patient_id, user_role_id, created_at} = _data || {};
    
    return {
      basic_info: {
        id,
        doctor_id,
        patient_id,
        user_role_id,
      },
      created_at,
    };
  };
}

export default async (data = null, id = null) => {
  if (data !== null) {
    return new DoctorPatientWatchlistWrapper(data);
  }
  const record = await doctorPatientWatchlistService.getByData({id});
  return new DoctorPatientWatchlistWrapper(record);
};
