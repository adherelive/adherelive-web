export default class UserRoles {
    constructor(data) {
        this._data = data;
    }

    getId = () => {
        return this._data.id;
    };

    getUserId = () => {
        return this._data.user_identity;
    }

    getCategoryId = () => {
        return this._data.category_id
    }

    getCategoryType = () => {
        return this._data.category_type
    }
}