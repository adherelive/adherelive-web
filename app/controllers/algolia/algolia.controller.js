import Controller from "../index";

import AlgoliaService from "../../services/algolia/algolia.service";
import { createLogger } from "../../../libs/logger";

const logger = createLogger("ALGOLIA > CONTROLLER");

class AlgoliaController extends Controller {
  constructor() {
    super();
  }

  updateMedicine = async (req, res) => {
    try {
      logger.debug("starting medicine upload");
      const algoliaService = new AlgoliaService();
      logger.debug("client", await algoliaService.getClient());
      const result = await algoliaService.medicineData();
      logger.debug("result", result);
      if (result) {
        return this.raiseSuccess(res, 200, {}, "medicine data added");
      } else {
        return this.raiseClientError(res, 422, {}, "something wrong in data");
      }
    } catch (error) {
      logger.debug("updateMedicine catch error", error);
      return this.raiseServerError(res);
    }
  };
}

export default new AlgoliaController();
