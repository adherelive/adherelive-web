'use strict';

import {DB_TABLES} from "../../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(DB_TABLES.VITAL_TEMPLATES, [
      {
        name: "BP",
        unit:"mm of Hg",
        details: JSON.stringify({
          template: [
            {
              "id":"C1989A61-1515-4248-98B4-984774FFF531",
              "element":"NumberInput",
              "text":"Number Input",
              "placeholder":"mm of Hg",
              "required":false,
              "canHaveAnswer":true,
              "canHavePageBreakBefore":true,
              "canHaveAlternateForm":true,
              "canHaveDisplayHorizontal":true,
              "canHaveOptionCorrect":true,
              "canHaveOptionValue":true,
              "field_name":"number_input_9580A8A2-DC82-4FD8-B210-BA383CD21E2D",
              "label":"Systolic",
              "dirty":false
            },
            {
              "id":"C1989A61-1515-4248-98B4-984774FAF531",
              "element":"NumberInput",
              "text":"Number Input",
              "placeholder":"mm of Hg",
              "required":false,
              "canHaveAnswer":true,
              "canHavePageBreakBefore":true,
              "canHaveAlternateForm":true,
              "canHaveDisplayHorizontal":true,
              "canHaveOptionCorrect":true,
              "canHaveOptionValue":true,
              "field_name":"number_input_9580A8A2-DC82-4FD8-B110-BA383CD21E2D",
              "label":"Diastolic",
              "dirty":false
            },
          ]
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Oxymeter",
        unit:"",
        details: JSON.stringify({
          template: [
            {
              "id":"C1989A61-1515-4248-98B4-984774FFF531",
              "element":"NumberInput",
              "text":"Number Input",
              "placeholder":"",
              "required":false,
              "canHaveAnswer":true,
              "canHavePageBreakBefore":true,
              "canHaveAlternateForm":true,
              "canHaveDisplayHorizontal":true,
              "canHaveOptionCorrect":true,
              "canHaveOptionValue":true,
              "field_name":"number_input_9580A8A2-DC82-4FD8-B210-BA383CD21E2D",
              "label":"oxyLabel",
              "dirty":false
            }
          ]
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "SpO2",
        unit:"",
        details: JSON.stringify({
          template: [
            {
              "id":"C1989A61-1515-4248-98B4-984774FFF531",
              "element":"NumberInput",
              "text":"Number Input",
              "placeholder":"",
              "required":false,
              "canHaveAnswer":true,
              "canHavePageBreakBefore":true,
              "canHaveAlternateForm":true,
              "canHaveDisplayHorizontal":true,
              "canHaveOptionCorrect":true,
              "canHaveOptionValue":true,
              "field_name":"number_input_9580A8A2-DC82-4FD8-B210-BA383CD21E2D",
              "label":"spO2Label",
              "dirty":false
            }
          ]
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Pulse rate",
        unit:"pulse/min",
        details: JSON.stringify({
          template: [
            {
              "id":"C1989A61-1515-4248-98B4-984774FFF531",
              "element":"NumberInput",
              "text":"Number Input",
              "placeholder":"",
              "required":false,
              "canHaveAnswer":true,
              "canHavePageBreakBefore":true,
              "canHaveAlternateForm":true,
              "canHaveDisplayHorizontal":true,
              "canHaveOptionCorrect":true,
              "canHaveOptionValue":true,
              "field_name":"number_input_9580A8A2-DC82-4FD8-B210-BA383CD21E2D",
              "label":"pulse per minute",
              "dirty":false
            }
          ]
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Temperature",
        unit:"degree",
        details: JSON.stringify({
          template: [
            {
              "id":"C1989A61-1515-4248-98B4-984774FFF531",
              "element":"NumberInput",
              "text":"Number Input",
              "placeholder":"C",
              "required":false,
              "canHaveAnswer":true,
              "canHavePageBreakBefore":true,
              "canHaveAlternateForm":true,
              "canHaveDisplayHorizontal":true,
              "canHaveOptionCorrect":true,
              "canHaveOptionValue":true,
              "field_name":"number_input_9580A8A2-DC82-4FD8-B210-BA383CD21E2D",
              "label":"Celsius",
              "dirty":false
            },
            {
              "id":"C1989A61-1515-4248-98B4-984774FFF531",
              "element":"NumberInput",
              "text":"Number Input",
              "placeholder":"F",
              "required":false,
              "canHaveAnswer":true,
              "canHavePageBreakBefore":true,
              "canHaveAlternateForm":true,
              "canHaveDisplayHorizontal":true,
              "canHaveOptionCorrect":true,
              "canHaveOptionValue":true,
              "field_name":"number_input_9580A8A2-DC82-4FD8-B210-BA383CD21E2D",
              "label":"Fahrenheit",
              "dirty":false
            }
          ]
        }),
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(DB_TABLES.VITAL_TEMPLATES, null, {});
  }
};
