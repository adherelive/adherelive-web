export default class TermsAndConditions {
  constructor(data) {
    this._data = data;
  }

  getId = () => {
    return this._data.id;
  };

  getTermsType = () => {
    return this._data.terms_type;
  };

  getDetails = () => {
    return this._data.details;
  };
}
