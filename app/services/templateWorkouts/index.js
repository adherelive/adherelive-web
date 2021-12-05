export default class TemplateWorkout {
  constructor(data) {
    this._data = data;
  }
  
  getId = () => this._data.id;
  
  getDetails = () => this._data.details || {};
}
