export default class Provider {
    constructor(data) {
        this._data = data;
    }

    getProviderId = () => {
        return this._data.get("id");
    }
}