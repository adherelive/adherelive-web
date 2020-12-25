import SubscriptionService from "../services/subscriptions/subscription.service";
import TwilioService from "../services/twilio/twilio.service";

// wrappers
import SubscriptionWrapper from "../ApiWrapper/mobile/subscriptions";
import DoctorWrapper from "../ApiWrapper/mobile/doctor";
import PatientWrapper from "../ApiWrapper/mobile/patient";
import {USER_CATEGORY} from "../../constant";

import Logger from "../../libs/log";

const Log = new Logger("CRON > RENEW > SUBSCRIPTION");

class RenewSubscription {

    runObserver = async () => {
        try {

            const subscriptionService = new SubscriptionService();
            const subscriptions = await subscriptionService.getAllTodayRenewingData();

            Log.info(`TOTAL SUBSCRIPTIONS DUE : ${subscriptions.length}`);
            if(subscriptions.length > 0) {
                for(let i = 0; i < subscriptions.length; i++) {
                    const subscription = await SubscriptionWrapper({data: subscriptions[i]});

                    let patientUserId = null;
                    if(subscription.getSubscriberType() === USER_CATEGORY.PATIENT) {
                        const patient = await PatientWrapper(null, subscription.getSubscriberId());
                        patientUserId = patient.getUserId();
                    }

                    const {payment_products, payment_product_id} = await subscription.getReferenceInfo();

                    const {basic_info: {amount, name, type, creator_id, creator_type} = {}} = payment_products[payment_product_id] || {};

                    let doctorUserId = null;
                    if(creator_type === USER_CATEGORY.DOCTOR) {
                        const doctor = await DoctorWrapper(null, creator_id);
                        doctorUserId = doctor.getUserId();
                    }

                    const message = JSON.stringify({
                        meta: {
                            name,
                            amount,
                            type,
                            productId: payment_product_id
                        }
                    });

                    if(patientUserId && doctorUserId) {
                        const twilioMessage = await TwilioService.addUserMessage(doctorUserId, patientUserId, message);
                    } else {
                        Log.info(`patientUserId : ${patientUserId} | doctorUserId : ${doctorUserId}`);
                    }
                }
            } else {
                // log no data
                Log.info(`No subscriptions found due today`);
            }
        } catch(error) {
            Log.debug("RenewSubscription 500 error", error);
        }
    };
}

export default new RenewSubscription();