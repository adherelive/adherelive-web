import Logger from "../../../libs/log";

const Log = new Logger("EVENT HELPER");
import { EVENT_TYPE } from "../../../constant";

// services
import CarePlanService from "../../services/carePlan/carePlan.service";
import EventService from "../../services/scheduleEvents/scheduleEvent.service";

// wrappers
import CarePlanWrapper from "../../ApiWrapper/web/carePlan";
import EventWrapper from "../../ApiWrapper/common/scheduleEvents";

export const doctorChart = async req => {
  try {
    const { userDetails: { userCategoryId: doctor_id } = {} } = req;
    Log.info(`DOCTOR ID (doctor_id) : ${doctor_id}`);

    const eventService = new EventService();

    // get all careplans(treatments) attached to doctor
    const carePlans =
      (await CarePlanService.getCarePlanByData({
        doctor_id
      })) || [];

    Log.debug("ALL CARE_PLANS", carePlans);

    let appointmentIds = [];
    let medicationIds = [];
    let vitalIds = [];

    // extract all event_ids from careplan attached to doctor
    for (let i = 0; i < carePlans.length; i++) {
      const carePlan = await CarePlanWrapper(carePlans[i]);
      const {
        appointment_ids,
        medication_ids,
        vital_ids
      } = await carePlan.getAllInfo();

      appointmentIds = [...appointmentIds, ...appointment_ids];
      medicationIds = [...medicationIds, ...medication_ids];
      vitalIds = [...vitalIds, ...vital_ids];
    }

    // fetch all schedule events in latest -> last order for each event_ids collected
      // missed range : 1 WEEK
    const scheduleEvents =
      (await eventService.getMissedByData({
        appointment_ids: appointmentIds,
        medication_ids: medicationIds,
        vital_ids: vitalIds
      })) || [];

    Log.debug("ALL SCHEDULE_EVENTS", scheduleEvents);

    return [
      { ...(await getFormattedData(scheduleEvents)) },
      "Missed events fetched successfully"
    ];
  } catch (error) {
    Log.debug("doctorChart catch error", error);
    throw error;
  }
};

export const providerChart = async () => {
  try {
  } catch (error) {
    throw error;
  }
};

// HELPERS
const getFormattedData = async (events = []) => {
    /*
     *
     * separate schedule_event data into :: appointments | medications | vitals
     * further separate it into :: critical | non-critical
     *
     * ex., for medications....
     * missed_medications: {
     *   [event_id]: [
     *       {schedule_event_data_1},
     *       {schedule_event_data_2},
     *       ...
     *   ],
     *   ...
     * },
     * medication_ids: {
     *   critical: [...],
     *   non_critical: [...]
     * },
     * .... // for appointments & vitals
     *
     * */

    let medications = {};
    let medication_critical_ids = [];
    let medication_non_critical_ids = [];

    let appointments = {};
    let appointment_critical_ids = [];
    let appointment_non_critical_ids = [];

    let vitals = {};
    let vital_critical_ids = [];
    let vital_non_critical_ids = [];

    for (let i = 0; i < events.length; i++) {
        const event = await EventWrapper(events[i]);

        switch (event.getEventType()) {
            case EVENT_TYPE.MEDICATION_REMINDER:
                if (!(event.getEventId() in medications)) {
                    medications[event.getEventId()] = [];
                    medications[event.getEventId()].push(event.getAllInfo());
                } else {
                    medications[event.getEventId()].push(event.getAllInfo());
                }

                // critical | non_critical
                if (event.getCriticalValue()) {
                    /*
                     * to avoid duplicate entry. can also use if condition
                     * if(medication_critical_ids.indexOf(event.getEventId()) === -1) {
                     *     medication_critical_ids.push(event.getEventId());
                     * }
                     * ...
                     * */
                    medication_critical_ids.indexOf(event.getEventId()) === -1
                        ? medication_critical_ids.push(event.getEventId())
                        : null;
                } else {
                    medication_non_critical_ids.indexOf(event.getEventId()) === -1
                        ? medication_non_critical_ids.push(event.getEventId())
                        : null;
                }
                break;

            case EVENT_TYPE.APPOINTMENT:
                if (!(event.getEventId() in appointments)) {
                    appointments[event.getEventId()] = [];
                    appointments[event.getEventId()].push(event.getAllInfo());
                } else {
                    appointments[event.getEventId()].push(event.getAllInfo());
                }

                // critical | non_critical
                if (event.getCriticalValue()) {
                    appointment_critical_ids.indexOf(event.getEventId()) === -1
                        ? appointment_critical_ids.push(event.getEventId())
                        : null;
                } else {
                    appointment_non_critical_ids.indexOf(event.getEventId()) === -1
                        ? appointment_non_critical_ids.push(event.getEventId())
                        : null;
                }
                break;
            case EVENT_TYPE.VITALS:
                if (!(event.getEventId() in vitals)) {
                    vitals[event.getEventId()] = [];
                    vitals[event.getEventId()].push(event.getAllInfo());
                } else {
                    vitals[event.getEventId()].push(event.getAllInfo());
                }

                // critical | non_critical
                if (event.getCriticalValue()) {
                    vital_critical_ids.indexOf(event.getEventId()) === -1
                        ? vital_critical_ids.push(event.getEventId())
                        : null;
                } else {
                    vital_non_critical_ids.indexOf(event.getEventId()) === -1
                        ? vital_non_critical_ids.push(event.getEventId())
                        : null;
                }
                break;

        }
    }

    return {
        // medications
        missed_medications: medications,
        medication_ids: {
            critical: medication_critical_ids,
            non_critical: medication_non_critical_ids,
        },

        // appointments
        missed_appointments: appointments,
        appointment_ids: {
            critical: appointment_critical_ids,
            non_critical: appointment_non_critical_ids,
        },

        // actions (vitals)
        missed_vitals: vitals,
        vital_ids: {
            critical: vital_critical_ids,
            non_critical: vital_non_critical_ids,
        }
    };
};
