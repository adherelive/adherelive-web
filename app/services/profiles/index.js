export default class Profiles {
    constructor(data) {
        this._data = data;
    }

    getId = () => {
        return this._data.id;
    };

    getUserId = () => {
        return this._data.user_id;
    }

    getCategoryId = () => {
        return this._data.category_id
    }

    getCategoryType = () => {
        return this._data.category_type
    }
}