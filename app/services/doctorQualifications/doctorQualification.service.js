import doctorQualificationModel from "../../models/doctorQualifications";

class DoctorQualificationService {
    constructor() {}

    addQualification = async data => {
      try {
        
          const doctorQualification = await doctorQualificationModel.create(data);
          return doctorQualification;
      } catch(error) {
          throw error;
      }
    };

   
}

export default new DoctorQualificationService();