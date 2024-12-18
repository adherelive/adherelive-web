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

  /* TODO: Check why this is commented out
      id,
      participant_id,
      organizer_type,
      organizer_id,
      description,
      start_date,
      end_date,
      details,
      rr_rule = "",
  */

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
    const { getBasicInfo, getMReminderId } = this;
    const eventService = new EventService();
    const currentDate = moment().endOf("day").utc().toDate();

    const scheduleEvents = [];

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
    const basicInfo = await getBasicInfo();
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
    const { getBasicInfo, getMReminderId } = this;
    const basicInfo = await getBasicInfo();
    return {
      medications: {
        [getMReminderId()]: {
          ...basicInfo,
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
