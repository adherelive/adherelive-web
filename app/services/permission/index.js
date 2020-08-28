export default class Permission {
    constructor(data) {
        this._data = data;
    }

    getPermissionType = () => {
        return this._data.get("type");
    };
}