import BasePermission from "../../../services/permission";

class PermissionWrapper extends BasePermission {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
      const {_data} = this;
      const {
          id,
          type
      } = _data || {};

      return {
          basic_info: {
              id,
              type
          }
      };
    };
}

export default (data) => {
    return new PermissionWrapper(data);
}

