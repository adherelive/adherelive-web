export default class FeatureDetails {
  constructor(data) {
    this._data = data;
  }
  
  getFeatureType = () => {
    return this._data.get("feature_type");
  };
  
  getFeatureDetails = () => {
    return this._data.get("details");
  };
}
