
export default class UploadDocument {
    constructor(data) {
        this._data = data;
    }

    getUploadDocumentId = () => {
        return this._data.get("id");
    }
}