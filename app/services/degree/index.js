export default class Degree {
  constructor(data) {
    this._data = data;
  }

  getDegreeId() {
    return this._data.get("id");
  }
}
