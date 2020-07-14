import BaseUser from "../../../services/user";
import userService from "../../../services/user/user.service";
import userPermissionService from "../../../services/userPermission/userPermission.service";
import permissionService from "../../../services/permission/permission.service";

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
        prefix,
    } = _data || {};
    return {
          basic_info: {
            id:user_id,
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
        };
    };

  getPermissions = async () => {
      const {getCategory} = this;
      try {
          const permissionsData = await userPermissionService.getPermissionsByData({category: getCategory()});
          let permission_ids = [];
          let permissionData = [];

          for(const userPermission of permissionsData) {
            const {permission_id} = userPermission || {};
            permission_ids.push(permission_id);
          }

          const permissions = await permissionService.getPermissionsById(permission_ids);

          for(const permission of permissions) {
            const {type} = permission || {};
            permissionData.push(type);
          }

          console.log("permissionsData  ------------> ", permissionData, getCategory());

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
