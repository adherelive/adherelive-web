import BasePatient from "../../../services/patients";
import patientService from "../../../services/patients/patients.service";
import {completePath} from "../../../helper/filePath";

import UserWrapper from "../user";
import userRoleWrapper from "../userRoles";

import carePlanService from "../../../services/carePlan/carePlan.service";
import userRolesService from "../../../services/userRoles/userRoles.service";


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
            uid,
            payment_terms_accepted,
            createdAt:created_at
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
            payment_terms_accepted,
            activated_on,
            dob,
            details: updatedDetails,
            created_at
        };
    };

    getAllInfo = async () => {
        const {_data, getBasicInfo, getPatientId} = this;

        const order = [["created_at","DESC"]];
        const data={patient_id: getPatientId()};
        let carePlan = await carePlanService.getSingleCarePlanByData(data,order);

        const carePlanId = carePlan.get("id") || null;

        const { user_id =null } = _data || {};
        let user_role_id = null ;
        const userRole = await userRolesService.getFirstUserRole(user_id);
        if(userRole){
            const userRoleData = await userRoleWrapper(userRole);
            user_role_id = userRoleData.getId();
        }
        
        return {
            ...getBasicInfo(),
            care_plan_id: carePlanId,
            user_role_id
        }
    };


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