import fs from "fs";

export const getMedicineData = async () => {
  return new Promise((res, rej) => {
    fs.readFile(__dirname + "/data/medicine.json", async (error, data) => {
      if (error) {
        console.error("error in reading medicine data", error);
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
          international_name
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
            updated_at: new Date()
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
            updated_at: new Date()
          });
        }

        if (!updatedIndiaName.length && !internationalNameList.length) {
          const details = { ...medicine[i], india_name: [...updatedIndiaName] };
          updatedMedicine.push({
            name: generic_name,
            type: "tablet",
            description: "",
            details: JSON.stringify(details),
            created_at: new Date(),
            updated_at: new Date()
          });
        }
      }

      res(updatedMedicine);
    });
  });
};
