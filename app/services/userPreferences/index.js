export default class UserPreference {
    constructor(data) {
        this._data = data;
    }

    getUserPreferenceId = () => {
        return this._data.get("id");
    };

    getUserId = () => this._data.get("user_id");

    getAllDetails = () => {
        return this._data.get("details");
    };

    getChartDetails = () => {
      const details =  this._data.get("details");
      const {charts} = details || {};
      return charts;
    };

    allowEmail = () => {
        const details =  this._data.get("details");
      const {emailNotification} = details || {};
      return emailNotification;
    };

    allowSms = () => {
        const details =  this._data.get("details");
        const {smsNotification} = details || {};
        return smsNotification;
    };
}