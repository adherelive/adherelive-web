import BaseMedicationReminder from "../../../services/medicationReminder";
import mReminderService from "../../../services/medicationReminder/mReminder.service";

// API WRAPPERS
import MedicineWrapper from "../medicine";
import EventService from "../../../services/scheduleEvents/scheduleEvent.service";
import moment from "moment";
import { EVENT_STATUS, EVENT_TYPE } from "../../../../constant";
import EventWrapper from "../../common/scheduleEvents";

class MReminderWrapper extends BaseMedicationReminder {
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
        details,
        start_date,
        end_date,
      },
      organizer: {
        id: organizer_id,
        category: organizer_type,
      },
      participant_id,
      rr_rule,
    };
  };

  getAllInfo = async () => {
    const { getBasicInfo, getMReminderId } = this;
    const eventService = new EventService();

    const currentDate = moment().endOf("day").utc().toDate();

    const scheduleEvents = await eventService.getAllPreviousByData({
      event_id: getMReminderId(),
      date: currentDate,
      event_type: EVENT_TYPE.MEDICATION_REMINDER,
    });

    let medicationEvents = {};
    let remaining = 0;
    let latestPendingEventId;

    const scheduleEventIds = [];
    for (const events of scheduleEvents) {
      const scheduleEvent = await EventWrapper(events);
      scheduleEventIds.push(scheduleEvent.getScheduleEventId());

      if (scheduleEvent.getStatus() !== EVENT_STATUS.COMPLETED) {
        if (!latestPendingEventId) {
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
        },
      },
    };
  };
  getReferenceInfo = async () => {
    const { getAllInfo, getMedicineId, _data } = this;
    const { medicine } = _data || {};
    let medicineData = null;

    if (medicine) {
      medicineData = await MedicineWrapper(medicine);
    } else {
      medicineData = await MedicineWrapper(null, getMedicineId());
    }

    return {
      ...(await getAllInfo()),
      medicines: {
        [medicineData.getMedicineId()]: medicineData.getBasicInfo(),
      },
    };
  };
}

export default async (data = null, id = null) => {
  if (data) {
    return new MReminderWrapper(data);
  }
  const medicationReminder = await mReminderService.getMedication({ id });
  return new MReminderWrapper(medicationReminder);
};
