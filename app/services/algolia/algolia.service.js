import algoliasearch from "algoliasearch";
import { createLogger } from "../../../libs/logger";
import medicineService from "../medicine/medicine.service";

import MedicineWrapper from "../../apiWrapper/mobile/medicine";

const logger = createLogger("ALGOLIA > SERVICE");
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
      logger.debug("index", index);

      const allMedicines = await medicineService.getAllMedicines();
      const objectIdPrefix = process.config.algolia.object_id_prefix;

      let updatedMedicine = [];

      for (const medicine of allMedicines) {
        const {
          details,
          id,
          name,
          creator_id,
          public_medicine = true,
        } = medicine;
        const {
          classification = "",
          icd_code = "",
          generic_name = "",
        } = details || {};

        const objectID = `${objectIdPrefix}-${id}`;

        updatedMedicine.push({
          classification,
          icd_code,
          name,
          generic_name,
          medicine_id: id,
          creator_id,
          public_medicine: public_medicine == "1" ? true : false,
          objectID,
        });
      }

      const clearResult = await index.clearObjects();

      const result = await index.saveObjects(updatedMedicine, {
        autoGenerateObjectIDIfNotExist: true,
      });

      logger.debug("Algolia result is: ", result);

      const searchAttributes = await index.setSettings({
        searchableAttributes: ["name", "generic_name", "classification"],
        attributesForFaceting: ["creator_id", "public_medicine"],
        highlightPreTag: '<em class="search-highlight">',
        highlightPostTag: "</em>",
      });

      logger.debug("Search attributes from Algolia are: ", searchAttributes);
      return result;
    } catch (error) {
      logger.error("Medicine data from Algolia has an error: ", error);
      throw error;
    }
  };

  addNewMedicineData = async (medicineId) => {
    try {
      const index = this.client.initIndex(
        process.config.algolia.medicine_index
      );
      logger.debug("index", index);

      const medicineData = await medicineService.getMedicineById(medicineId);
      const objectIdPrefix = process.config.algolia.object_id_prefix;

      if (medicineData) {
        const medicineWrapper = await MedicineWrapper(medicineData);

        let updatedMedicine = [];
        const {
          details,
          basic_info: { id, name, creator_id, public_medicine } = {},
        } = medicineWrapper.getAllInfo();
        const {
          classification = "",
          icd_code = "",
          generic_name = "",
        } = details || {};

        const objectID = `${objectIdPrefix}-${id}`;

        updatedMedicine.push({
          classification,
          icd_code,
          name,
          generic_name,
          medicine_id: id,
          creator_id,
          public_medicine,
          objectID,
        });

        const result = await index
          .saveObjects(updatedMedicine, {
            autoGenerateObjectIDIfNotExist: true,
          })
          .wait();

        logger.debug("result ----. ", result);

        return result;
      }
    } catch (error) {
      logger.error("500 addNewMedicineData error: ", error);
      throw error;
    }
  };

  updateMedicineData = async (medicineId) => {
    try {
      const index = this.client.initIndex(
        process.config.algolia.medicine_index
      );
      logger.debug("index", index);

      const medicineData = await medicineService.getMedicineById(medicineId);
      const objectIdPrefix = process.config.algolia.object_id_prefix;

      if (medicineData) {
        const medicineWrapper = await MedicineWrapper(medicineData);

        let updatedMedicine = [];
        const {
          details,
          basic_info: { id, name, creator_id, public_medicine } = {},
        } = medicineWrapper.getAllInfo();
        const {
          classification = "",
          icd_code = "",
          generic_name = "",
        } = details || {};

        const objectID = `${objectIdPrefix}-${id}`;

        updatedMedicine.push({
          classification,
          icd_code,
          name,
          generic_name,
          medicine_id: id,
          creator_id,
          public_medicine,
          objectID,
        });

        const result = await index.partialUpdateObjects(updatedMedicine).wait();

        logger.debug("result ----. ", result);

        return result;
      }
    } catch (error) {
      logger.error("500 updateMedicineData error: ", error);
      throw error;
    }
  };

  deleteMedicineData = async (medicineId) => {
    try {
      const index = this.client.initIndex(
        process.config.algolia.medicine_index
      );
      const objectIdPrefix = process.config.algolia.object_id_prefix;

      const objectID = `${objectIdPrefix}-${medicineId}`;
      const result = await index.deleteObject(objectID).wait();
      return result;
    } catch (error) {
      logger.error("500 deleteMedicineData error: ", error);
      throw error;
    }
  };
}
