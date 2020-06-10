import BaseUser from "../../services/user";

import userService from "../../services/user/user.service";
import { OBJECT_NAME } from "../../../constant";

class UserWrapper extends BaseUser {
  constructor(userId, data) {
    super(userId, data);
    this.objectName = OBJECT_NAME.USER;
  }

  getBasicInfo = async () => {
    const { objectName, _userId, getUser } = this;
    const userDetails = await getUser();
    const {
      id,
      user_name,
      email,
      mobile_number,
      sign_in_type,
      category,
      onboarded,
      activated_on,
    } = userDetails || {};
    return {
      [objectName]: {
        [_userId]: {
          basic_info: {
            id,
            user_name,
            email,
            mobile_number,
          },
          sign_in_type,
          onboarded,
          category,
          activated_on,
        },
      },
    };
  };
}

export default (userId, data = null) => {
  if (data) {
    return new UserWrapper(userId, data);
  }
  return new UserWrapper(userId, null);
};
