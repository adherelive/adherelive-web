import Controller from "../../index";
import Logger from "../../../../libs/log";

import {
  EVENT_STATUS,
  EVENT_TYPE,
  USER_CATEGORY,
  OFFLINE_SYNC_DATA_TASKS
} from "../../../../constant";
import {
  syncMedicationReminderStatus,
  syncVitalsResponseData
} from "./eventSyncHelper";

const Log = new Logger("MOBILE > SYNC > CONTROLLER");

class SyncController extends Controller {
  constructor() {
    super();
  }

  syncOfflineData = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { body } = req;
      const {
        [OFFLINE_SYNC_DATA_TASKS.SYNC_EVENTS_DATA]: event_sync_data = {}
      } = body;
      Log.debug("data got from body is: ", event_sync_data);

      if (event_sync_data && Object.keys(event_sync_data).length) {
        return this.syncEventsOfflineData(req, res);
      }

      return raiseSuccess(res, 200, {}, "No such event present");
    } catch (error) {
      Log.debug("Sync offline data 500 error: ", error);
      return raiseServerError(res);
    }
  };

  syncEventsOfflineData = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { body: { event_sync_data = {} } = {} } = req;
      const { userDetails: { userRoleId } = {} } = req;
      const {
        event_type = null,
        event_data = {},
        event_id = null,
        update_time = null
      } = event_sync_data;
      Log.debug("data got from body is: ", event_type, event_id);

      if (event_type === EVENT_TYPE.MEDICATION_REMINDER) {
        const eventApiDetails = await syncMedicationReminderStatus(
          event_data,
          event_id,
          res
        );
        return raiseSuccess(
          res,
          200,
          {
            schedule_events: {
              [eventApiDetails.getEventId()]: {
                ...eventApiDetails.getAllInfo()
              }
            }
          },
          "Medication reminder event status updated successfully"
        );
      } else if (event_type === EVENT_TYPE.VITALS) {
        const {
          syncEventApiDetails,
          vitalApiDetails,
          vitalTemplate
        } = await syncVitalsResponseData(
          event_data,
          update_time,
          res,
          userRoleId
        );
        console.log("Got data in the sync controller: ");
        return raiseSuccess(
          res,
          200,
          {
            ...(await vitalApiDetails.getAllInfo()),
            schedule_events: {
              [syncEventApiDetails.getEventId()]: {
                ...syncEventApiDetails.getAllInfo()
              }
            }
          },
          `${vitalTemplate.getName().toUpperCase()} vital updated successfully`
        );
      }

      return raiseSuccess(res, 200, {}, "No such event present");
    } catch (error) {
      Log.debug("Sync offline data 500 error: ", error);
      return raiseServerError(res);
    }
  };
}

export default new SyncController();
