'use strict';

import {VITAL_TEMPLATES} from "../models/vitalTemplates";

module.exports = {
  up: (queryInterface, Sequelize) => {

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(VITAL_TEMPLATES, null, {});
  }
};
