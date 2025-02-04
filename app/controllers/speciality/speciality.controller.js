import Controller from "../index";

import { createLogger } from "../../../libs/logger";
import specialityService from "../../services/speciality/speciality.service";

import SpecialityWrapper from "../../apiWrapper/mobile/speciality";

const logger = createLogger("SPECIALITY WEB CONTROLLER");

class SpecialityController extends Controller {
  constructor() {
    super();
  }

  search = async (req, res) => {
    const { raiseServerError, raiseSuccess, raiseClientError } = this;
    try {
      const { query: { value } = {} } = req || {};

      const specialities = await specialityService.search(value);

      let specialityDetails = {};

      if (specialities.length > 0) {
        for (const speciality of specialities) {
          const specialityData = await SpecialityWrapper(speciality);

          specialityDetails[specialityData.getSpecialityId()] =
            specialityData.getBasicInfo();
        }

        return raiseSuccess(
          res,
          200,
          {
            specialities: {
              ...specialityDetails,
            },
          },
          "Specialities fetched successfully"
        );
      } else {
        return raiseClientError(
          res,
          422,
          {},
          `No treatment present with name ${value}`
        );
      }
    } catch (error) {
      logger.error("search 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new SpecialityController();
