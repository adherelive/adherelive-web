import BaseProvider from "../../../services/provider";
import providerService from "../../../services/provider/provider.service";

class ProviderWrapper extends BaseProvider {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data } = this;
    const { id, name, address, city, state, user_id, activated_on } =
      _data || {};

    return {
      basic_info: {
        id,
        user_id,
        name,
        address,
        city,
        state
      },
      activated_on
    };
  };
}

export default async (data = null, id = null) => {
  if (data) {
    return new ProviderWrapper(data);
  }

  const provider = await providerService.getProviderByData({ id });
  return new ProviderWrapper(provider);
};
