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

    getCreatorRoleId = () => { return this._data.creator_role_id };

  getCreatorType = () => {
    return this._data.creator_type;
  };

    getForUserRoleId = () => { return this._data.for_user_role_id };

  getForUserType = () => this._data.for_user_type;

  getAmount = () => {
    return parseInt(this._data.amount);
  };
}
