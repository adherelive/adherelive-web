import Controller from "../index";

import AlgoliaService from "../../services/algolia/algolia.service";
import { createLogger } from "../../../libs/log";

const Log = createLogger("ALGOLIA > CONTROLLER");

class AlgoliaController extends Controller {
  constructor() {
    super();
  }

  updateMedicine = async (req, res) => {
    try {
      Log.info("starting medicine upload");
      const algoliaService = new AlgoliaService();
      Log.debug("client", await algoliaService.getClient());
      const result = await algoliaService.medicineData();
      Log.debug("result", result);
      if (result) {
        return this.raiseSuccess(res, 200, {}, "medicine data added");
      } else {
        return this.raiseClientError(res, 422, {}, "something wrong in data");
      }
    } catch (error) {
      Log.debug("updateMedicine catch error", error);
      return this.raiseServerError(res);
    }
  };
}

export default new AlgoliaController();
