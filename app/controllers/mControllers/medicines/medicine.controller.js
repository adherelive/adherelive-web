import Controller from "../../index";
import medicineService from "../../../services/medicine/medicine.service";
import AlgoliaService from "../../../services/algolia/algolia.service";

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
      
      const allMedicine = await medicineService.search(value);
      
      // Logger.debug("medicine search value", value);
      
      let medicineApiDetails = {};
      
      if (allMedicine.length > 0) {
        for (const medicine of allMedicine) {
          const medicineApiWrapper = await MedicineApiWrapper(medicine);
          medicineApiDetails[medicineApiWrapper.getMedicineId()] =
            medicineApiWrapper.getBasicInfo();
        }
      } else {
      }
      
      return raiseSuccess(
        res,
        200,
        {...medicineApiDetails},
        "medicine data fetched successfully"
      );
    } catch (error) {
      // Logger.debug("500 error", error);
      return raiseServerError(res, 500, {}, error.message);
    }
  };
  
  addMedicine = async (req, res) => {
    const {raiseServerError, raiseSuccess} = this;
    try {
      const {body = {}, userDetails = {}} = req;
      
      const algoliaService = new AlgoliaService();
      
      const {
        userCategoryData: {basic_info: {id: categoryId = null} = {}} = {},
      } = userDetails || {};
      
      const {name = "", type = ""} = body;
      
      const new_medicine_data = {
        name,
        creator_id: categoryId,
        created_at: new Date(),
        type,
        public_medicine: false,
      };
      
      const medicineDetails = await medicineService.add(new_medicine_data);
      let medicineApiDetails = {};
      
      if (medicineDetails) {
        const medicine_id = medicineDetails.get("id");
        const response = algoliaService.addNewMedicineData(medicine_id);
        medicineApiDetails = await MedicineApiWrapper(null, medicine_id);
      }
      
      return raiseSuccess(
        res,
        200,
        {
          medicines: {
            [medicineApiDetails.getMedicineId()]:
              medicineApiDetails.getBasicInfo(),
          },
          medicine_ids: [medicineApiDetails.getMedicineId()],
        },
        "New medicine added successfully."
      );
    } catch (error) {
      Logger.debug("500 addMedicine error", error);
      return raiseServerError(res, 500, {}, error.message);
    }
  };
}

export default new MobileMedicineController();
