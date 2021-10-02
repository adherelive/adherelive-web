export default class Doctor {
    constructor(data) {
        this._data = data;
    }

    getUserId = () => {
        return this._data.get("user_id");
    };

    getFullName = () => this._data.get("full_name");

    getDoctorId = () => {
        return this._data.get("id");
    }

    getName = () => {
        return this._data.get("first_name");
    };

    getRazorpayAccountId = () => {
        return this._data.get("razorpay_account_id");
    };

    getUserData = () => this._data.get("user") || {};
}
