import medicineService from "./medicine.service";

export default class Medicine {
  constructor(data) {
    // this._arrData = arrData.length > 0 ? arrData : [];
    this._data = data;
  }

  setCurrentData = data => {
    this._data = data;
  };

  getMedicineName = () => {
    return this._data.get("name");
  };

  getExistingData = () => {
    return this._data.get();
  };

  getMedicineId = () => {
    return this._data.get("id");
  };

  getStartDate = () => {
    return this._data.get("start_date");
  };

  getDetails = () => {
    return this._data.get("details");
  };

  getCreatorId = () => {
    return this._data.get("creator_id");
  };
}
