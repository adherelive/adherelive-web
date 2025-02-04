import Papa from "papaparse";
import fs from "fs";
import path from "path";
import moment from "moment";
import Sequelize, { QueryTypes } from "sequelize";
import { createLogger } from "../libs/logger";

// const Config = require("../config/config");
// Config();

const logger = createLogger("MEDICINE SEQUELIZE QUERY");
logger.debug("process.config.db.name --> ", process.config.db.name);

const database = new Sequelize(
  process.config.db.name,
  process.config.db.username,
  process.config.db.password,
  {
    host: process.config.db.host,
    port: process.config.db.port,
    dialect: process.config.db.dialect,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: function (str) {
      logger.debug("query", str);
    },
  }
);

database
  .authenticate()
  .then(() => {
    logger.debug("Db and tables have been created...");
  })
  .catch((err) => {
    logger.debug("Db connect error is: ", err);
  });

const addMedicine = async (data) => {
  try {
    const { name, pillbox_id } = data || {};
    const medicine = await database.query(
      "INSERT INTO `medicines` (`name`, `pillbox_id`, `type`, `created_at`, `updated_at`) VALUES (?, ?, ?, ?, ?);",
      {
        replacements: [
          `${name}`,
          `${pillbox_id}`,
          "tablet",
          moment().format(),
          moment().format(),
        ],
        type: QueryTypes.INSERT,
      }
    );

    logger.debug("addMedicine ---> ", medicine);
  } catch (error) {
    throw error;
  }
};

// UNCOMMENT BELOW FOR MEDICINE DB READ

let dataToWrite = [];

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
            const { ID, rxstring, medicine_name } = data || {};

            let dataToUpdate = {
              name: rxstring,
              pillbox_id: ID,
              created_at: new Date(),
              updated_at: new Date(),
            };

            dataToWrite.push({
              name: rxstring,
              pillbox_id: ID,
              created_at: new Date(),
              updated_at: new Date(),
            });

            /**
             * TODO: Check and enable this code
            fs.writeFile('medicineDb.txt', JSON.stringify(dataToUpdate), "utf8", (err) => {
                if(err) {
                    logger.debug("ERROR IN TESTONE ---> ", err);
                }
            });*/

            dataToUpdate = {};

            database
              .authenticate()
              .then(async () => {
                await addMedicine({
                  pillbox_id: ID ? ID : null,
                  name: rxstring ? rxstring : medicine_name,
                });
                logger.debug("Db and tables have been created...");
              })
              .catch((err) => {
                logger.debug("Db connect error is: ", err);
              });

            // await addMedicine({pillbox_id: ID, name: rxstring});
          } catch (error) {
            logger.debug("Row add error --> ", error);
          }
        },
        complete: function (results) {
          logger.debug("Finished:");
          /**
           * TODO: Check and enable this code
          fs.writeFile('medicineDb.txt', JSON.stringify({dataToWrite}), "utf8", (err) => {
              if(err) {
                  logger.debug("ERROR IN TESTONE ---> ", err);
              }
          });*/
        },
      });
    }
  }
);
