import BaseMedicationReminder from "../../../services/medicationReminder";

import mReminderService from "../../../services/medicationReminder/mReminder.service";
import carePlanMedicationService from "../../../services/carePlanMedication/carePlanMedication.service";
import eventService from "../../../services/scheduleEvents/scheduleEvent.service";
import moment from "moment";
import { EVENT_STATUS, EVENT_TYPE } from "../../../../constant";
import EventWrapper from "../../common/scheduleEvents";
import MedicineWrapper from "../../mobile/medicine";
import doctorService from "../../../services/doctor/doctor.service";

class MobileMReminderWrapper extends BaseMedicationReminder {
  constructor(data) {
    super(data);
  }

  // Gauarav changes
  getOrganizerDetailsFromId = async (organizer_id, organizer_type) => {
    let organizer = {};

    if (organizer_type === "doctor") {
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
      rr_rule = "",
      updatedAt,
      createdAt,
    } = _data || {};
    let organizerDetails = await this.getOrganizerDetailsFromId(
      organizer_id,
      organizer_type
    );

    return {
      basic_info: {
        id,
        description,
        start_date,
        end_date,
        details,
        updated_at: updatedAt,
        created_at: createdAt,
      },
      organizer: {
        id: organizer_id,
        category: organizer_type,
        name: `${organizerDetails.first_name} ${organizerDetails.last_name}`,
      },
      details,
      participant_id,
      rr_rule,
    };
  };

  getAllInfo = async () => {
    const { getBasicInfo, getMReminderId } = this;
    const EventService = new eventService();

    const currentDate = moment().endOf("day").utc().toDate();

    // get careplan attached to medication
    const medicationCareplan =
      (await carePlanMedicationService.getCareplanByMedication({
        medication_id: getMReminderId(),
      })) || null;
    const { care_plan_id = null } = medicationCareplan || {};

    const scheduleEvents =
      (await EventService.getAllPreviousByData({
        event_id: getMReminderId(),
        date: currentDate,
        event_type: EVENT_TYPE.MEDICATION_REMINDER,
      })) || [];

    let medicationEvents = {};
    let remaining = 0;
    let latestPendingEventId = null;
    let latestPendingDate = null;

    // get next due date for medication
    const nextDueEvent =
      (await EventService.getEventByData({
        status: EVENT_STATUS.PENDING,
        event_id: getMReminderId(),
        event_type: EVENT_TYPE.MEDICATION_REMINDER,
      })) || null;

    latestPendingDate = nextDueEvent ? nextDueEvent.get("start_time") : null;

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
    let basicInfo = await getBasicInfo();
    return {
      medications: {
        [getMReminderId()]: {
          ...basicInfo,
          remaining,
          total: scheduleEvents.length,
          upcoming_event_id: latestPendingEventId,
          upcoming_event_date: latestPendingDate,
          care_plan_id,
        },
      },
    };
  };

  getReferenceInfoWithImp = async () => {
    const { getAllInfo, getMReminderId, getMedicineId, _data } = this;
    const EventService = new eventService();
    const scheduleEvents = await EventService.getAllPreviousByData({
      event_id: getMReminderId(),
      date: moment().utc().toDate(),
      event_type: EVENT_TYPE.MEDICATION_REMINDER,
    });

    const scheduleEventIds = [];
    let scheduleEventData = {};
    for (const events of scheduleEvents) {
      const scheduleEvent = await EventWrapper(events);
      scheduleEventIds.push(scheduleEvent.getScheduleEventId());

      scheduleEventData[scheduleEvent.getScheduleEventId()] =
        scheduleEvent.getAllInfo();
    }

    const { medications } = await getAllInfo();
    const medicationData = medications[getMReminderId()] || {};

    return {
      medications: {
        [getMReminderId()]: {
          ...medicationData,
          event_ids: scheduleEventIds,
        },
      },
      schedule_events: {
        ...scheduleEventData,
      },
    };
  };

  getReferenceInfo = async () => {
    const { getAllInfo, getMReminderId, getMedicineId, _data } = this;
    const { medicine } = _data || {};
    const EventService = new eventService();

    let medicineData = {};

    // medicine
    if (medicine) {
      medicineData = await MedicineWrapper(medicine);
    } else {
      medicineData = await MedicineWrapper(null, getMedicineId());
    }

    const scheduleEvents = await EventService.getAllPreviousByData({
      event_id: getMReminderId(),
      date: moment().utc().toDate(),
      event_type: EVENT_TYPE.MEDICATION_REMINDER,
    });

    const scheduleEventIds = [];
    let scheduleEventData = {};
    for (const events of scheduleEvents) {
      const scheduleEvent = await EventWrapper(events);
      scheduleEventIds.push(scheduleEvent.getScheduleEventId());

      scheduleEventData[scheduleEvent.getScheduleEventId()] =
        scheduleEvent.getAllInfo();
    }

    const { medications } = await getAllInfo();
    const medicationData = medications[getMReminderId()] || {};

    let newData = await medicineData.getBasicInfo();

    return {
      medications: {
        [getMReminderId()]: {
          ...medicationData,
          event_ids: scheduleEventIds,
        },
      },
      schedule_events: {
        ...scheduleEventData,
      },
      medicines: {
        [medicineData.getMedicineId()]: newData,
      },
    };
  };
}

export default async (data = null, id = null) => {
  if (data) {
    return new MobileMReminderWrapper(data);
  }
  const medicationReminder = await mReminderService.getMedication({ id });
  return new MobileMReminderWrapper(medicationReminder);
};
