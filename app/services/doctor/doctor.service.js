import Doctor from "../../models/doctors";

class DoctorService {

    getDoctorByData = async (data) => {
        try {
            const doctor = await Doctor.findOne({
                where: data
            });
            return doctor;
        } catch(error) {
            throw error;
        }
    }

    getAllDoctors = async () => {
        try {
            const doctors = await Doctor.findAll();
            return doctors;
        } catch(err) {
            throw err;
        }
    };
}

export default new DoctorService();