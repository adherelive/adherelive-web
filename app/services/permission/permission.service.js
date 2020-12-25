import Database from "../../../libs/mysql";
import {TABLE_NAME} from "../../models/permissions";

class PermissionService {
    constructor() {
    }

    getPermissionsById = async data => {
      try {
          const permissions = Database.getModel(TABLE_NAME).findAll({
              where: {
                  id: data
              }
          });
          return permissions;
      } catch(error) {
        throw error;
      }
    };
}

export default new PermissionService();