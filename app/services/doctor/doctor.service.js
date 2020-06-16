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
}

export default new DoctorService();