export default class UserDevice {
    constructor(data) {
        this._data = data;
    }

    getOneSignalDeviceId = () => {
        return this._data.get("one_signal_user_id");
    };
}
