import doctorClinicModel from "../../models/doctorClinics";

class DoctorClinicService {
  constructor() {}

  addClinic = async (data) => {
    try {
      const doctorClinic = await doctorClinicModel.create(data);
      return doctorClinic;
    } catch (error) {
      throw error;
    }
  };

  getClinicForDoctor = async doctor_id => {
    try {
        const doctorClinic = await doctorClinicModel.findAll({
            where: {
                doctor_id
            }
        });
        return doctorClinic;
      } catch (error) {
        throw error;
      } 
  };

  getClinicById = async (id) => {
    try {
      const doctorClinic = await doctorClinicModel.findOne({
        where: {
          id,
        },
      });
      return doctorClinic;
    } catch (error) {
      throw error;
    }
  };
}

export default new DoctorClinicService();
