export default class College {
  constructor(data) {
    this._data = data;
  }
  
  getCollegeId() {
    return this._data.get("id");
  }
}

