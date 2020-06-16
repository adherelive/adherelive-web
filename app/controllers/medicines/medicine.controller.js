import Controller from "../";
import medicineService from "../../services/medicine/medicine.service";
import MedicineWrapper from "../../ApiWrapper/web/medicine";

import Log from "../../../libs/log";

const Logger  = new Log("WEB MEDICINE CONTROLLER");

class MedicineController extends Controller {
    constructor() {
        super();
    }

    getAll = async (req, res) => {
        const {raiseSuccess, raiseServerError} = this;
        try {
            const {query} = req;
            const {value} = query || {};

            Logger.debug("value in req", value);

            const medicineDetails = await medicineService.search(value);

            if(medicineDetails.length > 0) {
                let medicineApiData = {};
                await medicineDetails.forEach(async medicine => {
                    const medicineWrapper = await new MedicineWrapper(medicine);
                    medicineApiData[medicineWrapper.getMedicineId()] = medicineWrapper.getBasicInfo();
                });

                return raiseSuccess(
                    res,
                    200,
                    {
                        medicines: {
                            ...medicineApiData
                        }
                    },
                    "medicine data fetched successfully"
                );
            }
        } catch(error) {
            Logger.debug("500 error", error);
            return raiseServerError(res);
        }
    };
}

export default new MedicineController();