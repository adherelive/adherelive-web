import BasePatient from "../../../services/patients";
import patientService from "../../../services/patients/patients.service";
import {completePath} from "../../../helper/filePath";

class MPatientWrapper extends BasePatient {
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
            age,
            address,
            activated_on,
            details
        } = _data || {};
        const {profile_pic} = details || {};

        const updatedDetails =  {
            ...details,
            profile_pic: completePath(profile_pic)
        };

        return {
            basic_info: {
                id,
                user_id,
                gender,
                age,
                first_name,
                middle_name,
                last_name,
                address
            },
            activated_on,
            details: updatedDetails
        };
    };
}

export default async (data = null, userId = null) => {
    if(data) {
        return new MPatientWrapper(data);
    }
    const patient = await patientService.getPatientByData({user_id: userId});
    return new MPatientWrapper(patient);
}