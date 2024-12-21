import Controller from "../";
import collegeService from "../../services/college/college.service";
import CollegeWrapper from "../../apiWrapper/web/college";

import Log from "../../../libs/log";

const Logger = new Log("WEB COLLEGE CONTROLLER");

class CollegeController extends Controller {
  constructor() {
    super();
  }

  getAll = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { query } = req;
      const { value } = query || {};

      // Logger.debug("value in req", value);

      const collegeDetails = await collegeService.search(value);

      if (collegeDetails.length > 0) {
        let collegeApiData = {};
        for (const college of collegeDetails) {
          const collegeWrapper = await new CollegeWrapper(college);
          collegeApiData[collegeWrapper.getCollegeId()] =
            collegeWrapper.getBasicInfo();
        }

        return raiseSuccess(
          res,
          200,
          {
            colleges: {
              ...collegeApiData,
            },
          },
          "Colleges fetched successfully"
        );
      } else {
        return raiseClientError(
          res,
          201,
          {},
          `No college found with name including ${value}`
        );
      }
    } catch (error) {
      Logger.debug("college search 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new CollegeController();
