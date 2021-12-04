export default class AuthJob {
  constructor(data) {
    this._data = data;
  }
  
  getData = () => {
    return this._data;
  };
}
