export default class Subscriptions {
    constructor(data) {
        this._data = data;
    }

    getId = () => {
        return this._data.id;
    };

    getSubscriberType = () => {
        return this._data.subscriber_type;
    };

    getSubscriberId = () => {
        return this._data.subscriber_id;
    };
}
