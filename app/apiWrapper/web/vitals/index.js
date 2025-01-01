import Logger from "../../../../libs/log";

import BaseVital from "../../../services/vitals";

// Services
import VitalService from "../../../services/vitals/vital.service";

// Wrappers
import VitalTemplateWrapper from "../../web/vitalTemplates";
import CarePlanWrapper from "../../web/carePlan";
import moment from "moment";
import EventService from "../../../services/scheduleEvents/scheduleEvent.service";
import EventWrapper from "../../common/scheduleEvents";
import { EVENT_STATUS, EVENT_TYPE, FEATURE_TYPE } from "../../../../constant";
import FeatureDetailService from "../../../services/featureDetails/featureDetails.service";
import FeatureDetailWrapper from "../featureDetails";

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
    const { getBasicInfo, getVitalId, getStartDate } = this;

    const eventService = new EventService();

    const currentDate = moment().endOf("day").utc().toDate();

    const scheduleEvents = await eventService.getAllPastData({
      startDate: getStartDate(),
      event_id: getVitalId(),
      date: currentDate,
    });

    let vitalEvents = {};
    let remaining = 0;
    let latestPendingEventId;

    const vitalData = await FeatureDetailService.getDetailsByData({
      feature_type: FEATURE_TYPE.VITAL,
    });

    const vitalDetails = await FeatureDetailWrapper(vitalData);
    const { repeat_intervals = {} } = vitalDetails.getFeatureDetails() || {};

    const scheduleEventIds = [];
    for (const events of scheduleEvents) {
      const scheduleEvent = await EventWrapper(events);
      const x = scheduleEvent.getAllInfo();
      // Log.debug("28739812372 scheduleEvent.getAllInfo() ---> ", x.details.details.repeat_interval_id);
      if (scheduleEvent.getEventType() === EVENT_TYPE.VITALS) {
        scheduleEventIds.push(scheduleEvent.getScheduleEventId());

        if (scheduleEvent.getStatus() !== EVENT_STATUS.COMPLETED) {
          if (!latestPendingEventId) {
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
          total: scheduleEventIds.length,
        },
      },
    };
  };

  getReferenceInfo = async () => {
    const { _data, getAllInfo, getVitalTemplateId } = this;
    const { vital_template, care_plan } = _data || {};

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
