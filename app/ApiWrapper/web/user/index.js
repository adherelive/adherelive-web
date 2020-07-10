import BaseUser from "../../../services/user";
import userPermissionService from "../../../services/userPermission/userPermission.service";

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
    } = _data || {};
    return {
          basic_info: {
            id:user_id,
            user_name,
            email,
            mobile_number,
          },
          sign_in_type,
           onboarded,
          onboarding_status,
          category,
          activated_on,
        };
    };

  getPermissions = async () => {
      const {getCategory} = this;
      try {
          const permissionsData = await userPermissionService.getPermissionsByData(getCategory());
          let permissionData = [];
          permissionsData.forEach(permission => {
              const {type} = permission || {};
              permissionsData.push(type);
          });

          return {
              permissions: permissionData
          };
      } catch(error) {
          throw error;
      }
  }
}

export default async (data = null, userId = null) => {
  if (data) {
    return new UserWrapper(data);
  }
  const user = await userService.getUserById(userId);
  return new UserWrapper(user.get());
};
