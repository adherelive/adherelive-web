import Controller from "../index";
import Logger from "../../../libs/log";
// services
import reassignAuditService from "../../services/reassignAudit/reassignAudit.service";
import ServiceSubscriptionMapping from "../../services/serviceSubscriptionMapping/serviceSubscritpionMapping.service";
const Log = new Logger("WEB > CONTROLLER > Service Offering");
import { USER_CATEGORY } from "../../../constant";
class reassignAuditController extends Controller {
    constructor() {
        super();
    }

    getAuditByActivityId = async (req, res) => {
        const { raiseSuccess, raiseClientError, raiseServerError } = this;
        try {
            const { query: { activity_id } } = req;
            let reassignAuditServiceData = await reassignAuditService.getAuditByActivitiyData({ activity_id });
            return raiseSuccess(
                res,
                200,
                {
                    ...reassignAuditServiceData,
                },
                "Data Fetched Successfully"
            );
        } catch (ex) {
            Log.debug("getServiceByData 500 error", ex);
            return raiseServerError(res);
        }
    };

}

export default new reassignAuditController();
