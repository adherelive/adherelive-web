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

    getQualificationsByDoctorId = async doctor_id => {
        try {
            const doctorQualification = await doctorQualificationModel.findAll({
                where: {
                    doctor_id,
                    deleted_at:null
                }
            });
            return doctorQualification;
        } catch(error) {
            throw error;
        }
    };

   
}

export default new DoctorQualificationService();