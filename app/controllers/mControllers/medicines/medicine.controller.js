import Controller from "../../index";
import medicineService from "../../../services/medicine/medicine.service";
import MedicineApiWrapper from "../../../ApiWrapper/mobile/medicine";
import Log from "../../../../libs/log";

const FILE_NAME = "MOBILE MEDICINE CONTROLLER";

const Logger = new Log(FILE_NAME);

class MobileMedicineController extends Controller {
    constructor() {
      super();
    }

    searchMedicine = async (req, res) => {
        const {raiseServerError, raiseSuccess} = this;
        try {
            const {query: {value = ""} = {}} = req;

            const medicine = await medicineService.search(value);

            Logger.debug("medicine value from db", medicine);

            let medicineApiDetails = {};

            if(medicine) {
                const medicineApiWrapper = await MedicineApiWrapper(medicine);
                medicineApiDetails = medicineApiWrapper.getBasicInfoBulk();
            } else {
                
            }

            return raiseSuccess(res, 200, {...medicineApiDetails}, "medicine data fetched successfully");
        } catch(error) {
            Logger.debug("500 error", error);
            return raiseServerError(res, 500, {}, error.message);
        }
    };
}

export default new MobileMedicineController();