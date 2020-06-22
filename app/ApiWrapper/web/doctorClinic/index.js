import BaseDoctorClinic from "../../../services/doctorClinics";
import doctorClinicsService from "../../../services/doctorClinics/doctorClinics.service";

class DoctorClinicWrapper extends BaseDoctorClinic {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
        const {_data} = this;
        const {} = _data || {};
        return {
            basic_info: {

            }
        };
    };
}

export default async (data = null, id = null) => {
    if(data) {
        return new DoctorClinicWrapper(data);
    }
    const doctorClinic = await doctorClinicsService.getClinicById(id);
    return new DoctorClinicWrapper(doctorClinic.get());
};