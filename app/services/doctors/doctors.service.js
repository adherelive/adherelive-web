import doctorModel from "../../models/doctors";

class DoctorsService {
    constructor() {}

    addDoctor = async data => {
      try {
          // todo: change to update when sign-in flow done for mobile
          const doctor = await doctorModel.create(data);
          return doctor;
      } catch(error) {
          throw error;
      }
    };

    getDoctorByUserId = async user_id => {
        try {
            const doctor = await doctorModel.findOne({
                where: {
                    user_id
                }
            });
            return doctor;
        } catch(error) {
            throw error;
        }
    };

    updateDoctor = async (data, id) => {
        try {
            const doctor = await doctorModel.update(data, {
                where: {
                    id
                }
            });
            return doctor;
        } catch (error) {
            throw error;
        }
    };

    getDoctorByData = async (data) => {
        try {
            const doctor = await doctorModel.findOne({
                where: data
            });
            return doctor;
        } catch(error) {
            throw error;
        }
    }
}

export default new DoctorsService();