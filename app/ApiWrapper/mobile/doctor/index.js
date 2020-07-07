import BaseDoctor from "../../../services/doctor";
import doctorService from "../../../services/doctor/doctor.service";
import {completePath} from "../../../helper/filePath";

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
            activated_on,
            profile_pic,
            city,
            speciality,
        } = _data || {};
        return {
            basic_info: {
                id,
                user_id,
                gender,
                first_name,
                middle_name,
                last_name,
                address,
                speciality,
                profile_pic: completePath(profile_pic)
            },
            city,
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