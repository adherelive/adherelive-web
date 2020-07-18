export default class UserPreference {
    constructor(data) {
        this._data = data;
    }

    getUserPreferenceId = () => {
        return this._data.get("id");
    };

    getAllDetails = () => {
        return this._data.get("details");
    };

    getChartDetails = () => {
      const details =  this._data.get("details");
      const {charts} = details || {};
      return charts;
    };
}