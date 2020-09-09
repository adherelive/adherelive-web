import Controller from "../../index";
import Logger from "../../../../libs/log";
import moment from "moment";

// SERVICES -------------------
import VitalService from "../../../services/vitals/vital.service";
import EventService from "../../../services/scheduleEvents/scheduleEvent.service";

// WRAPPERS -------------------
import EventWrapper from "../../../ApiWrapper/common/scheduleEvents";
import VitalWrapper from "../../../ApiWrapper/mobile/vitals";
import {EVENT_STATUS, EVENT_TYPE} from "../../../../constant";

const Log = new Logger("MOBILE > SCHEDULE_EVENTS > CONTROLLER");

class EventController extends Controller {
    constructor() {
        super();
    }

    getVitalEvent = async (req, res) => {
        const {raiseSuccess, raiseClientError, raiseServerError} = this;
      try {
        Log.debug("req.params", req.params);
        const {params: {id} = {}} = req;

        const events = await EventService.getEventByData({
           id,
        });

        if(events) {
            const event = await EventWrapper(events);
            if(event.getEventType() === EVENT_TYPE.VITALS) {
                const vitals = await VitalWrapper({id: event.getEventId()});
                const {vital_templates} = await vitals.getReferenceInfo();

                return raiseSuccess(
                    res,
                    200,
                    {
                        vital_templates: {
                            ...vital_templates
                        },
                        vital_template_id: vitals.getVitalTemplateId()
                    },
                    "Vital template fetched successfully"
                );
            } else {
                return raiseClientError(
                    res,
                    422,
                    {},
                    "Invalid vital type event"
                );
            }
        } else {
            return raiseClientError(
                res,
                422,
                {},
                "No scheduled vital reminder exists for the event"
            );
        }
      } catch(error) {
          Log.debug("getVitalEvent 500 error", error);
          return raiseServerError(res);
      }
    };
}

export default new EventController();