import BaseScheduleEvent from "../../../services/scheduleEvents";

import ScheduleEventService from "../../../services/scheduleEvents/scheduleEvent.service";
import {EVENT_TYPE} from "../../../../constant";

class ScheduleEventWrapper extends BaseScheduleEvent {
    constructor(data) {
        super(data);
    }

    getDateWiseInfo = () => {
        const {_data, getEventType, getScheduleEventId} = this;

        const appointments = [];
        const medications = [];
        const vitals = [];

        switch(getEventType()) {
            case EVENT_TYPE.APPOINTMENT:
                appointments.push(getScheduleEventId());
                break;
            case EVENT_TYPE.MEDICATION_REMINDER:
                medications.push(getScheduleEventId());
                break;
            case EVENT_TYPE.VITALS:
                vitals.push(getScheduleEventId());
                break;
        }
        return {
            all: [getScheduleEventId()],
            appointments,
            medications,
            vitals
        }
    };

    getAllInfo = () => {
      const {_data} = this;
      const {
          id,
          critical,
          event_id,
          event_type,
          details,
          status,
          date,
          start_time,
          end_time
      } = _data || {};

      return {
          id,
          critical,
          event_id,
          event_type,
          details,
          status,
          date,
          start_time,
          end_time,
      };
    };
}

export default async (data = null, id = null) => {
    if(data) {
        return new ScheduleEventWrapper(data);
    }
    const scheduleEvent = await ScheduleEventService.getEventByData({id});
    return new ScheduleEventWrapper(scheduleEvent);
};