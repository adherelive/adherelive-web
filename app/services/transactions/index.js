export default class Transaction {
    constructor(data) {
        this._data = data;
    }

    getId = () => {
        return this._data.id;
    };

    getTransactionResponse = () => {
        return this._data.transaction_response;
    };

    getRequestorType = () => {
        return this._data.requestor_type;
    };

    getRequestorId = () => {
        return this._data.requestor_id;
    };

    getPayeeId = () => this._data.payee_id;

    getPayeeType = () => this._data.payee_type;

    getPaymentProduct = () => {
      return this._data.payment_products;
    };

    getMode = () => {
        return this._data.mode;
    };
}