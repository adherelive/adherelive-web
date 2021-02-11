import Controller from "../";
import medicineService from "../../services/medicine/medicine.service";
import AlgoliaService from "../../services/algolia/algolia.service";

import MedicineWrapper from "../../ApiWrapper/web/medicine";

import Log from "../../../libs/log";

const Logger  = new Log("WEB MEDICINE CONTROLLER");

class MedicineController extends Controller {
    constructor() {
        super();
    }

    getAll = async (req, res) => {
        const {raiseSuccess, raiseClientError, raiseServerError} = this;
        try {
            const {query} = req;
            const {value} = query || {};

            // Logger.debug("value in req", value);

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
            } else {
                return raiseClientError(res, 422, {}, `no medicine found with name including ${value}`)
            }
        } catch(error) {
            // Logger.debug("500 error", error);
            return raiseServerError(res);
        }
    };


    addMedicine = async(req, res) => {
        const {raiseServerError, raiseSuccess} = this;
        try{
            const { body: {medicine_data = {}} = {}, userDetails = {}} = req;

            const algoliaService = new AlgoliaService()

            const {
                userCategoryData: { basic_info: { id: categoryId = null } = {} } = {}
              } = userDetails || {};

            const { name = "", type ="" } = medicine_data;

            const new_medicine_data = {
                name,
                creator_id: categoryId,
                created_at: new Date(),
                type
            }
 
            const medicineDetails = await medicineService.add(new_medicine_data)
            let medicineApiDetails= {};

            if(medicineDetails) {
                const medicine_id = medicineDetails.get("id");
                const response = algoliaService.addNewMedicineData(medicine_id);
                medicineApiDetails =  await MedicineWrapper(null, medicine_id)
            }

            return raiseSuccess(res, 200, 
                {medicines: {[medicineApiDetails.getMedicineId()]: medicineApiDetails.getBasicInfo()}}, 
                "New medicine added successfully.");
            
        } catch(error) {
            Logger.debug("500 addMedicine error", error);
            return raiseServerError(res, 500, {}, error.message);
        }
    }
}

export default new MedicineController();