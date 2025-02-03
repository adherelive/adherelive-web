import Controller from "../index";

import AlgoliaService from "../../services/algolia/algolia.service";
import { createLogger } from "../../../libs/log";

const log = createLogger("ALGOLIA > CONTROLLER");

class AlgoliaController extends Controller {
  constructor() {
    super();
  }

  updateMedicine = async (req, res) => {
    try {
      log.debug("starting medicine upload");
      const algoliaService = new AlgoliaService();
      log.debug("client", await algoliaService.getClient());
      const result = await algoliaService.medicineData();
      log.debug("result", result);
      if (result) {
        return this.raiseSuccess(res, 200, {}, "medicine data added");
      } else {
        return this.raiseClientError(res, 422, {}, "something wrong in data");
      }
    } catch (error) {
      log.debug("updateMedicine catch error", error);
      return this.raiseServerError(res);
    }
  };
}

export default new AlgoliaController();
