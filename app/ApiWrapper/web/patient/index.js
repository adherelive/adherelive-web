import BasePatient from "../../../services/patients";
import patientService from "../../../services/patients/patients.service";
import carePlanService from "../../../services/carePlan/carePlan.service";
import {completePath} from "../../../helper/filePath";
import UserWrapper from "../../web/user";


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
            height,
            weight,
            first_name,
            middle_name,
            last_name,
            full_name,
            age,
            address,
            activated_on,
            details,
            dob,
            uid,
        } = _data || {};
        const {profile_pic = ""} = details || {};

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
                uid,
                
            },
            activated_on,
            details: updatedDetails,
            dob,
        };
    };

    getAllInfo = async () => {
        const {_data, getBasicInfo, getPatientId} = this;

        const carePlans = await carePlanService.getMultipleCarePlanByData({patient_id: getPatientId()});

        let carePlanId = null;

        for(const carePlan of carePlans) {
            carePlanId = carePlan.get("id");
        }
        return {
            ...getBasicInfo(),
            care_plan_id: carePlanId
        }
    };

    getReferenceInfo = async () => {
        const {_data, getAllInfo, getPatientId} = this;
        const {user} = _data || {};
        const users = await UserWrapper(user.get());

        return {
            patients: {
                [getPatientId()]: await getAllInfo()
            },
            users: {
                [users.getId()]: users.getBasicInfo()
            }
        }
    };
}

export default async (data = null, id = null) => {
    if (data) {
        return new PatientWrapper(data);
    }
    const patient = await patientService.getPatientById({ id });
    return new PatientWrapper(patient);
}