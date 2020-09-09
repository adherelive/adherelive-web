
export default class ScheduleEvent {
    constructor(data) {
        this._data = data;
    }

    getEventType = () => {
        return this._data.get("event_type");
    };

    getEventId = () => {
        return this._data.get("event_id");
    };

    getScheduleEventId = () => {
        return this._data.get("id");
    };

    getStatus = () => {
        return this._data.get("status");
    };

    getDetails = () => {
        return this._data.get("details");
    };

    getDate = () => {
      return this._data.get("date");
    };
}