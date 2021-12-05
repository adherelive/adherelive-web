export default class Course {
  constructor(data) {
    this._data = data;
  }
  
  getCourseId() {
    return this._data.get("id");
  }
}