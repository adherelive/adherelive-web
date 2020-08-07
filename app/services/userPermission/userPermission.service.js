import UserCategoryPermissions from "../../models/userCategoryPermissions";


class UserPermissionService {
    constructor() {
    }

    getPermissionsByData = async data => {
      try {
          const userPermission = UserCategoryPermissions.findAll({
              where: data
          });
          return userPermission;
      } catch(error) {
        throw error;
      }
    };
}

export default new UserPermissionService();