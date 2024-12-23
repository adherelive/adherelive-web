export default class Patient {
  constructor(data) {
    this._data = data;
  }

  getUserId = () => {
    return this._data.get("user_id");
  };

  getPatientId = () => {
    if (!this._data.get("id")) {
      throw new Error(
        `Patient object is null or does not have a get method: this._data.get("id")`
      );
    }
    return this._data.get("id");
  };

  getDetails = () => {
    return this._data.get("details");
  };

  getName = () => {
    return this._data.get("first_name");
  };

  getFullName = () => {
    return this._data.get("full_name");
  };

  getPaymentsTermsAccepted = () => this._data.payment_terms_accepted;
}
