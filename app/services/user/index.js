import userService from "./user.service";

export default class User {
    constructor(userId, data) {
        this._data = data;
        this._userId = userId;
    }

    getExistingData() {
        return this._data.get();
    }

    getUserId() {
        return this._userId;
    }

    getUser = async () => {
        const user = await userService.getUser(this._userId);
        return user.get();
    };
}