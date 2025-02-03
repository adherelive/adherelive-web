import Papa from "papaparse";
import fs from "fs";
import path from "path";
import medicineService from "../../app/services/medicine/medicine.service";

const Config = require("../../config/config");

Config();

// log.info("process.config.db.name --> ", process.config.db.name);

fs.readFile(
  path.join(__dirname, "Pillbox.csv"),
  { encoding: "utf-8" },
  (err, file) => {
    if (!err) {
      Papa.parse(file, {
        header: true,
        step: async (row) => {
          /*
           * Keys from csv file:
           * ID        :   Pillbox ID for medicine (pillbox_id)
           * rxstring  :   Full name of medicine (name)
           * */
          try {
            const { data } = row || {};
            const { ID, rxstring } = data || {};

            const medicineDetails = await medicineService.add({
              pillbox_id: ID,
              name: rxstring,
            });
            if (medicineDetails) {
              log.info("Row done -> ", medicineDetails);
            }
          } catch (error) {
            log.info("Row add error --> ", error);
          }
        },
        complete: function (results) {
          log.info("Finished:");
        },
      });
    }
  }
);
