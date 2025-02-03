const reassignAudit = require("../../models/mongoModel/reassignAudit");
import { createLogger } from "../../../libs/log";

const Log = createLogger("WEB USER CONTROLLER");

class reassignAuditService {
  getAuditByActivitiyData = async (data) => {
    console.log(data);
    try {
      let audites = await reassignAudit.find(data);
      return audites;
    } catch (ex) {
      console.log(ex);
    }
  };
}

export default new reassignAuditService();
