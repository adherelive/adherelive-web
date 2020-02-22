import { differenceInMinutes } from "date-fns";

import { NOTIFY_WITH } from "../notificationType";
import { NotificationSdk } from "../";
import Notifier from "../../communications/appNotification";
import { EVENT_IS } from "../../../constant";
const OneSignalNotification = require("../onesignal-notification");
const notificationLogger = require("../../communications/appNotification/helpers/notificationLogger");
const validator = require("../helpers/validator");
const payloadBuilder = require("../helpers/payloadBuilder");
const isEqual = require("lodash/isEqual");
const actionList = {
  CREATE: "create",
  RESCHEDULE: "reschedule",
  START: "start",
  PRIOR: "prior",
  DELETE: "delete",
  SHARE: "share",
  UPDATE: "update",
  DELETE_ALL: "delete_all",
  APPROVED: "approve"
};

class PushAppNotification {
  constructor({}) {
    this._event = NotificationSdk;
  }

  async Notify(args) {
    try {
      let { payLoad = {}, user, actor } = args;

      const { data, eventIs } = payLoad;
      if (data) {
        let {
          _id,
          eventId,
          eventCategory,
          eventType,
          startTime,
          prevStartDate,
          prevEndDate,
          currentStartDate,
          currentEndDate
        } = data;
        let difference = differenceInMinutes(new Date(startTime), new Date());
        // console.log("diff", difference);
        let actionType = null,
          notificationId = null,
          etype = null;
        switch (eventIs) {
          case EVENT_IS.CREATED:
            actionType = actionList.CREATE;
            notificationId = _id;
            etype = eventCategory;
            break;
          case EVENT_IS.RESCHEDULED:
            actionType = actionList.RESCHEDULE;
            notificationId = _id;
            etype = eventType;
            break;
          case EVENT_IS.PRIOR:
            actionType = actionList.PRIOR;
            notificationId = _id;
            etype = eventType;
            break;
          case EVENT_IS.START:
            actionType = actionList.START;
            notificationId = _id;
            etype = eventType;
            break;
          case EVENT_IS.CANCEL:
            actionType = actionList.DELETE;
            notificationId = _id;
            etype = eventType;
            break;
          case EVENT_IS.CANCEL_ALL:
            actionType = actionList.DELETE_ALL;
            notificationId = _id;
            etype = eventCategory;
            break;
          case EVENT_IS.SHARE:
            actionType = actionList.SHARE;
            notificationId = _id;
            etype = eventCategory;
            break;
          case EVENT_IS.UPDATED:
            actionType = actionList.UPDATE;
            notificationId = _id;
            etype = eventType;
            break;
          case EVENT_IS.DELETE:
            actionType = actionList.DELETE;
            notificationId = _id;
            etype = eventCategory;
            break;
          case EVENT_IS.APPROVED:
            actionType = actionList.APPROVED;
            notificationId = _id;
            etype = eventType;
            break;
          default:
            break;
        }

        // if (difference === 30) {
        //   actionType = actionList.PROIR;
        //   notificationId = eventId;
        //   etype = eventType;
        // }

        if (etype !== null) {
          let validData = await validator({
            notificationId,
            sendTo: user._id,
            actor
          })
            .type(etype)
            .action(actionType)
            .isValid();

          if (validData) {
            validData.prevStartDate = prevStartDate;
            validData.prevEndDate = prevEndDate;
            validData.currentStartDate = currentStartDate;
            validData.currentEndDate = currentEndDate;
            let buildPayload = await payloadBuilder(validData)
              .type(etype)
              .action(actionType)
              .getBuild();

            const { actor } = buildPayload;
            if (!isEqual(actor, user._id)) {
              OneSignalNotification.sendPushNotification({
                buildPayload,
                loggedInUser: user._id
              });
              await Notifier({
                buildPayload
              })
                .action(actionType)
                .type(etype)
                .notify();
            }
          } else {
            // notificationLogger.error("invalid payload:", validData);
          }
        }
      }
    } catch (err) {
      console.log("error @ push app noitfier", err);
    }
  }

  runObservers() {
    this._event.on(NOTIFY_WITH.PUSH_APP, this.Notify);
  }
}

export default new PushAppNotification({});
