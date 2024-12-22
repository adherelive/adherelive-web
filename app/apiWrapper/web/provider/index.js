import BaseProvider from "../../../services/provider";
import providerService from "../../../services/provider/provider.service";
import doctorProviderMappingService from "../../../services/doctorProviderMapping/doctorProviderMapping.service";

import DoctorProviderMappingWrapper from "../../web/doctorProviderMapping";
import UserWrapper from "../../web/user";
import { completePath } from "../../../helper/filePath";

class ProviderWrapper extends BaseProvider {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data } = this;
    const {
      id,
      name,
      address,
      city,
      state,
      user_id,
      activated_on,
      details = {},
    } = _data || {};

    const { icon, banner } = details || {};

    return {
      basic_info: {
        id,
        user_id,
        name,
        address,
        city,
        state,
      },
      details: {
        ...details,
        icon: completePath(icon),
        banner: completePath(banner),
      },
      activated_on,
    };
  };

  getAllInfo = async () => {
    const { _data } = this;
    const {
      id,
      name,
      address,
      city,
      state,
      user_id,
      activated_on,
      details = {},
    } = _data || {};

    const { icon, banner } = details || {};

    const providerDoctors =
      await doctorProviderMappingService.getDoctorProviderMappingByData({
        provider_id: id,
      });

    const doctor_ids = [];
    for (const doctor of providerDoctors) {
      const providerDoctorsWrapper = await DoctorProviderMappingWrapper(doctor);
      doctor_ids.push(providerDoctorsWrapper.getDoctorId());
    }

    return {
      basic_info: {
        id,
        user_id,
        name,
        address,
        city,
        state,
      },
      details: {
        ...details,
        icon: completePath(icon),
        banner: completePath(banner),
      },
      activated_on,
      doctor_ids,
    };
  };

  getReferenceInfo = async () => {
    try {
      const { _data, getBasicInfo, getProviderId } = this;
      //if cooment tha
      // if (!_data) return;
      const { user } = _data;

      const userData = await UserWrapper(user.get());

      return {
        providers: {
          [getProviderId()]: getBasicInfo(),
        },
        users: {
          [userData.getId()]: userData.getBasicInfo(),
        },
        user_id: userData.getId(),
        provider_id: getProviderId(),
      };
    } catch (error) {
      throw error;
    }
  };
}

export default async (data = null, id = null) => {
  if (data) {
    return new ProviderWrapper(data);
  }

  const provider = await providerService.getProviderByData({ id });
  return new ProviderWrapper(provider);
};
