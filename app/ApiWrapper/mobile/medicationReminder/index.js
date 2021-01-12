import BaseMedicationReminder from "../../../services/medicationReminder";

import mReminderService from "../../../services/medicationReminder/mReminder.service";
import carePlanMedicationService from "../../../services/carePlanMedication/carePlanMedication.service";
import eventService from "../../../services/scheduleEvents/scheduleEvent.service";
import moment from "moment";
import {EVENT_STATUS, EVENT_TYPE} from "../../../../constant";
import EventWrapper from "../../common/scheduleEvents";

class MobileMReminderWrapper extends BaseMedicationReminder {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data } = this;
    const {
      id,
      participant_id,
      organizer_type,
      organizer_id,
      description,
      start_date,
      end_date,
      details,
      rr_rule = "",
    } = _data || {};
    return {
      basic_info: {
        id,
        description,
        start_date,
        end_date,
      },
      organizer: {
        id: organizer_id,
        category: organizer_type,
      },
      details,
      participant_id,
      rr_rule,
    };
  };

  getAllInfo = async () => {
    const {getBasicInfo, getMReminderId} = this;
    const EventService = new eventService();

    const currentDate = moment().endOf("day").utc().toDate();

    // get careplan attached to medication
    const medicationCareplan = await carePlanMedicationService.getCareplanByMedication({medication_id: getMReminderId()}) || null;
    const {care_plan_id = null} = medicationCareplan || {};

    const scheduleEvents = await EventService.getAllPreviousByData({
      event_id: getMReminderId(),
      date: currentDate,
      event_type: EVENT_TYPE.MEDICATION_REMINDER
    });

    let medicationEvents = {};
    let remaining = 0;
    let latestPendingEventId;

    const scheduleEventIds = [];
    for(const events of scheduleEvents) {
      const scheduleEvent = await EventWrapper(events);
        scheduleEventIds.push(scheduleEvent.getScheduleEventId());

        if(scheduleEvent.getStatus() === EVENT_STATUS.PENDING || scheduleEvent.getStatus() === EVENT_STATUS.SCHEDULED) {
          if(!latestPendingEventId) {
            latestPendingEventId = scheduleEvent.getScheduleEventId();
          }
          remaining++;
        }
    }

    return {
      medications: {
        [getMReminderId()]: {
          ...getBasicInfo(),
          remaining,
          total: scheduleEvents.length,
          upcoming_event_id: latestPendingEventId,
          care_plan_id
        },
      },
    };
  };

  getReferenceInfo = async () => {
    const {getAllInfo, getMReminderId} = this;
    const EventService = new eventService();

    const scheduleEvents = await EventService.getAllPreviousByData({
      event_id: getMReminderId(),
      date: moment().utc().toDate(),
      event_type: EVENT_TYPE.MEDICATION_REMINDER
    });

    const scheduleEventIds = [];
    let scheduleEventData = {};
    for(const events of scheduleEvents) {
      const scheduleEvent = await EventWrapper(events);
      scheduleEventIds.push(scheduleEvent.getScheduleEventId());

      scheduleEventData[scheduleEvent.getScheduleEventId()] = scheduleEvent.getAllInfo();
    }

    const {medications} = await getAllInfo();
    const medicationData = medications[getMReminderId()] || {};

    return {
      medications: {
        ...medicationData,
        event_ids: scheduleEventIds
      },
      schedule_events: {
        ...scheduleEventData
      }
    }
  };
}

export default async (data = null, id = null) => {
  if (data) {
    return new MobileMReminderWrapper(data);
  }
  const medicationReminder = await mReminderService.getMedication({ id });
  return new MobileMReminderWrapper(medicationReminder);
};
