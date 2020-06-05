

export default class apiWrapper {
    constructor(data) {
        this._data = data;
    }

    getData() {
        return {...this._data.get()};
    }
}