import BaseUser from "../../../services/user";
import userService from "../../../services/user/user.service";
import userPermissionService from "../../../services/userPermission/userPermission.service";
import permissionService from "../../../services/permission/permission.service";
import DoctorWrapper from "../../mobile/doctor";
import PatientWrapper from "../../mobile/patient";

class MUserWrapper extends BaseUser {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data } = this;
    const {
      id,
      user_name,
      email,
      mobile_number,
      prefix,
      sign_in_type,
      category,
      activated_on,
      verified,
      onboarded,
      onboarding_status
    } = _data || {};
    return {
      basic_info: {
        id,
        user_name,
        email,
        mobile_number,
        prefix
      },
      verified,
      onboarded,
      onboarding_status,
      sign_in_type,
      category,
      activated_on
    };
  };

  getPermissions = async () => {
    const { getCategory } = this;
    try {
      const permissionsData = await userPermissionService.getPermissionsByData({
        category: getCategory()
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

      console.log(
        "permissionsData  ------------> ",
        permissionsData,
        permission_ids
      );

      return {
        permissions: permissionData
      };
    } catch (error) {
      throw error;
    }
  };

  getCategoryInfo = async () => {
    const { _data } = this;
    const { doctor = null, patient = null } = _data || {};

    if (doctor) {
      const doctorData = await DoctorWrapper(doctor);
      return {
        userCategoryData: doctorData.getBasicInfo(),
        userCategoryId: doctorData.getDoctorId()
      };
    } else if (patient) {
      const patientData = await PatientWrapper(patient);
      return {
        userCategoryData: patientData.getBasicInfo(),
        userCategoryId: patientData.getPatientId()
      };
    }
  };
}

export default async (data = null, userId = null) => {
  if (data) {
    return new MUserWrapper(data);
  }
  const user = await userService.getUserById(userId);
  return new MUserWrapper(user.get());
};
