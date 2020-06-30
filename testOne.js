import Papa from "papaparse";
import fs from "fs";
import path from "path";
import moment from "moment";
import Sequelize, {QueryTypes} from "sequelize";
const Config = require("./config/config");
Config();

import Log from "./libs/log";

const Logger = new Log("MEDICINE SEQUELIZE QUERY");
console.log("process.config.db.name --> ", process.config.db.name);

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
      idle: 10000
    },
    logging: function(str) {
      Logger.debug("query", str);
    }
  }
);

database
  .authenticate()
  .then(() => {
    console.log("Db and tables have been created...");
  })
  .catch(err => {
    console.log("Db connect error is: ", err);
  });

const addMedicine = async (data) => {
    try {
        const {name, pillbox_id} = data || {};
        const medicine = await database.query("INSERT INTO `medicines` (`name`, `pillbox_id`, `created_at`, `updated_at`) VALUES (?, ?, ?, ?);", {
            replacements: [`${name}`, `${pillbox_id}`, moment().format(), moment().format()],
            type: QueryTypes.INSERT
        });

        Logger.debug("addMedicine ---> ", medicine);
    } catch(error) {
        throw error;
    }
}


fs.readFile(path.join(__dirname, 'Pillbox.csv'), {encoding: 'utf-8'},  (err, file) => {
    if(!err) {
        Papa.parse(file, {
            header: true,
            step: async (row) => {
                /*
                * Keys from csv file:
                * ID        :   Pillbox ID for medicine (pillbox_id)
                * rxstring  :   Full name of medicine (name)
                * */
                try {
                    const {data} = row || {};
                    const {ID, rxstring, medicine_name} = data || {};

                    database
                        .authenticate()
                        .then(async () => {
                            await addMedicine({pillbox_id: ID ? ID : null, name: rxstring ? rxstring : medicine_name});
                            console.log("Db and tables have been created...");
                        })
                        .catch(err => {
                            console.log("Db connect error is: ", err);
                        });

                    // await addMedicine({pillbox_id: ID, name: rxstring});
                } catch(error) {
                    console.log("Row add error --> ", error);
                }
            },
            complete: function(results) {
                console.log("Finished:");
            }
        });
    }
});
