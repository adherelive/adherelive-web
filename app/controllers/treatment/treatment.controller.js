import Controller from "../";
import treatmentService from "../../services/treatment/treatment.service";
import treatmentConditionService from "../../services/treatmentConditionMapping/treatmentCondition.service";
import TreatmentWrapper from "../../ApiWrapper/web/treatments";

import Log from "../../../libs/log";

const Logger = new Log("WEB DEGREE CONTROLLER");

class TreatmentController extends Controller {
  constructor() {
    super();
  }

  getAll = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { query } = req;
      const { condition_id } = query || {};

      Logger.debug("condition_id in req", condition_id);

      const conditionMappingDetails = await treatmentConditionService.getAll({
        condition_id
      });

      let treatmentIds = [];

      if (conditionMappingDetails.length > 0) {
        for (const mapping of conditionMappingDetails) {
          treatmentIds.push(mapping.get("treatment_id"));
        }

        const treatmentDetails = await treatmentService.getAll({
          id: treatmentIds
        });

        let treatmentApiData = {};
        for (const treatment of treatmentDetails) {
          const treatmentWrapper = await new TreatmentWrapper(treatment);
          treatmentApiData[
            treatmentWrapper.getTreatmentId()
          ] = treatmentWrapper.getBasicInfo();
        }

        return raiseSuccess(
          res,
          200,
          {
            treatments: {
              ...treatmentApiData
            }
          },
          "Treatments fetched successfully"
        );
      } else {
        return raiseClientError(
          res,
          422,
          {},
          `No treatment found for selected condition`
        );
      }
    } catch (error) {
      Logger.debug("treatment search 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new TreatmentController();
