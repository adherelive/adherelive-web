import fs from "fs/promises";  // Use the promises API
import { createLogger } from "../../../libs/logger";

const logger = createLogger("WEB > MEDICINE > HELPER");

var Config = require("../../../config/config");
Config();

export const getMedicineData = async () => {
  try {
    let filePath = process.config.app.medicine_data === "SUBHARTI" 
      ? __dirname + "/data/subharti_medicine.json" 
      : __dirname + "/data/medicine.json";

    console.log("Reading file from:", filePath);

    // Read the file using promises
    const data = await fs.readFile(filePath, "utf-8");
    const medicine = JSON.parse(data);

    let updatedMedicine = [];

    for (let i = 0; i < medicine.length; i++) {
      console.log("process running " + i);
      const { medicine_short_name = "", category = "" } = medicine[i] || {};

      const details = { ...medicine[i] };
      updatedMedicine.push({
        name: medicine_short_name,
        type: category.toLowerCase(),
        description: "",
        details: JSON.stringify(details),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    return updatedMedicine;  // Return the processed data
  } catch (error) {
    logger.error("Error in getMedicineData:", error);
    throw error;
  }
};
