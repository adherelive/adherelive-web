import BasePatient from "../../../services/patients";
import patientService from "../../../services/patients/patients.service";


class PatientWrapper extends BasePatient {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
        const { _data } = this;
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
            details,
            dob,
            uid
        } = _data || {};
        return {
            basic_info: {
                id,
                user_id,
                gender,
                age,
                first_name,
                middle_name,
                last_name,
                address,
                uid
            },
            activated_on,
            details,
            dob,
        };
    };
}

export default async (data = null, id = null) => {
    if (data) {
        return new PatientWrapper(data);
    }
    const patient = await patientService.getPatientById({ id });
    return new PatientWrapper(patient);
}