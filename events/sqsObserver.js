import Logger from "../libs/log";
import {EVENT_TYPE} from "../constant";
import {
    handleAppointments,
    handleMedications,
    handleVitals,
    handleCarePlans,
    handleAppointmentsTimeAssignment,
    handleDiet,
    handleWorkout,
} from "./helper";

const Log = new Logger("EVENTS > SQS_OBSERVER");

export default class SqsObserver {
    constructor() {
    }

    observe = async service => {
        try {
            const eventMessage = await service.receiveMessage();
            Log.debug("eventMessage", eventMessage);

            if (eventMessage) {
                for (const message of eventMessage) {
                    const data = JSON.parse(message.Body) || null;

                    Log.debug("observer message --> ", data);

                    if (Array.isArray(data)) {
                        for (let index = 0; index < data.length; index++) {
                            await this.execute({data: data[index], service, message});
                        }
                    } else {
                        await this.execute({data, service, message});
                    }
                }
            }
        } catch (error) {
            Log.debug("observe catch error", error);
        }
    };

    execute = async ({data, service, message}) => {
        try {
            const {type = ""} = data || {};

            let response = false;

            switch (type) {
                case EVENT_TYPE.APPOINTMENT:
                    response = await handleAppointments(data);
                    break;
                case EVENT_TYPE.MEDICATION_REMINDER:
                    response = await handleMedications(data);
                    break;
                case EVENT_TYPE.VITALS:
                    response = await handleVitals(data);
                    break;
                case EVENT_TYPE.CARE_PLAN_ACTIVATION:
                    response = await handleCarePlans(data);
                    break;
                case EVENT_TYPE.APPOINTMENT_TIME_ASSIGNMENT:
                    response = await handleAppointmentsTimeAssignment(data);
                    break;
                case EVENT_TYPE.DIET:
                    response = await handleDiet(data);
                    break;
                case EVENT_TYPE.WORKOUT:
                    response = await handleWorkout(data);
                    break;
                default:
                    response = false;
                    break;
            }

            Log.info(`response ${response}`);
            Log.info(`message.ReceiptHandle ${message.ReceiptHandle}`);

            if (response === true) {
                const deleteMessage = await service.deleteMessage(
                    message.ReceiptHandle
                );

                Log.debug("deleteMessage 81723912 ", deleteMessage);
            }
        } catch (error) {
            Log.debug("execute catch error", error);
        }
    };
}
