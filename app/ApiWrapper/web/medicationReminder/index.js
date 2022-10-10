import BaseMedicationReminder from "../../../services/medicationReminder";
import mReminderService from "../../../services/medicationReminder/mReminder.service";

// API WRAPPERS
import MedicineWrapper from "../medicine";
import EventService from "../../../services/scheduleEvents/scheduleEvent.service";
import moment from "moment";
import { EVENT_STATUS, EVENT_TYPE } from "../../../../constant";
import EventWrapper from "../../common/scheduleEvents";
import doctorService from "../../../services/doctor/doctor.service";
import { getTime } from "../../../helper/timer";
class MReminderWrapper extends BaseMedicationReminder {
  constructor(data) {
    super(data);
  }

  // Gauarav changes
  getOrganizerDetailsFromId = async (organizer_id, organizer_type) => {
    let organizer = {};

    if (organizer_type === "doctor" || organizer_type === "hsp") {
      // organizer = await doctorService.getDoctorByDoctorId(organizer_id);
      organizer = await doctorService.getDoctorByUserId(organizer_id);
    }
    return organizer;
  };

  getBasicInfo = async () => {
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
      updatedAt,
      createdAt,
      rr_rule = "",
    } = _data || {};
    let organizerDetails = await this.getOrganizerDetailsFromId(
      organizer_id,
      organizer_type
    );

    return {
      basic_info: {
        id,
        description,
        details,
        start_date,
        end_date,
        updated_at: updatedAt,
        created_at: createdAt,
      },
      organizer: {
        id: organizer_id,
        category: organizer_type,
        name: `${organizerDetails.first_name} ${organizerDetails.last_name}`,
      },
      participant_id,
      rr_rule,
    };
  };

  getAllInfo = async () => {
    console.log("get all info - 1 ", getTime());
    const { getBasicInfo, getMReminderId } = this;
    console.log("get all info - 2 ", getTime());
    const eventService = new EventService();
    console.log("get all info - 3 ", getTime());
    const currentDate = moment().endOf("day").utc().toDate();
    console.log("get all info - 4 ", getTime());
    // const scheduleEvents = await eventService.getAllPreviousByData({
    //   event_id: getMReminderId(),
    //   date: currentDate,
    //   event_type: EVENT_TYPE.MEDICATION_REMINDER,
    // });
    console.log({
      data: {
        event_id: getMReminderId(),
        date: currentDate,
        event_type: EVENT_TYPE.MEDICATION_REMINDER,
      },
    });
    const scheduleEvents = [];
    console.log("get all info - 5 ", getTime());

    let medicationEvents = {};
    let remaining = 0;
    let latestPendingEventId;
    console.log("get all info - 6 ", getTime());
    const scheduleEventIds = [];
    for (const events of scheduleEvents) {
      console.log("scheduleevent loop - 1 ", getTime());
      const scheduleEvent = await EventWrapper(events);
      console.log("scheduleevent loop - 2 ", getTime());
      scheduleEventIds.push(scheduleEvent.getScheduleEventId());
      console.log("scheduleevent loop - 3 ", getTime());
      if (scheduleEvent.getStatus() !== EVENT_STATUS.COMPLETED) {
        if (!latestPendingEventId) {
          latestPendingEventId = scheduleEvent.getScheduleEventId();
        }
        remaining++;
      }
    }
    console.log("get all info - 7 ", getTime());
    const basicInfo = await getBasicInfo();
    console.log("get all info - 8 ", getTime());
    return {
      medications: {
        [getMReminderId()]: {
          ...basicInfo,
          remaining,
          total: scheduleEvents.length,
          upcoming_event_id: latestPendingEventId,
        },
      },
    };
  };

  getAllInfoNew = async () => {
    console.log("get all info - 1 ", getTime());
    const { getBasicInfo, getMReminderId } = this;
    console.log("get all info - 2 ", getTime());
    const eventService = new EventService();
    console.log("get all info - 3 ", getTime());
    const currentDate = moment().endOf("day").utc().toDate();
    console.log("get all info - 4 ", getTime());
    const scheduleEvents = await eventService.getAllPreviousByData({
      event_id: [
        14881, 14882, 14883, 14884, 17849, 17850, 17851, 17852, 17853, 18032,
      ],
      date: currentDate,
      event_type: EVENT_TYPE.MEDICATION_REMINDER,
    });
    console.log({
      data: {
        event_id: getMReminderId(),
        date: currentDate,
        event_type: EVENT_TYPE.MEDICATION_REMINDER,
      },
    });

    console.log("get all info - 5 ", getTime());

    let medicationEvents = {};
    let remaining = 0;
    let latestPendingEventId;
    console.log("get all info - 6 ", getTime());
    const scheduleEventIds = [];
    for (const events of scheduleEvents) {
      console.log("scheduleevent loop - 1 ", getTime());
      const scheduleEvent = await EventWrapper(events);
      console.log("scheduleevent loop - 2 ", getTime());
      scheduleEventIds.push(scheduleEvent.getScheduleEventId());
      console.log("scheduleevent loop - 3 ", getTime());
      if (scheduleEvent.getStatus() !== EVENT_STATUS.COMPLETED) {
        if (!latestPendingEventId) {
          latestPendingEventId = scheduleEvent.getScheduleEventId();
        }
        remaining++;
      }
    }
    console.log("get all info - 7 ", getTime());
    const basicInfo = await getBasicInfo();
    console.log("get all info - 8 ", getTime());
    return {
      medications: {
        [getMReminderId()]: {
          ...basicInfo,
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
