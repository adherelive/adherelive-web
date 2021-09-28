export default class UploadDocument {
  constructor(data) {
    this._data = data;
  }

  getUploadDocumentId = () => {
    return this._data.get("id");
  };

  getParentType = () => {
    return this._data.get("parent_type");
  };

  getDocument = () => this._data.get("document");
}
