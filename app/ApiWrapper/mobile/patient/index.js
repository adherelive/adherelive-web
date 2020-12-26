import BasePatient from "../../../services/patients";
import patientService from "../../../services/patients/patients.service";
import {completePath} from "../../../helper/filePath";

import UserWrapper from "../user";

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
            height,
            weight,
            first_name,
            middle_name,
            last_name,
            full_name,
            age,
            dob,
            address,
            activated_on,
            details,
            uid
        } = _data || {};
        const {profile_pic} = details || {};

        const updatedDetails =  {
            ...details,
            profile_pic: profile_pic ? completePath(profile_pic) : null,
        };

        return {
            basic_info: {
                id,
                user_id,
                gender,
                height,
                weight,
                age,
                first_name,
                middle_name,
                last_name,
                full_name,
                address,
                uid
            },
            activated_on,
            dob,
            details: updatedDetails
        };
    };

    getAllInfo = async () => {};

    getReferenceInfo = async () => {
        const {_data, getBasicInfo, getPatientId} = this;
        const {user} = _data || {};

        const users = await UserWrapper(user.get());

        return {
            patients: {
                [getPatientId()]: getBasicInfo()
            },
            users: {
                [users.getId()]: users.getBasicInfo()
            }
        }
    };
}

export default async (data = null, id = null) => {
    if(data) {
        return new MPatientWrapper(data);
    }
    const patient = await patientService.getPatientById({id});
    return new MPatientWrapper(patient);
}