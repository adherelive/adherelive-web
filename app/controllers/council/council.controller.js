import Controller from "../index";

import councilService from "../../services/council/council.service";
import CouncilWrapper from "../../apiWrapper/web/council";

import { createLogger } from "../../../libs/logger";

const logger = createLogger("WEB DEGREE CONTROLLER");

class CouncilController extends Controller {
  constructor() {
    super();
  }

  getAll = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { query } = req;
      const { value } = query || {};

      // logger.debug("value in req", value);

      const councilDetails = await councilService.search(value);

      if (councilDetails.length > 0) {
        let councilApiData = {};
        for (const council of councilDetails) {
          const councilWrapper = await new CouncilWrapper(council);
          councilApiData[councilWrapper.getCouncilId()] =
            councilWrapper.getBasicInfo();
        }

        return raiseSuccess(
          res,
          200,
          {
            registration_councils: {
              ...councilApiData,
            },
          },
          "Councils fetched successfully"
        );
      } else {
        return raiseClientError(
          res,
          422,
          {},
          `No council found with name including ${value}`
        );
      }
    } catch (error) {
      logger.debug("council search 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new CouncilController();
