export default class Reports {
    constructor(data) {
        this._data = data;
    }

    getId = () => this._data.id;

    getName = () => this._data.name;

    getTestDate = () => this._data.test_date;

    getPatientId = () => this._data.patient_id;

    getUploaderId = () => this._data.uploader_id;

    getUploaderType = () => this._data.uploader_type;

    getCreatedAt = () => this._data.created_at;

    getUpdatedAt = () => this._data.updated_at;
}