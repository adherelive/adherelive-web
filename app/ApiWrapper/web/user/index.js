import BaseUser from "../../../services/user";
import userService from "../../../services/user/user.service";

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
}

export default async (data = null, userId = null) => {
  if (data) {
    return new UserWrapper(data);
  }
  const user = await userService.getUserById(userId);
  return new UserWrapper(user.get());
};
