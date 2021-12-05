export default class UserVerification {
  constructor(data) {
    this._data = data;
  }
  
  getUserVerificationId = () => {
    return this._data.get("id");
  };
  
  getUserId() {
    return this._data.get("user_id");
  }
}
