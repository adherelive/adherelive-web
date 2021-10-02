export default class VitalTemplates {
    constructor(data) {
        this._data = data;
    }

    getVitalTemplateId = () => {
        return this._data.get("id");
    };

    getName = () => {
        return this._data.get("name");
    };

    getUnit = () => {
        return this._data.get("unit");
    };

    getTemplate = () => {
        const {template = []} = this._data.get("details");
        console.log("1289313123 details --> ", template);
        return template;
    };
}
