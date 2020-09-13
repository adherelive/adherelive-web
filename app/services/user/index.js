import userService from "./user.service";

export default class User {
    constructor(data) {
        this._data = data;
    }

    getExistingData() {
        return this._data;
    }

    getId = () => {
        return this._data.id;
    }

    getUserId() {
        return this._data.user_id;
    }

    getCategory = () => {
        return this._data.category;
    }

    getPassword = () => {
        return this._data.password;
    }

    getEmail = () => {
        return this._data.email;
    };

    isActivated = () => {
        const {verified, activated_on} = this._data || {};
        return verified && activated_on !== null;
    };

    getPermissionData = () => {
        return this._data.permissions;
    }

    getPrefix = () => {
        return this._data.prefix;
    };
}