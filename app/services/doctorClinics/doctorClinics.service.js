import doctorClinicModel from "../../models/doctorClinics";

class DoctorClinicService {
    constructor() {}

    addClinic = async data => {
      try {
        
          const doctorClinic = await doctorClinicModel.create(data);
          return doctorClinic;
      } catch(error) {
          throw error;
      }
    };

   
}

export default new DoctorClinicService();