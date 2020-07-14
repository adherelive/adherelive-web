import BaseDoctorRegistration from "../../../services/doctorRegistration";
import doctorRegistrationService from "../../../services/doctorRegistration/doctorRegistration.service";

class DoctorRegistrationWrapper extends BaseDoctorRegistration {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
        const {_data} = this;
        const {
            id,
            doctor_id,
            number,
            council,
            year,
            expiry_date
        } = _data || {};
        return {
            basic_info: {
                id,
                doctor_id,
                number,
                council,
                year,
            },
            expiry_date
        };
    };
}

export default async (data = null, id = null) => {
    if(data) {
        return new DoctorRegistrationWrapper(data);
    }
    const doctorRegistration = await doctorRegistrationService.getRegistrationById(id);
    return new DoctorRegistrationWrapper(doctorRegistration);
};