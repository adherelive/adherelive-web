import userService from "./user.service";

export default class User {
    constructor(data) {
        this._data = data;
    }

    getExistingData() {
        return this._data;
    }

    getUserId() {
        return this._data.user_id;
    }
}