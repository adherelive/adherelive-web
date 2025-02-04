import Controller from "../index";

import treatmentService from "../../services/treatment/treatment.service";
import TreatmentWrapper from "../../apiWrapper/web/treatments";

import { createLogger } from "../../../libs/logger";

const logger = createLogger("WEB DEGREE CONTROLLER");

class TreatmentController extends Controller {
  constructor() {
    super();
  }

  getAll = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { query } = req;
      const { condition_id } = query || {};

      logger.debug("condition_id in req", condition_id);

      const treatmentDetails = await treatmentService.getAll();

      let treatmentApiData = {};
      for (const treatment of treatmentDetails) {
        const treatmentWrapper = await new TreatmentWrapper(treatment);
        treatmentApiData[treatmentWrapper.getTreatmentId()] =
          treatmentWrapper.getBasicInfo();
      }

      return raiseSuccess(
        res,
        200,
        {
          treatments: {
            ...treatmentApiData,
          },
        },
        "Treatments fetched successfully"
      );
    } catch (error) {
      logger.debug("treatment search 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new TreatmentController();
