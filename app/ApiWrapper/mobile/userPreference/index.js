import BaseUserPreference from "../../../services/userPreferences";
import userPreferenceService from "../../../services/userPreferences/userPreference.service";

class UserPreferenceWrapper extends BaseUserPreference {
  constructor(data) {
    super(data);
  }
  
  getBasicInfo = () => {
    const {_data} = this;
    const {id, user_id, details} = _data || {};
    return {
      basic_info: {
        id,
        user_id,
      },
      details,
    };
  };
  
  getChartInfo = () => {
    const {_data: {details: {charts = []}} = {}} = this;
    
    return {
      charts,
    };
  };
}

export default async (data = null, id = null) => {
  if (data) {
    return new UserPreferenceWrapper(data);
  }
  const userPreference = await userPreferenceService.getPreferenceByData({
    id,
  });
  return new UserPreferenceWrapper(userPreference);
};
