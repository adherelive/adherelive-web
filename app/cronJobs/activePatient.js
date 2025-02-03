import { createLogger } from "../../libs/log";
import moment from "moment";

// services
import ProviderService from "../services/provider/provider.service";
import DoctorProviderMappingService from "../services/doctorProviderMapping/doctorProviderMapping.service";

import CarePlanService from "../services/carePlan/carePlan.service";
import ScheduleEventService from "../services/scheduleEvents/scheduleEvent.service";

// wrappers
import ProviderWrapper from "../apiWrapper/web/provider";
import CarePlanWrapper from "../apiWrapper/web/carePlan";
import { EVENT_STATUS, EVENT_TYPE } from "../../constant";

const Log = createLogger("CRON - ACTIVE_PATIENT");

class ActivePatient {
  getAllProviders = async () => {
    try {
      // const providerService = new ProviderService();
      const providers = (await ProviderService.getAll()) || [];
      // Log.debug("providers", providers);
      return providers;
    } catch (error) {
      Log.debug("getAllProviders catch error", error);
      throw error;
    }
  };

  getAllDoctors = async () => {
    try {
      const providers = await this.getAllProviders();
      let doctorIds = [];
      for (let i = 0; i < providers.length; i++) {
        const provider = await ProviderWrapper(providers[i]);

        const doctors =
          (await DoctorProviderMappingService.getAllDoctorIds(
            provider.getProviderId()
          )) || [];
        doctors.forEach((doctor) => {
          const { doctor_id } = doctor || {};
          doctorIds = [...doctorIds, doctor_id];
        });
      }
      // Log.debug("doctor IDS", doctorIds);

      return doctorIds;
    } catch (error) {
      Log.debug("getAllDoctors catch error", error);
      throw error;
    }
  };

  getAllCarePlans = async () => {
    try {
      const doctorIds = await this.getAllDoctors();
      const carePlans =
        (await CarePlanService.getMultipleCarePlanByData({
          doctor_id: doctorIds,
        })) || [];

      let carePlanData = {};
      let carePlanIds = [];
      for (let i = 0; i < carePlans.length; i++) {
        const carePlan = await CarePlanWrapper(carePlans[i]);
        carePlanData[carePlan.getCarePlanId()] = await carePlan.getAllInfo();
        carePlanIds.push(carePlan.getCarePlanId());
      }
      Log.debug("Care Plan IDs: ", carePlanIds);
      return { carePlanData, carePlanIds };
    } catch (error) {
      Log.debug("getAllCarePlans catch error: ", error);
      throw error;
    }
  };

  getEvents = async () => {
    try {
      const { carePlanData, carePlanIds } = await this.getAllCarePlans();

      const eventService = new ScheduleEventService();

      for (let id of carePlanIds) {
        const {
          appointment_ids,
          medication_ids,
          vital_ids,
          diet_ids,
          workout_ids,
        } = carePlanData[id] || {};

        const events =
          (await eventService.getAllEventStatusByData({
            appointment: {
              event_id: appointment_ids,
              event_type: EVENT_TYPE.APPOINTMENT,
            },
            medication: {
              event_id: medication_ids,
              event_type: EVENT_TYPE.MEDICATION_REMINDER,
            },
            vital: {
              event_id: vital_ids,
              event_type: EVENT_TYPE.VITALS,
            },
            diet: {
              event_id: diet_ids,
              event_type: EVENT_TYPE.DIET,
            },
            workout: {
              event_id: workout_ids,
              event_type: EVENT_TYPE.WORKOUT,
            },
          })) || [];
        Log.info(
          `Total events :: ${events.length} :: for Care Plan ID :: ${id}`
        );
        Log.debug("Status of the events: ", events);

        let passedEventCount = 0;

        let pendingEventCount = 0;

        events.forEach((event) => {
          const { status } = event || {};
          /**
           * checking if any event is either completed or expired to count as passed.
           * TODO: In the future, might have to include cancelled status
           */
          if (
            status === EVENT_STATUS.COMPLETED ||
            status === EVENT_STATUS.EXPIRED ||
            status === EVENT_STATUS.CANCELLED
          ) {
            passedEventCount++;
          }

          if (
            status === EVENT_STATUS.PENDING ||
            status === EVENT_STATUS.SCHEDULED ||
            status === EVENT_STATUS.PRIOR
          ) {
            pendingEventCount++;
          }
        });

        // if all events are done, then marking the existing care plan as expired or inactive patient
        if (events.length > 0 && events.length === passedEventCount) {
          await CarePlanService.updateCarePlan(
            {
              expired_on: moment().utc().toISOString(),
            },
            id
          );
        } else if (pendingEventCount > 0) {
          // mark active again if any pending events there
          await CarePlanService.updateCarePlan({ expired_on: null }, id);
        }
      }
    } catch (error) {
      Log.debug("getEvents catch error: ", error);
      throw error;
    }
  };

  /**
   * This is the function which runs the
   * @returns {Promise<void>}
   */
  runObserver = async () => {
    try {
      await this.getEvents();
    } catch (error) {
      Log.debug("runObserver catch error: ", error);
      throw error;
    }
  };
}

export default new ActivePatient();
