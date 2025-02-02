import BaseUserPreference from "../../../services/userPreferences";
import userPreferenceService from "../../../services/userPreferences/userPreference.service";

/**
 *
 *
 * @class UserPreferenceWrapper
 */
class UserPreferenceWrapper extends BaseUserPreference {
  constructor(data) {
    super(data);
  }

  /**
   * Get the basic information about the Users who are logged in and can be used to show their summary.
   *
   * @returns {{basic_info: {id: *, user_id: *}, details: *}}
   */
  getBasicInfo = () => {
    const { _data } = this;
    const { id, user_id, details } = _data || {};
    return {
      basic_info: {
        id,
        user_id,
      },
      details,
    };
  };

  /**
   * Get the information about all the charts
   *
   * @returns {{charts: *[]}}
   */
  getChartInfo = () => {
    const { _data: { details: { charts = [] } } = {} } = this;

    return {
      charts,
    };
  };
}

/**
 *
 *
 * @param data
 * @param user_id
 * @returns {Promise<UserPreferenceWrapper>}
 */
export default async (data = null, user_id = null) => {
  if (data) {
    return new UserPreferenceWrapper(data);
  }
  const userPreference = await userPreferenceService.getPreferenceByData({
    user_id,
  });
  return new UserPreferenceWrapper(userPreference);
};
