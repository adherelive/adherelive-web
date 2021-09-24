export default class ProviderTermsMapping {
  constructor(data) {
    this._data = data;
  }

  getId = () => {
    return this._data.id;
  };
}
