import BaseTermsandConditions from "../../../services/termsAndConditions";
import termsAndConditionsService from "../../../services/termsAndConditions/termsAndConditions.service";

class TACWrapper extends BaseTermsandConditions {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data } = this;
    const { id, terms_type, details } = _data || {};
    return {
      basic_info: {
        id,
        terms_type,
        details
      }
    };
  };
}

export default async ({ data = null, id = null }) => {
  if (data !== null) {
    return new TACWrapper(data);
  }
  const tacRecord = await termsAndConditionsService.getByData({ id });
  return new TACWrapper(tacRecord);
};
