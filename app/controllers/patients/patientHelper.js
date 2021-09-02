import Logger from "../../../libs/log";

const Log = new Logger("PATIENT > HELPER");

export const getCareplanData = async (carePlans = []) => {
  try {
    for (let index = 0; index < carePlans.length; index++) {}
  } catch (error) {
    Log.debug("getCareplanData catch error", error);
    return {};
  }
};
