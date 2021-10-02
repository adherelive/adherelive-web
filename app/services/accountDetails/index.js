export default class AccountDetails {
    constructor(data) {
        this._data = data;
    }

    getId = () => {
        const {id = null} = this._data;
        return id;
    };

    getRazorpayAccountId = () => {
        return this._data.get("razorpay_account_id");
    };

    getUpi = () => {
        return this._data.get("upi_id");
    };
}
