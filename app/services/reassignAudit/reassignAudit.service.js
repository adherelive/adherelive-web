const reassignAudit = require("../../models/mongoModel/reassignAudit");
import { createLogger } from "../../../libs/log";

const log = createLogger("WEB USER CONTROLLER");

class reassignAuditService {
  getAuditByActivitiyData = async (data) => {
    log.debug(data);
    try {
      let audites = await reassignAudit.find(data);
      return audites;
    } catch (ex) {
      log.debug(ex);
    }
  };
}

export default new reassignAuditService();
