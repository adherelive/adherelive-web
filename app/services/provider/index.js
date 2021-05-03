export default class Provider {
    constructor(data) {
        this._data = data;
    }

    getProviderId = () => {
        return this._data.get("id");
    }

    getUserId = () => {
        return this._data.get("user_id");
    };

    getDetails = () => this._data.get("details") || {};
}