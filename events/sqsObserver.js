import { EVENT_TYPE } from "../constant";
import { createLogger } from "../libs/logger";
import {
    handleAppointments,
    handleAppointmentsTimeAssignment,
    handleCarePlans,
    handleDiet,
    handleMedications,
    handleVitals,
    handleWorkout,
} from "./helper";

const logger = createLogger("EVENTS > SQS_OBSERVER");

export default class SqsObserver {
  constructor() {}

  observe = async (service) => {
    try {
      const eventMessage = await service.receiveMessage();
      logger.debug("SqsObserver observe event message: ", eventMessage);

      if (eventMessage) {
        for (const message of eventMessage) {
          const data = JSON.parse(message.Body) || null;

          logger.debug("SQS Observer observe data --> ", data);

          if (Array.isArray(data)) {
            for (let index = 0; index < data.length; index++) {
              await this.execute({ data: data[index], service, message });
            }
          } else {
            await this.execute({ data, service, message });
          }
        }
      }
    } catch (error) {
      logger.error("SQS Observer observe catch error: ", error);
    }
  };

  execute = async ({ data, service, message }) => {
    try {
      const { type = "" } = data || {};

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

      logger.debug(`SQS Observe execute response: ${response}`);
      logger.debug(`SQS Observe execute message ReceiptHandle: ${message.ReceiptHandle}`);

      if (response === true) {
        const deleteMessage = await service.deleteMessage(
          message.ReceiptHandle
        );

        logger.debug("SQS Observer execute deleteMessage: ", deleteMessage);
      }
    } catch (error) {
      logger.error("SQS Observe execute catch error: ", error);
    }
  };
}
