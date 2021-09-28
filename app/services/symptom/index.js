import moment from "moment";

export default class Symptom {
  constructor(data) {
    this._data = data;
  }

  getPatientId = () => {
    return this._data.get("patient_id");
  };

  getConfig = () => {
    return this._data.get("config");
  };

  getText = () => {
    return this, _data.get("text");
  };

  getSymptomId = () => {
    return this._data.get("id");
  };

  getCreatedDate = () => {
    const createDate = this._data.get("created_at");
    return moment(createDate)
      .utc()
      .format("YYYY-MM-DD");
  };

  getPart = () => {
    const { config: { parts } = {} } = this._data;
    return parts;
  };

  getSide = () => {
    const { config: { side } = {} } = this._data;
    return side;
  };

  getUnformattedCreateDate = () => {
    return this._data.get("created_at");
  };
}
