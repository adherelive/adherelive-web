export default class Portion {
  constructor(data) {
    this._data = data;
  }
  
  getId = () => {
    return this._data.id;
  };
  
  getName = () => {
    return this._data.name;
  };
}
