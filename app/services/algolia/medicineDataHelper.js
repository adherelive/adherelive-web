import fs from "fs";

import { createLogger } from "../../../libs/log";
const logger = createLogger("WEB > MEDICINE > HELPER");

// var Config = require("../../../config/config");
// Config();

/**
 *
 *
 * @returns {Promise<unknown>}
 */
export const getMedicineData = async () => {
  return new Promise((res, rej) => {
    if (process.config.app.medicine_data === "SUBHARTI") {
      fs.readFile(
        __dirname + "/data/subharti_medicine.json",
        async (error, data) => {
          if (error) {
            logger.error("Error in reading medicine data: ", error);
            rej(error);
          }
          let updatedMedicine = [];

          const medicine = JSON.parse(data.toString());

          for (let i = 0; i < medicine.length; i++) {
            const { medicine_short_name = "", category = "" } =
              medicine[i] || {};

            // for (const indiaName of updatedIndiaName) {
            const details = { ...medicine[i] };
            updatedMedicine.push({
              name: medicine_short_name,
              type: category.toLowerCase(),
              description: "",
              details: JSON.stringify(details),
              created_at: new Date(),
              updated_at: new Date(),
            });
            // }

            /**
             * TODO: Check why this has been commented
            if (!updatedIndiaName.length && !internationalNameList.length) {
              const details = {...medicine[i], india_name: [...updatedIndiaName]};
              updatedMedicine.push({
                name: generic_name,
                type: "tablet",
                description: "",
                details: JSON.stringify(details),
                created_at: new Date(),
                updated_at: new Date()
              });
            }*/
          }

          res(updatedMedicine);
        }
      );
    } else {
      fs.readFile(__dirname + "/data/medicine.json", async (error, data) => {
        if (error) {
          logger.error("error in reading medicine data", error);
          rej(error);
        }
        let updatedMedicine = [];

        const medicine = JSON.parse(data.toString());

        for (let i = 0; i < medicine.length; i++) {
          const {
            generic_name,
            icd_code,
            classification,
            india_name,
            international_name,
          } = medicine[i] || {};
          let updatedIndiaName = [...india_name];
          const internationalNameList =
            international_name && international_name.length
              ? international_name.split(",")
              : [];
          if (updatedIndiaName.includes("More...")) {
            const moreElement = updatedIndiaName.indexOf("More...");
            updatedIndiaName.splice(moreElement, 1);
          }

          for (const indiaName of updatedIndiaName) {
            const details = { ...medicine[i], india_name: updatedIndiaName };
            updatedMedicine.push({
              name: indiaName,
              type: "tablet",
              description: "",
              details: JSON.stringify(details),
              created_at: new Date(),
              updated_at: new Date(),
            });
          }

          for (const internationalName of internationalNameList) {
            const details = { ...medicine[i], india_name: updatedIndiaName };
            updatedMedicine.push({
              name: internationalName.trim(),
              type: "tablet",
              description: "",
              details: JSON.stringify(details),
              created_at: new Date(),
              updated_at: new Date(),
            });
          }

          if (!updatedIndiaName.length && !internationalNameList.length) {
            const details = {
              ...medicine[i],
              india_name: [...updatedIndiaName],
            };
            updatedMedicine.push({
              name: generic_name,
              type: "tablet",
              description: "",
              details: JSON.stringify(details),
              created_at: new Date(),
              updated_at: new Date(),
            });
          }
        }

        res(updatedMedicine);
      });
    }
  });
};
