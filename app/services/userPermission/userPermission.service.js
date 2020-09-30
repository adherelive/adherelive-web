import database from "../../../libs/mysql";

const {user_category_permissions: UserCategoryPermissions} = database.models;

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