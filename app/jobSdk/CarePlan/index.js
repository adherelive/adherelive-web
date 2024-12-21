export default class CarePlanJob {
  constructor(data) {
    this._data = data;
  }

  getCarePlanData = () => {
    return this._data;
  };
}
