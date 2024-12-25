import BasePatient from "../../../services/patients";
import patientService from "../../../services/patients/patients.service";
import carePlanService from "../../../services/carePlan/carePlan.service";
import symptomService from "../../../services/symptom/symptom.service";
import userRolesService from "../../../services/userRoles/userRoles.service";

import UserWrapper from "../../web/user";
import userRoleWrapper from "../../web/userRoles";

import { completePath } from "../../../helper/filePath";

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
      payment_terms_accepted,
      createdAt: created_at,
    } = _data || {};

    const { profile_pic = "" } = details || {};

    const updatedDetails = {
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
      payment_terms_accepted,
      activated_on,
      details: updatedDetails,
      dob,
      created_at,
    };
  };

  getAllInfo = async () => {
    const { _data, getBasicInfo, getPatientId } = this;

    // const carePlans = await carePlanService.getMultipleCarePlanByData({patient_id: getPatientId()});
    const order = [["created_at", "DESC"]];
    const data = { patient_id: getPatientId() };
    let carePlan = await carePlanService.getSingleCarePlanByData(data, order);

    let carePlanId = "";
    let response = {};
    if (carePlan) {
      carePlanId = carePlan.get("id") || null;
    }

    const { user_id = null } = _data || {};
    let user_role_id = null;
    const userRole = await userRolesService.getFirstUserRole(user_id);
    if (userRole) {
      const userRoleData = await userRoleWrapper(userRole);
      user_role_id = userRoleData.getId();
    }

    if (carePlanId) {
      response = { ...getBasicInfo(), care_plan_id: carePlanId, user_role_id };
    } else {
      response = {
        ...getBasicInfo(),

        user_role_id,
      };
    }
    return response;
  };

  getReferenceInfo = async () => {
    const { _data, getAllInfo, getPatientId } = this;
    const { user } = _data || {};
    const users = await UserWrapper(user.get());
    console.log(
      "getReferenceInfo in PatientWrapper has PatientID/User as: ",
      users
    );

    return {
      patients: {
        [getPatientId()]: await getAllInfo(),
      },
      users: {
        [users.getId()]: users.getBasicInfo(),
      },
    };
  };
}

export default async (data = null, id = null) => {
  if (data) {
    return new PatientWrapper(data);
  }
  const patient = await patientService.getPatientById({ id });
  return new PatientWrapper(patient);
};
