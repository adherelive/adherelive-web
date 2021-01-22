export default class PaymentProduct {
    constructor(data) {
        this._data = data;
    }

    getId = () => {
        return this._data.id;
    };

    getType = () => {
        return this._data.type;
    };

    getCreatorId = () => {
        return this._data.creator_id;
    };

    getCreatorType = () => {
        return this._data.creator_type;
    };

    getForUserId = () => this._data.for_user_id;

    getForUserType = () => this._data.for_user_type;

    getAmount = () => {
        return parseInt(this._data.amount);
    };
}