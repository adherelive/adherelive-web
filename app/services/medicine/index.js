import medicineService from "./medicine.service";

export default class Medicine {
    constructor(data) {
        // this._arrData = arrData.length > 0 ? arrData : [];
        this._data = data;
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
        // console.log("this._data --> ", this._data);
        return this._data.get("id");
    }
}