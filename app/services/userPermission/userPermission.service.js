import Database from "../../../libs/mysql";
import {TABLE_NAME} from "../../models/userCategoryPermissions";

class UserPermissionService {
    constructor() {
    }

    getPermissionsByData = async data => {
      try {
          const userPermission = Database.getModel(TABLE_NAME).findAll({
              where: data
          });
          return userPermission;
      } catch(error) {
        throw error;
      }
    };
}

export default new UserPermissionService();