"use strict";

import {TABLE_NAME} from "../models/medicines";
import {getMedicineData} from "../services/algolia/medicineDataHelper";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const medicine_data_list = await getMedicineData();
        return queryInterface.bulkInsert(TABLE_NAME, [...medicine_data_list]);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete(TABLE_NAME, null, {});
    }
};
