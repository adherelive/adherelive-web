export default class Condition {
    constructor(data) {
        this._data = data;
    }

    getConditionId() {
        return this._data.get("id");
    }
}