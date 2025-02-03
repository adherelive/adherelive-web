import { createLogger } from "../../../libs/log";

const Log = createLogger("PATIENT > HELPER");

export const getCarePlanData = async (carePlans = []) => {
  try {
    for (let index = 0; index < carePlans.length; index++) {}
  } catch (error) {
    Log.debug("getCarePlanData catch error: ", error);
    return {};
  }
};
