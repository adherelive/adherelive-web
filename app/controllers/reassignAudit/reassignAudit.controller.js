import Controller from "../index";
import Logger from "../../../libs/log";
// services
import reassignAuditService from "../../services/reassignAudit/reassignAudit.service";
import DoctorService from "../../services/doctor/doctor.service"
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
            console.log({ activity_id })
            let reassignAuditServiceData = await reassignAuditService.getAuditByActivitiyData({ activity_id });
            let output = []
            for (let i in reassignAuditServiceData) {
                let object = {}
                object["reason"] = inreassignAuditServiceData[i]["reason"]
                object["assignedByDoctor"] = await DoctorService.DoctorService(inreassignAuditServiceData[i]["assignedBy"]);
                object["assignedToDoctor"] = await DoctorService.DoctorService(inreassignAuditServiceData[i]["assignedTo"]);
                output.push(object)
            }
            return raiseSuccess(
                res,
                200,
                {
                    ...object,
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
