import Controller from "../index";

import severityService from "../../services/severity/severity.service";
import SeverityWrapper from "../../apiWrapper/web/severity";

import { createLogger } from "../../../libs/log";

const logger = createLogger("WEB DEGREE CONTROLLER");

class SeverityController extends Controller {
  constructor() {
    super();
  }

  getAll = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { query } = req;
      const { value } = query || {};

      // logger.debug("value in req", value);

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
      logger.debug("severity search 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new SeverityController();
