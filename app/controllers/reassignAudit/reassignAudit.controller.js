import Controller from "../index";

import { createLogger } from "../../../libs/log";

// Services
import reassignAuditService from "../../services/reassignAudit/reassignAudit.service";
import DoctorService from "../../services/doctor/doctor.service";

const log = createLogger("WEB > CONTROLLER > Service Offering");

class reassignAuditController extends Controller {
  constructor() {
    super();
  }

  getAuditByActivityId = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        query: { activity_id },
      } = req;
      log.debug({ activity_id });
      let reassignAuditServiceData =
        await reassignAuditService.getAuditByActivitiyData({ activity_id });
      let output = [];
      for (let i in reassignAuditServiceData) {
        let object = {};
        object["createdAt"] = reassignAuditServiceData[i]["createdAt"];
        object["updatedAt"] = reassignAuditServiceData[i]["updatedAt"];
        object["reason"] = reassignAuditServiceData[i]["reason"];
        object["assignedByDoctor"] = await DoctorService.getDoctorByDoctorId(
          reassignAuditServiceData[i]["assignedBy"]
        );
        object["assignedToDoctor"] = await DoctorService.getDoctorByDoctorId(
          reassignAuditServiceData[i]["assignedTo"]
        );
        log.debug(reassignAuditServiceData[i]["createdAt"]);
        log.debug(reassignAuditServiceData[i]);
        output.push(object);
      }
      return raiseSuccess(
        res,
        200,
        {
          ...output,
        },
        "Data Fetched Successfully"
      );
    } catch (ex) {
      log.debug("getServiceByData 500 error", ex);
      return raiseServerError(res);
    }
  };
}

export default new reassignAuditController();
