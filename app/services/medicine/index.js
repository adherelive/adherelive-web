import medicineService from "./medicine.service";

export default class Medicine {
    constructor(arrData) {
        this._arrData = arrData;
        this._data = null;
    }

    setCurrentData = (data) => {
        this._data = data;
    }

    getExistingData = () => {
        return this._data.get();
    }

    getMedicineId = () => {
        return this._data.get("id");
    }
}