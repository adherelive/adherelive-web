import { createLogger } from "../../../libs/log";

const log = createLogger("PATIENT > HELPER");

export const getCarePlanData = async (carePlans = []) => {
  try {
    for (let index = 0; index < carePlans.length; index++) {}
  } catch (error) {
    log.debug("getCarePlanData catch error: ", error);
    return {};
  }
};
