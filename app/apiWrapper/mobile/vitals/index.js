import { createLogger } from "../../../../libs/logger";

import BaseVital from "../../../services/vitals";

// Services
import VitalService from "../../../services/vitals/vital.service";
import EventService from "../../../services/scheduleEvents/scheduleEvent.service";

// Wrappers
import VitalTemplateWrapper from "../../mobile/vitalTemplates";
import CarePlanWrapper from "../../mobile/carePlan";
import EventWrapper from "../../common/scheduleEvents";
import { EVENT_STATUS, EVENT_TYPE } from "../../../../constant";
import moment from "moment";

const logger = createLogger("MOBILE > API_WRAPPER > VITALS");

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
      description,
    } = _data || {};

    return {
      basic_info: {
        id,
        vital_template_id,
        care_plan_id,
      },
      details,
      start_date,
      end_date,
      description,
    };
  };

  getAllInfo = async () => {
    const { getBasicInfo, getVitalId } = this;
    const eventService = new EventService();

    const currentDate = moment().endOf("day").utc().toDate();

    const scheduleEvents = await eventService.getAllPreviousByData({
      event_id: getVitalId(),
      date: currentDate,
      event_type: EVENT_TYPE.VITALS,
    });

    let vitalEvents = {};
    let remaining = 0;
    let latestPendingEventId;
    let lastCompletedEventId;
    let lastCompletedEventEndTime = null;

    const scheduleEventIds = [];
    for (const events of scheduleEvents) {
      const scheduleEvent = await EventWrapper(events);
      scheduleEventIds.push(scheduleEvent.getScheduleEventId());

      if (scheduleEvent.getStatus() !== EVENT_STATUS.COMPLETED) {
        if (
          !latestPendingEventId &&
          scheduleEvent.getStatus() !== EVENT_STATUS.EXPIRED
        ) {
          latestPendingEventId = scheduleEvent.getScheduleEventId();
        }
        remaining++;
      } else {
        lastCompletedEventId = scheduleEvent.getScheduleEventId();
        lastCompletedEventEndTime = scheduleEvent.getEndTime();
      }
    }

    let upcoming_event_id = latestPendingEventId;
    if (lastCompletedEventEndTime) {
      const diff = moment().diff(moment(lastCompletedEventEndTime), "minutes");
      if (diff < 0) {
        upcoming_event_id = lastCompletedEventId;
      }
    }

    return {
      vitals: {
        [getVitalId()]: {
          ...getBasicInfo(),
          remaining,
          total: scheduleEvents.length,
          upcoming_event_id: upcoming_event_id,
        },
      },
    };
  };

  getReferenceInfo = async () => {
    const { _data, getVitalTemplateId, getAllInfo } = this;
    const { getVitalId, vital_template, care_plan } = _data || {};

    const vitalTemplateData = {};
    const carePlanData = {};

    let wrapperQuery = {};
    if (vital_template) {
      wrapperQuery = {
        data: vital_template,
      };
    } else {
      wrapperQuery = {
        id: getVitalTemplateId(),
      };
    }

    const vitalTemplates = await VitalTemplateWrapper(wrapperQuery);
    vitalTemplateData[vitalTemplates.getVitalTemplateId()] =
      vitalTemplates.getBasicInfo();

    if (care_plan) {
      const carePlans = await CarePlanWrapper(care_plan);
      carePlanData[carePlans.getCarePlanId()] = await carePlans.getAllInfo();
    }

    return {
      ...(await getAllInfo()),
      vital_templates: {
        ...vitalTemplateData,
      },
      care_plans: {
        ...carePlanData,
      },
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
