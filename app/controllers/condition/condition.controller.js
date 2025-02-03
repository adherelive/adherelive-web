import Controller from "../index";

import conditionService from "../../services/condition/condition.service";
import ConditionWrapper from "../../apiWrapper/web/conditions";

import { createLogger } from "../../../libs/log";

const log = createLogger("WEB DEGREE CONTROLLER");

class ConditionController extends Controller {
  constructor() {
    super();
  }

  search = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { query } = req;
      const { value } = query || {};

      // log.debug("value in req", value);

      const conditionDetails = await conditionService.search(value);

      if (conditionDetails.length > 0) {
        let conditionApiData = {};
        for (const condition of conditionDetails) {
          const conditionWrapper = await new ConditionWrapper(condition);
          conditionApiData[conditionWrapper.getConditionId()] =
            conditionWrapper.getBasicInfo();
        }

        return raiseSuccess(
          res,
          200,
          {
            conditions: {
              ...conditionApiData,
            },
          },
          "Conditions fetched successfully"
        );
      } else {
        return raiseClientError(
          res,
          422,
          {},
          `No condition found with name including ${value}`
        );
      }
    } catch (error) {
      log.debug("condition search 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new ConditionController();
