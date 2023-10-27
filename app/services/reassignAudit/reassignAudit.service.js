const reassignAudit = require("../../models/mongoModel/reassignAudit");
import Log from "../../../libs/log";
const Logger = new Log("WEB USER CONTROLLER");


class reassignAuditService {

    getAuditByActivitiyData = async (data) => {
        try {
            let audites = await reassignAudit.find(data);
            return res.status(200).send(audites);
        } catch (ex) {
            console.log(ex);
        }
    };
}

export default new reassignAuditService();
