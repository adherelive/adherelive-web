import BaseScheduleEvent from "../../../services/scheduleEvents";

import ScheduleEventService from "../../../services/scheduleEvents/scheduleEvent.service";

import AppointmentWrapper from "../../web/appointments";
import {EVENT_TYPE} from "../../../../constant";

import Log from "../../../../libs/log";

const Logger = new Log("WEB > API WRAPPER > SCHEDULE_EVENTS");


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
          end_time,
          updated_at
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
          updated_at
      };
    };

    getReferenceInfo = async () => {
        const {getAllInfo, getScheduleEventId, getEventId, getEventType} = this;

        let eventTypeData = {};

        switch (getEventType()) {
            case EVENT_TYPE.APPOINTMENT:
                const appointment = await AppointmentWrapper(null, getEventId());
                const {appointments} = await appointment.getAllInfo();
                eventTypeData = {appointments};
            default:
                break;
        }

        return {
            schedule_events: {
                [getScheduleEventId()]: getAllInfo(),
            },
            ...eventTypeData,
        }

    };
}

export default async (data = null, id = null) => {
    if(data) {
        return new ScheduleEventWrapper(data);
    }
    const scheduleEventService = new ScheduleEventService();
    const scheduleEvent = await scheduleEventService.getEventByData({id});
    return new ScheduleEventWrapper(scheduleEvent);
};