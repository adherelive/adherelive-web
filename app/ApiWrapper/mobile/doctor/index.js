import BaseDoctor from "../../../services/doctor";
import doctorService from "../../../services/doctor/doctor.service";


class MDoctorWrapper extends BaseDoctor {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
        const {_data} = this;
        const {
            id,
            user_id,
            gender,
            first_name,
            middle_name,
            last_name,
            address,
            qualifications,
            activated_on
        } = _data || {};
        return {
            basic_info: {
                id,
                user_id,
                gender,
                first_name,
                middle_name,
                last_name,
                address
            },
            qualifications,
            activated_on
        };
    }
}

export default async (data = null, userId = null) => {
    if(data) {
        return new MDoctorWrapper(data);
    }
    const doctor = await doctorService.getDoctorByData({user_id: userId});
    return new MDoctorWrapper(doctor);
}