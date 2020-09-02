export default class VitalTemplates {
    constructor(data) {
        this._data = data;
    }

    getVitalTemplateId = () => {
        return this._data.get("id");
    };
}