import Controller from "../../index";
import { createLogger } from "../../../../libs/log";
import specialityService from "../../../services/speciality/speciality.service";

import SpecialityWrapper from "../../../apiWrapper/mobile/speciality";

const Log = createLogger("SPECIALITY MOBILE CONTROLLER");

class SpecialityController extends Controller {
  constructor() {
    super();
  }

  searchSpeciality = async (req, res) => {
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
      Log.debug("search 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new SpecialityController();
