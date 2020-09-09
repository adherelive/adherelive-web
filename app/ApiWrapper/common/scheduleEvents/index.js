import BaseScheduleEvent from "../../../services/scheduleEvents";

import ScheduleEventService from "../../../services/scheduleEvents/scheduleEvent.service";

class ScheduleEventWrapper extends BaseScheduleEvent {
    constructor(data) {
        super(data);
    }

    getAllInfo = () => {
      const {_data} = this;
      const {} = _data || {};
    };
}

export default async (data = null, id = null) => {
    if(data) {
        return new ScheduleEventWrapper(data);
    }
    const scheduleEvent = await ScheduleEventService.getEventByData({id});
    return new ScheduleEventWrapper(scheduleEvent);
};