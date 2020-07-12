export default class Condition {
    constructor(data) {
        this._data = data;
    }

    getExistingData = () => {
        return this._data;
    }

    getConditionId() {
        return this._data.get("id");
    }
}