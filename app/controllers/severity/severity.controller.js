import Controller from "../";
import severityService from "../../services/severity/severity.service";
import SeverityWrapper from "../../ApiWrapper/web/severity";

import Log from "../../../libs/log";

const Logger = new Log("WEB DEGREE CONTROLLER");

class SeverityController extends Controller {
  constructor() {
    super();
  }

  getAll = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { query } = req;
      const { value } = query || {};

      // Logger.debug("value in req", value);

      const severityDetails = await severityService.search(value);

      if (severityDetails.length > 0) {
        let severityApiData = {};
        for (const severity of severityDetails) {
          const severityWrapper = await new SeverityWrapper(severity);
          severityApiData[severityWrapper.getSeverityId()] =
            severityWrapper.getBasicInfo();
        }

        return raiseSuccess(
          res,
          200,
          {
            severity: {
              ...severityApiData,
            },
          },
          "Severities fetched successfully"
        );
      } else {
        return raiseClientError(
          res,
          422,
          {},
          `No severity found with name including ${value}`
        );
      }
    } catch (error) {
      Logger.debug("severity search 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new SeverityController();
