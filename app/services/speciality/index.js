export default class Speciality {
    constructor(data) {
        this._data = data;
    }

    getSpecialityId = () => {
      return this._data.get("id");
    };
}