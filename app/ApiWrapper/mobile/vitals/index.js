import Logger from "../../../../libs/log";

import BaseVital from "../../../services/vitals";

// SERVICES
import VitalService from "../../../services/vitals/vital.service";
import eventService from "../../../services/scheduleEvents/scheduleEvent.service";

// WRAPPERS
import VitalTemplateWrapper from "../../../ApiWrapper/mobile/vitalTemplates";
import CarePlanWrapper from "../../../ApiWrapper/mobile/carePlan";
import EventWrapper from "../../common/scheduleEvents";
import {EVENT_STATUS, EVENT_TYPE} from "../../../../constant";
import moment from "moment";

const Log = new Logger("MOBILE > API_WRAPPER > VITALS");
const EventService = new eventService();

class VitalWrapper extends BaseVital {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
        const {_data} = this;
        const {id, vital_template_id, care_plan_id, start_date, end_date, details, description} = _data || {};

        return {
            basic_info: {
                id,
                vital_template_id,
                care_plan_id
            },
            details,
            start_date,
            end_date,
            description
        };
    };

    getAllInfo = async () => {
        const {getBasicInfo, getVitalId} = this;

        const currentDate = moment().endOf("day").utc().toDate();

        const scheduleEvents = await EventService.getAllPreviousByData({
            event_id: getVitalId(),
            date: currentDate
        });

        let vitalEvents = {};
        let remaining = 0;
        let latestPendingEventId;

        const scheduleEventIds = [];
        for(const events of scheduleEvents) {
            const scheduleEvent = await EventWrapper(events);
            if(scheduleEvent.getEventType() === EVENT_TYPE.VITALS) {
                scheduleEventIds.push(scheduleEvent.getScheduleEventId());

                if(scheduleEvent.getStatus() === EVENT_STATUS.PENDING || scheduleEvent.getStatus() === EVENT_STATUS.SCHEDULED) {
                    if(!latestPendingEventId) {
                        latestPendingEventId = scheduleEvent.getScheduleEventId();
                    }
                    remaining++;
                }
            }
        }

        return {
            vitals: {
                [getVitalId()]: {
                    ...getBasicInfo(),
                    remaining,
                    total: scheduleEvents.length,
                    upcoming_event_id: latestPendingEventId
                },
            },
        };
    };

    getReferenceInfo = async () => {
        const {_data} = this;
        const {getVitalId, vital_template, care_plan} = _data || {};

        const vitalTemplateData = {};
        const carePlanData = {};

        const vitalTemplates = await VitalTemplateWrapper({data: vital_template});
        vitalTemplateData[vitalTemplates.getVitalTemplateId()] = vitalTemplates.getBasicInfo();

        const carePlans = await CarePlanWrapper(care_plan);
        carePlanData[carePlans.getCarePlanId()] = await carePlans.getAllInfo();

        return {
            vital_templates: {
                ...vitalTemplateData
            },
            care_plans: {
                ...carePlanData,
            }
        }
    };
}

export default async ({data = null, id = null}) => {
  if(data) {
      return new VitalWrapper(data);
  }
  const vital = await VitalService.getByData({id});
  return new VitalWrapper(vital);
};