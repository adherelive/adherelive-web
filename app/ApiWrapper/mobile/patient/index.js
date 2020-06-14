import BasePatient from "../../../services/patients";
import patientService from "../../../services/patients/patients.service";


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
            address,
            activated_on,
            details
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
            activated_on,
            details
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