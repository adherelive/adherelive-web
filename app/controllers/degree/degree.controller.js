import Controller from "../index";

import degreeService from "../../services/degree/degree.service";
import DegreeWrapper from "../../apiWrapper/web/degree";

import Log from "../../../libs/log";

const Logger = new Log("WEB DEGREE CONTROLLER");

class DegreeController extends Controller {
  constructor() {
    super();
  }

  getAll = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { query } = req;
      const { value } = query || {};

      // Logger.debug("value in req", value);

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
      Logger.debug("degree search 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new DegreeController();
