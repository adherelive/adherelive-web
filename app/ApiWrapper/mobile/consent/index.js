import BaseConsent from "../../../services/consents";
import ConsentService from "../../../services/consents/consent.service";

class ConsentWrapper extends BaseConsent {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
      const {_data} = this;
      const {
          id,
          type,
          doctor_id,
          patient_id,
          user_role_id,
          activated_on,
          expire_on
      } = _data || {};

      return {
          basic_info: {
              id,
              type,
              doctor_id,
              patient_id,
              user_role_id,
          },
          activated_on,
          expire_on
      }
    };
}

export default async ({data = null, id = null}) => {
  if(data) {
      return new ConsentWrapper(data);
  }
  const consentService = new ConsentService();
  const consent = await consentService.getByData({id});
  return new ConsentWrapper(consent);
};