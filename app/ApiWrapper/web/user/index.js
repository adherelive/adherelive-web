import isEmpty from "lodash/isEmpty";

import BaseUser from "../../../services/user";

// SERVICES
import userService from "../../../services/user/user.service";
import userPermissionService from "../../../services/userPermission/userPermission.service";
import permissionService from "../../../services/permission/permission.service";

// WRAPPER
import DoctorWrapper from "../doctor";
import PatientWrapper from "../patient";
import ProviderWrapper from "../provider";
import PermissionWrapper from "../permission";
import { getTime } from "../../../helper/timer";

import * as PermissionHelper from "../../../helper/userCategoryPermisssions";

class UserWrapper extends BaseUser {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data } = this;
    const {
      user_id,
      user_name,
      email,
      mobile_number,
      sign_in_type,
      onboarded,
      onboarding_status,
      category,
      activated_on,
      // system_generated_password,
      prefix,
      deleted_at,
      has_consent,
    } = _data || {};
    return {
      basic_info: {
        id: user_id,
        user_name,
        email,
        mobile_number,
        prefix,
      },
      sign_in_type,
      onboarded,
      onboarding_status,
      category,
      activated_on,
      deleted_at,
      has_consent,
      // system_generated_password
    };
  };

  getCategoryInfo = async () => {
    const { _data } = this;
    console.log("get category info - 1 ", getTime());
    const { doctor = null, patient = null, provider = null } = _data || {};
    console.log("get category info - 2 ", getTime());
    if (doctor) {
      console.log("get category info - 3 ", getTime());
      const doctorData = await DoctorWrapper(doctor);
      console.log("get category info - 4 ", getTime());
      console.log("get category info - 5 ", getTime());
      return {
        userCategoryData: await doctorData.getAllInfoNew(),
        userCategoryId: doctorData.getDoctorId(),
      };
    } else if (patient) {
      console.log("get category info - 6 ", getTime());
      const patientData = await PatientWrapper(patient);
      console.log("get category info - 7 ", getTime());
      return {
        userCategoryData: patientData.getBasicInfo(),
        userCategoryId: patientData.getPatientId(),
      };
    } else if (provider) {
      console.log("get category info - 8 ", getTime());
      const providerData = await ProviderWrapper(provider);
      console.log("get category info - 9 ", getTime());
      return {
        userCategoryData: providerData.getBasicInfo(),
        userCategoryId: providerData.getProviderId(),
      };
    }
  };

  getPermissions = async () => {
    const { getCategory } = this;
    try {
      const permissionsData = await userPermissionService.getPermissionsByData({
        category: getCategory(),
      });
      let permission_ids = [];
      let permissionData = [];

      for (const userPermission of permissionsData) {
        const { permission_id } = userPermission || {};
        permission_ids.push(permission_id);
      }

      const permissions = await permissionService.getPermissionsById(
        permission_ids
      );

      for (const permission of permissions) {
        const { type } = permission || {};
        permissionData.push(type);
      }

      return permissionData;
    } catch (error) {
      throw error;
    }
  };

  getReferenceData = async () => {
    const { getPermissions, getBasicInfo, getId, isActivated } = this;

    let permissions = [];

    if (isActivated()) {
      permissions = await getPermissions();
    }

    return {
      users: {
        [getId()]: getBasicInfo(),
      },
      permissions,
    };
  };

  getReferenceInfo = async () => {
    const { getId, getBasicInfo, _data } = this;

    const { doctor, patient } = _data;

    const doctors = {};
    const patients = {};

    let doctor_id = null;
    let patient_id = null;

    const patientData = await PatientWrapper(patient);

    if (!isEmpty(doctor)) {
      const doctorData = await DoctorWrapper(doctor);
      doctors[doctorData.getDoctorId()] = await doctorData.getAllInfo();
      doctor_id = doctorData.getDoctorId();
    }

    if (!isEmpty(patient)) {
      const patientData = await PatientWrapper(patient);
      patients[patientData.getPatientId()] = await patientData.getAllInfo();
      patient_id = patientData.getPatientId();
    }

    return {
      users: {
        [getId()]: getBasicInfo(),
      },
      doctors,
      patients,
      patient_id,
      doctor_id,
    };
  };
}

export default async (data = null, userId = null) => {
  if (data) {
    return new UserWrapper(data);
  }
  const user = await userService.getUserById(userId);
  return new UserWrapper(user.get(""));
};
