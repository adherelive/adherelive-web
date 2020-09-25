
import Logger from "../libs/log";
import queueService from "../app/services/awsQueue/queue.service";
import {EVENT_TYPE} from "../constant";
import {handleAppointments, handleMedications, handleVitals} from "./helper";

const Log = new Logger("EVENTS > SQS_OBSERVER");

class SqsObserver {
    constructor() {
    }

    observe = async () => {
        try {
            const eventMessage = await queueService.receiveMessage();
            Log.debug("eventMessage", eventMessage);

            if(eventMessage) {
                for(const message of eventMessage) {
                    const data = JSON.parse(message.Body);

                    Log.debug("observer message --> ", data);
                    const {type = ""} = data || {};

                    let response = false;

                    switch(type) {
                        case EVENT_TYPE.APPOINTMENT:
                            response = await handleAppointments(data);
                            break;
                        case EVENT_TYPE.MEDICATION_REMINDER:
                            response = await handleMedications(data);
                            break;
                        case EVENT_TYPE.VITALS:
                            response = await handleVitals(data);
                            break;
                        default:
                            response = false;
                            break;
                    }

                    Log.info(`response ${response}`);
                    Log.info(`message.ReceiptHandle ${message.ReceiptHandle}`);

                    if(response === true) {
                        const deleteMessage = await queueService.deleteMessage(message.ReceiptHandle);

                        Log.debug("deleteMessage 81723912 ", deleteMessage);
                    }
                }


            }


        } catch(error) {
            Log.debug("observe catch error", error);
        }
    };
}

export default new SqsObserver();