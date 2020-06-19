import BaseUser from "../../../services/user";

import userService from "../../../services/user/user.service";
import { OBJECT_NAME } from "../../../../constant";

class MUserWrapper extends BaseUser {
  constructor(data) {
    super(data);
    this.objectName = OBJECT_NAME.USER;
  }

  getBasicInfo = () => {
    const { _data } = this;
    const {
      id,
      user_name,
      email,
      mobile_number,
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
        mobile_number
      },
      sign_in_type,
      category,
      activated_on,
      verified,
      onboarded,
      onboarding_status
    };
  };
}

export default async (data = null, userId = null) => {
  if (data) {
    return new MUserWrapper(data);
  }
  const user = await userService.getUserByData({ id: userId });
  return new MUserWrapper(user);
};
