import moment from "moment";
import { EVENT_STATUS, EVENT_TYPE } from "../../constant";
import Logger from "../../libs/log";

// services
import medicationService from "../services/medicationReminder/mReminder.service";
import EventService from "../services/scheduleEvents/scheduleEvent.service";
import QueueService from "../services/awsQueue/queue.service";

const Log = new Logger("LONG_TERM > CRONS");

class LongTerm {
  getMedications = async () => {
    try {
      let medicationIds = [];
      const allMedications =
        await medicationService.getAllMedicationByData({ end_date: null }) || [];

      if (allMedications.length > 0) {
        for (const medication of allMedications) {
          const { id } = medication || {};
          medicationIds.push(id);
        }
      }

      return medicationIds;
    } catch (error) {
      Log.debug("getMedications error", error);
      throw error;
    }
  };

  createMedicationEvents = async (medicationId) => {
    try {
      const eventService = new EventService();

      const medication = await medicationService.getMedication({
        id: medicationId,
      });

      const scheduleEvent =
        await eventService.getEventByData({
          event_id: medicationId,
          event_type: EVENT_TYPE.MEDICATION_REMINDER,
        }) || null;

      const { details: { actor, participants = [] } = {} } = scheduleEvent || {};

      const { details, details: { when_to_take } = {} } = medication || {};

      const { id: actorId } = actor || {};

      let patientId = null;
      for (const participant of participants) {
        if (participant !== actorId) {
          patientId = participant;
          break;
        }
      }

      const eventScheduleData = {
        patient_id: patientId,
        type: EVENT_TYPE.MEDICATION_REMINDER,
        event_id: medicationId,
        details,
        //   status: EVENT_STATUS.SCHEDULED,
        start_date: moment()
          .utc()
          .toISOString(),
        end_date: null,
        when_to_take,
        participants,
        actor,
        participant_one: patientId,
        participant_two: actorId,
      };

      const queueService = new QueueService();
      await queueService.sendMessage(eventScheduleData);
    } catch (error) {
      Log.debug("createMedicationEvents error", error);
      throw error;
    }
  };

  observer = async () => {
    try {
      const eventService = new EventService();

      // medications
      const medicationIds = await this.getMedications();

      Log.debug("medicationIds", medicationIds);

      if (medicationIds.length > 0) {
        for (const medicationId of medicationIds) {
          const scheduleEvents =
            (await eventService.getAllEventByData({
              event_id: medicationId,
              event_type: EVENT_TYPE.MEDICATION_REMINDER,
              status: EVENT_STATUS.PENDING,
            })) || [];

            Log.debug("scheduleEvents", scheduleEvents.length);

          if (scheduleEvents.length === 0) {
            await this.createMedicationEvents(medicationId);
          }
        }
      }

    } catch (error) {
      Log.debug("observer error", error);
      throw error;
    }
  };
}

export default new LongTerm();