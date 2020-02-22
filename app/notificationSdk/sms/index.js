import { NOTIFY_WITH } from "../notificationType";
import { differenceInMinutes } from "date-fns";
import { EVENT_IS } from "../../../constant";
import SmsSender from "../../communications/sms/smsSender";
const payloadBuilder = require("../helpers/messageBuilder");

const { NotificationSdk } = require("../");
const { Proxy_Sdk, EVENTS } = require("../../proxySdk");

const actionList = {
  CREATE: "create",
  RESCHEDULE: "reschedule",
  START: "start",
  PRIOR: "prior",
  DELETE: "delete",
  SHARE: "share",
  UPDATE: "update",
  DELETE_ALL: "delete_all"
};

class SmsNotification {
  constructor({}) {
    this._event = NotificationSdk;
  }

  async notify(args) {
    try {
      let { payload = {} } = args;
      const { data = {}, eventIs } = payload;
      if (data) {
        let { eventCategory, eventType } = data;
        let actionType = null,
          etype = null;

        switch (eventIs) {
          case EVENT_IS.CREATED:
            actionType = actionList.CREATE;
            etype = eventCategory;
            break;

          case EVENT_IS.RESCHEDULED:
            actionType = actionList.RESCHEDULE;
            etype = eventType;
            break;

          case EVENT_IS.PRIOR:
            actionType = actionList.PRIOR;
            etype = eventType;
            break;

          case EVENT_IS.START:
            actionType = actionList.START;
            etype = eventType;
            break;

          case EVENT_IS.CANCEL:
            actionType = actionList.DELETE;
            etype = eventType;
            break;

          case EVENT_IS.CANCEL_ALL:
            actionType = actionList.DELETE_ALL;
            etype = eventCategory;
            break;

          case EVENT_IS.SHARE:
            actionType = actionList.SHARE;
            etype = eventCategory;
            break;

          case EVENT_IS.UPDATED:
            actionType = actionList.UPDATE;
            etype = eventType;
            break;

          case EVENT_IS.DELETE:
            actionType = actionList.DELETE;
            etype = eventCategory;
            break;

          default:
            break;
        }
        let buildPayload = await payloadBuilder(args)
          .type(etype)
          .action(actionType)
          .getBuild();
        console.log("buildPayload ----", buildPayload);
        if (buildPayload) {
          const res = await SmsSender(buildPayload).sendSms();
        }
      }
    } catch (e) {
      console.log("e ----", e);
    }
  }

  runObservers() {
    this._event.on(NOTIFY_WITH.SMS, this.notify);
  }
}

export default new SmsNotification({});
