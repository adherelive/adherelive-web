import BaseProviderTermsMapping from "../../../services/providerTermsMapping";
import providerTermsMappingsService from "../../../services/providerTermsMapping/providerTermsMappings.service";

class ProviderTermsMappingsWrapper extends BaseProviderTermsMapping {
  constructor(data) {
    super(data);
  }
  
  getBasicInfo = () => {
    const {_data} = this;
    const {id, provider_id, terms_and_conditions_id} = _data || {};
    
    return {
      basic_info: {
        id,
        provider_id,
        terms_and_conditions_id,
      },
    };
  };
}

export default async (data = null, id = null) => {
  if (data) {
    return new ProviderTermsMappingsWrapper(data);
  }
  const response = await providerTermsMappingsService.getSingleEntityByData({
    id,
  });
  return new ProviderTermsMappingsWrapper(response);
};
