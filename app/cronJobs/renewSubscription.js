import SubscriptionService from "../services/subscriptions/subscription.service";
import TwilioService from "../services/twilio/twilio.service";

// wrappers
import SubscriptionWrapper from "../apiWrapper/mobile/subscriptions";
import DoctorWrapper from "../apiWrapper/mobile/doctor";
import PatientWrapper from "../apiWrapper/mobile/patient";
import { USER_CATEGORY } from "../../constant";

import { createLogger } from "../../libs/log";

const logger = createLogger("CRON > RENEW > SUBSCRIPTION");

class RenewSubscription {
  runObserver = async () => {
    try {
      const subscriptionService = new SubscriptionService();
      const subscriptions = await subscriptionService.getAllTodayRenewingData();

      logger.debug(`TOTAL SUBSCRIPTIONS DUE : ${subscriptions.length}`);
      if (subscriptions.length > 0) {
        for (let i = 0; i < subscriptions.length; i++) {
          const subscription = await SubscriptionWrapper({
            data: subscriptions[i],
          });

          let patientUserRoleId = null;
          if (subscription.getSubscriberType() === USER_CATEGORY.PATIENT) {
            patientUserRoleId = subscription.getSubscriberId();
          }

          const { payment_products, payment_product_id } =
            await subscription.getReferenceInfo();

          const {
            basic_info: { amount, name, type, creator_id, creator_type } = {},
          } = payment_products[payment_product_id] || {};

          let doctorUserRoleId = null;
          if (
            creator_type === USER_CATEGORY.DOCTOR ||
            creator_type === USER_CATEGORY.HSP
          ) {
            doctorUserRoleId = creator_id;
          }

          const message = JSON.stringify({
            meta: {
              name,
              amount,
              type,
              productId: payment_product_id,
            },
          });

          if (patientUserRoleId && doctorUserRoleId) {
            const twilioMessage = await TwilioService.addUserMessage(
              doctorUserRoleId,
              patientUserRoleId,
              message
            );
          } else {
            logger.debug(
              `patientUserId : ${patientUserRoleId} | doctorUserId : ${doctorUserRoleId}`
            );
          }
        }
      } else {
        // log no data
        logger.debug(`No subscriptions found due today`);
      }
    } catch (error) {
      logger.debug("RenewSubscription 500 error", error);
    }
  };
}

export default new RenewSubscription();
