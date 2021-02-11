import algoliasearch from "algoliasearch";
import Logger from "../../../libs/log";
import medicineService from "../medicine/medicine.service";

import MedicineWrapper from "../../ApiWrapper/mobile/medicine"

const Log = new Logger("ALGOLIA > SERVICE");
export default class AlgoliaService {
  constructor() {
    this.client = algoliasearch(
      process.config.algolia.app_id,
      process.config.algolia.backend_key
    );
  }

  getClient = async () => {
    return this.client;
  };

  medicineData = async () => {
    try {
      const index = this.client.initIndex(
        process.config.algolia.medicine_index
      );
      Log.debug("index", index);

      const allMedicines = await medicineService.getAllMedicines();

      let updatedMedicine = [];

      for (const medicine of allMedicines) {
        const { details, id, name, creator_id } = medicine;
        const { classification = "", icd_code = "", generic_name = "" } =
          details || {};

        updatedMedicine.push({
          classification,
          icd_code,
          name,
          generic_name,
          medicine_id: id,
          creator_id,
          public_medicine: creator_id? false: true
        });
      }

      const clearResult = await index.clearObjects();

      const result = await index.saveObjects(updatedMedicine, {
        autoGenerateObjectIDIfNotExist: true
      });

      console.log("result ----. ", result);

      const searchAttributes = await index.setSettings({
        searchableAttributes: ["name", "generic_name", "classification"],
        attributesForFaceting: [
          "creator_id",
          "public_medicine"
        ]
      });

      console.log("searchAttributes ----. ", searchAttributes);
      return result;
    } catch (error) {
      Log.debug("medicine data catch error", error);
      throw error;
    }
  };

  addNewMedicineData =  async(medicineId) => {
    try {
      const index = this.client.initIndex(
        process.config.algolia.medicine_index
      );
      Log.debug("index", index);

      const medicineData = await medicineService.getMedicineById(medicineId);

      if(medicineData) {
        const medicineWrapper = await MedicineWrapper(medicineData);

        let updatedMedicine = [];
        const { details, basic_info: { id, name, creator_id} = {} } = medicineWrapper.getAllInfo();
        const { classification = "", icd_code = "", generic_name = "" } =
          details || {};

        updatedMedicine.push({
          classification,
          icd_code,
          name,
          generic_name,
          medicine_id: id,
          creator_id,
          public_medicine: creator_id? false: true
        });
  
       
        const result = await index.saveObjects(updatedMedicine, {
          autoGenerateObjectIDIfNotExist: true
        }).wait();
  
        console.log("result ----. ", result);
  
        // const searchAttributes = await index.setSettings({
        //   searchableAttributes: ["name", "generic_name", "classification"],
        //   attributesForFaceting: [
        //     "creator_id",
        //     "public_medicine"
        //   ]
        // });
  
        // console.log("searchAttributes ----. ", searchAttributes);

        return result;
      }
    } catch (error) {
      Log.debug("500 addNewMedicineData error: ", error);
      throw error;
    }
  }
}
