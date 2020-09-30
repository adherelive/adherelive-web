import database from "../../../libs/mysql";

const {permissions: Permissions} = database.models;

class PermissionService {
    constructor() {
    }

    getPermissionsById = async data => {
      try {
          const permissions = Permissions.findAll({
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