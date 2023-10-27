const reassignAudit = require("../../models/mongoModel/reassignAudit");
import Log from "../../../libs/log";
const Logger = new Log("WEB USER CONTROLLER");


class reassignAuditService {

    getAuditByActivitiyData = async (data) => {
        console.log(data)
        try {
            let audites = await reassignAudit.find(data);
            return audites;
        } catch (ex) {
            console.log(ex);
        }
    };
}

export default new reassignAuditService();
