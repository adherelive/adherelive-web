export default class DietJob {
  constructor(data) {
    this._data = data;
  }

  getDietData = () => {
    return this._data;
  };
}
