import Controller from "../../index";
import treatmentService from "../../../services/treatment/treatment.service";

import TreatmentWrapper from "../../../apiWrapper/mobile/treatments";

import { createLogger } from "../../../../libs/log";

const log = createLogger("MOBILE TREATMENT CONTROLLER");

class TreatmentController extends Controller {
  constructor() {
    super();
  }

  getAll = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { query } = req;
      const { condition_id } = query || {};

      log.debug("condition_id in req", condition_id);

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
      log.debug("treatment search 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new TreatmentController();
