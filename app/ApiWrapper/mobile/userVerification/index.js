import BaseUserVerification from "../../../services/userVerifications";
import userVerifcationService from "../../../services/userVerifications/userVerifications.services";

class UserVerificationWrapper extends BaseUserVerification {
  constructor(data) {
    super(data);
  }
  
  getBasicInfo = () => {
    const {_data} = this;
    const {id, user_id, request_id, status, type} = _data || {};
    
    return {
      basic_info: {
        id,
        user_id,
        request_id,
        status,
        type,
      },
    };
  };
}

export default async (data = null, id = null) => {
  if (data) {
    return new UserVerificationWrapper(data);
  }
  const userVerification = await userVerifcationService.getRequestByData({
    id,
  });
  return new UserVerificationWrapper(userVerification);
};
