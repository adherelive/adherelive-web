export default class FeatureDetails {
    constructor(data) {
        this._data = data;
        console.log("this._data ---> ", this._data);
    }

    getFeatureType = () => {
        return this._data.get("feature_type");
    };

    getFeatureDetails = () => {
        return this._data.get("details");
    };
}