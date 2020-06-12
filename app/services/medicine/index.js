import medicineService from "./medicine.service";

export default class Medicine {
    constructor(arrData) {
        this._arrData = arrData.length > 0 ? arrData : [];
        this._data = arrData.length > 0 ? {} : arrData;
    }

    setCurrentData = (data) => {
        this._data = data;
    }

    getMedicineName = () => {
        return this._data.get("name");
    }

    getExistingData = () => {
        return this._data.get();
    }

    getMedicineId = () => {
        return this._data.get("id");
    }
}