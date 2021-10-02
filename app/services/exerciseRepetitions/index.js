export default class Repetition {
    constructor(data) {
        this._data = data;
    }

    getId = () => {
        return this._data.id;
    };

    getType = () => {
        return this._data.type;
    };
}
