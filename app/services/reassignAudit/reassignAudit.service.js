const reassignAudit = require("../../models/mongoModel/reassignAudit");
import { createLogger } from "../../../libs/logger";

const logger = createLogger("WEB USER CONTROLLER");

class reassignAuditService {
  getAuditByActivitiyData = async (data) => {
    logger.debug(data);
    try {
      let audites = await reassignAudit.find(data);
      return audites;
    } catch (ex) {
      logger.debug(ex);
    }
  };
}

export default new reassignAuditService();
