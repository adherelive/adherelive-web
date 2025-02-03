import Controller from "../index";

import degreeService from "../../services/degree/degree.service";
import DegreeWrapper from "../../apiWrapper/web/degree";

import { createLogger } from "../../../libs/log";

const Log = createLogger("WEB DEGREE CONTROLLER");

class DegreeController extends Controller {
  constructor() {
    super();
  }

  getAll = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { query } = req;
      const { value } = query || {};

      // Log.debug("value in req", value);

      const degreeDetails = await degreeService.search(value);

      if (degreeDetails.length > 0) {
        let degreeApiData = {};
        for (const degree of degreeDetails) {
          const degreeWrapper = await new DegreeWrapper(degree);
          degreeApiData[degreeWrapper.getDegreeId()] =
            degreeWrapper.getBasicInfo();
        }

        return raiseSuccess(
          res,
          200,
          {
            degrees: {
              ...degreeApiData,
            },
          },
          "Degrees fetched successfully"
        );
      } else {
        return raiseClientError(
          res,
          422,
          {},
          `No degree found with name including ${value}`
        );
      }
    } catch (error) {
      Log.debug("degree search 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new DegreeController();
