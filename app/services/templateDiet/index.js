export default class TemplateDiet {
  constructor(data) {
    this._data = data;
  }

  getId = () => this._data.id;

  getName = () => this._data.name;

  getDetails = () => this._data.details;
}
