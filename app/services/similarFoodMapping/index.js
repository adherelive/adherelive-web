export default class Severity {
  constructor(data) {
    this._data = data;
  }

  getId = () => {
    return this._data.id;
  };

  getRelatedToId = () => {
    return this._data.related_to_id;
  };

  getSecondaryId() {
    return this._data.secondary_id;
  }
}
