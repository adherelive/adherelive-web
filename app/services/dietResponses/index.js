export default class DietResponses {

    constructor(data){
        this._data=data;
    }

    getId = () => {
        return this._data.id;
    }

    getDietId = () => {
        return this._data.diet_id;
    }

    getScheduleEventId = () => {
        return this._data.schedule_event_id;
    }

    getStatus = () => {
        return this._data.status;
    }

    isDocumentUploaded = () => {
        return this._data.document_uploaded;
    };

}