import Logger from "../../../../libs/log";

import BaseVital from "../../../services/vitals";

// SERVICES
import VitalService from "../../../services/vitals/vital.service";

// WRAPPERS
import VitalTemplateWrapper from "../../../ApiWrapper/web/vitalTemplates";
import CarePlanWrapper from "../../../ApiWrapper/web/carePlan";
import moment from "moment";
import eventService from "../../../services/scheduleEvents/scheduleEvent.service";
import EventWrapper from "../../common/scheduleEvents";
import { EVENT_STATUS, EVENT_TYPE } from "../../../../constant";

const Log = new Logger("SERVICES > VITALS");

class VitalWrapper extends BaseVital {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data } = this;
    const {
      id,
      vital_template_id,
      care_plan_id,
      start_date,
      end_date,
      details,
      description
    } = _data || {};

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
    const { getBasicInfo, getVitalId, getStartDate } = this;

    const EventService = new eventService();

    const currentDate = moment()
      .endOf("day")
      .utc()
      .toDate();

    const scheduleEvents = await EventService.getAllPastData({
      startDate: getStartDate(),
      event_id: getVitalId(),
      date: currentDate
    });

    let vitalEvents = {};
    let remaining = 0;
    let latestPendingEventId;

    Log.debug("7761283 scheduleEvents --> ", scheduleEvents);

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
          total: scheduleEventIds.length
        }
      }
    };
  };

  getReferenceInfo = async () => {
    const { _data } = this;
    const { vital_template, care_plan } = _data || {};

    const vitalTemplateData = {};
    const carePlanData = {};

    const vitalTemplates = await VitalTemplateWrapper({ data: vital_template });
    vitalTemplateData[
      vitalTemplates.getVitalTemplateId()
    ] = vitalTemplates.getBasicInfo();

    const carePlans = await CarePlanWrapper(care_plan);
    carePlanData[carePlans.getCarePlanId()] = await carePlans.getAllInfo();

    return {
      vital_templates: {
        ...vitalTemplateData
      },
      care_plans: {
        ...carePlanData
      }
    };
  };
}

export default async ({ data = null, id = null }) => {
  if (data) {
    return new VitalWrapper(data);
  }
  const vital = await VitalService.getByData({ id });
  return new VitalWrapper(vital);
};
