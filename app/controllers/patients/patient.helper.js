import { createLogger } from "../../../libs/logger";

const logger = createLogger("PATIENT > HELPER");

export const getCarePlanData = async (carePlans = []) => {
  try {
    for (let index = 0; index < carePlans.length; index++) {}
  } catch (error) {
    logger.debug("getCarePlanData catch error: ", error);
    return {};
  }
};
