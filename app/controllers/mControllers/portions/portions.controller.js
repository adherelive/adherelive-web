import Controller from "../../index";
import PortionService from "../../../services/portions/portions.service";
import PortionWrapper from "../../../apiWrapper/mobile/portions";

import { createLogger } from "../../../../libs/logger";

const logger = createLogger("MOBILE PORTIONS CONTROLLER");

class PortionController extends Controller {
  constructor() {
    super();
  }

  getAll = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const portionService = new PortionService();

      const portionDetails = await portionService.getAll();

      if (portionDetails.length > 0) {
        let portionApiData = {};
        for (const portion of portionDetails) {
          const portionWrapper = await PortionWrapper({ data: portion });
          portionApiData[portionWrapper.getId()] =
            portionWrapper.getBasicInfo();
        }

        return raiseSuccess(
          res,
          200,
          {
            portions: {
              ...portionApiData,
            },
          },
          "Portions fetched successfully"
        );
      } else {
        return raiseClientError(
          res,
          422,
          {},
          `No portion found with name including ${value}`
        );
      }
    } catch (error) {
      logger.debug("portion search 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new PortionController();
