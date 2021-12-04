export default class Council {
  constructor(data) {
    this._data = data;
  }

  getCouncilId() {
    return this._data.get("id");
  }
}
