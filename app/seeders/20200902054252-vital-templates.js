"use strict";

import { TABLE_NAME } from "../models/vitalTemplates";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(TABLE_NAME, [
      {
        name: "Blood Pressure",
        unit: "mm of Hg",
        details: JSON.stringify({
          template: [
            {
              id: "C1989A61-1515-4248-98B4-984774FFF531",
              element: "NumberInput",
              text: "Number Input",
              placeholder: "mm of Hg",
              required: false,
              canHaveAnswer: true,
              canHavePageBreakBefore: true,
              canHaveAlternateForm: true,
              canHaveDisplayHorizontal: true,
              canHaveOptionCorrect: true,
              canHaveOptionValue: true,
              field_name: "number_input_9580A8A2-DC82-4FD8-B210-BA383CD21E2D",
              label: "Systolic",
              dirty: false
            },
            {
              id: "C1989A61-1515-4248-98B4-984774FAF531",
              element: "NumberInput",
              text: "Number Input",
              placeholder: "mm of Hg",
              required: false,
              canHaveAnswer: true,
              canHavePageBreakBefore: true,
              canHaveAlternateForm: true,
              canHaveDisplayHorizontal: true,
              canHaveOptionCorrect: true,
              canHaveOptionValue: true,
              field_name: "number_input_9580A8A2-DC82-4FD8-B110-BA383CD21E2D",
              label: "Diastolic",
              dirty: false
            }
          ]
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "SpO2",
        unit: "",
        details: JSON.stringify({
          template: [
            {
              id: "C1989A61-1515-4248-98B4-984774FFF531",
              element: "NumberInput",
              text: "Number Input",
              placeholder: "units",
              required: false,
              canHaveAnswer: true,
              canHavePageBreakBefore: true,
              canHaveAlternateForm: true,
              canHaveDisplayHorizontal: true,
              canHaveOptionCorrect: true,
              canHaveOptionValue: true,
              field_name: "number_input_9580A8A2-DC82-4FD8-B210-BA383CD21E2D",
              label: "spO2Label",
              dirty: false
            }
          ]
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Heart rate",
        unit: "pulse/min",
        details: JSON.stringify({
          template: [
            {
              id: "C1989A61-1515-4248-98B4-984774FFF531",
              element: "NumberInput",
              text: "Number Input",
              placeholder: "pulse/min",
              required: false,
              canHaveAnswer: true,
              canHavePageBreakBefore: true,
              canHaveAlternateForm: true,
              canHaveDisplayHorizontal: true,
              canHaveOptionCorrect: true,
              canHaveOptionValue: true,
              field_name: "number_input_9580A8A2-DC82-4FD8-B210-BA383CD21E2D",
              label: "pulse per minute",
              dirty: false
            }
          ]
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Temperature",
        unit: "degree",
        details: JSON.stringify({
          template: [
            {
              id: "C1989A61-1515-4248-98B4-984774FFF531",
              element: "NumberInput",
              text: "Number Input",
              placeholder: "C",
              required: false,
              canHaveAnswer: true,
              canHavePageBreakBefore: true,
              canHaveAlternateForm: true,
              canHaveDisplayHorizontal: true,
              canHaveOptionCorrect: true,
              canHaveOptionValue: true,
              field_name: "number_input_9580A8A2-DC82-4FD8-B210-BA383CD21E2D",
              label: "Celsius",
              dirty: false
            },
            {
              id: "C1989A61-1515-4248-98B4-984774FAF531",
              element: "NumberInput",
              text: "Number Input",
              placeholder: "F",
              required: false,
              canHaveAnswer: true,
              canHavePageBreakBefore: true,
              canHaveAlternateForm: true,
              canHaveDisplayHorizontal: true,
              canHaveOptionCorrect: true,
              canHaveOptionValue: true,
              field_name: "number_input_9580A8A2-DC82-4FD8-B210-BA383CD21E2D",
              label: "Fahrenheit",
              dirty: false
            }
          ]
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Fluid Intake/Output (Urine)",
        unit: "",
        details: JSON.stringify({
          template: [
            {
              id: "C1989A61-1515-4248-98B4-984774FFF531",
              element: "NumberInput",
              text: "Number Input",
              placeholder: "of mL",
              required: false,
              canHaveAnswer: true,
              canHavePageBreakBefore: true,
              canHaveAlternateForm: true,
              canHaveDisplayHorizontal: true,
              canHaveOptionCorrect: true,
              canHaveOptionValue: true,
              field_name: "number_input_9580A8A2-DC82-4FD8-B210-BA383CD21E2D",
              label: "Celsius",
              dirty: false
            },
            {
              id: "C1989A61-1515-4248-98B4-984774FFF531",
              element: "NumberInput",
              text: "Number Input",
              placeholder: "of mL",
              required: false,
              canHaveAnswer: true,
              canHavePageBreakBefore: true,
              canHaveAlternateForm: true,
              canHaveDisplayHorizontal: true,
              canHaveOptionCorrect: true,
              canHaveOptionValue: true,
              field_name: "number_input_9580A8A2-DC82-4FD8-B210-BA383CD21E2D",
              label: "Fahrenheit",
              dirty: false
            }
          ]
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Blood Glucose",
        unit: "mg/dL",
        details: JSON.stringify({
          template: [
            {
              id: "C1989A61-1515-4248-98B4-984774FFF531",
              element: "NumberInput",
              text: "Number Input",
              placeholder: "mg/dL",
              required: false,
              canHaveAnswer: true,
              canHavePageBreakBefore: true,
              canHaveAlternateForm: true,
              canHaveDisplayHorizontal: true,
              canHaveOptionCorrect: true,
              canHaveOptionValue: true,
              field_name: "number_input_9580A8A2-DC82-4FD8-B210-BA383CD21E2D",
              label: "milligrams per decilitre ",
              dirty: false
            }
          ]
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Peak expiratory flow volume",
        unit: "ml",
        details: JSON.stringify({
          template: [
            {
              id: "C1989A61-1515-4248-98B4-984774FFF531",
              element: "NumberInput",
              text: "Number Input",
              placeholder: "ml",
              required: false,
              canHaveAnswer: true,
              canHavePageBreakBefore: true,
              canHaveAlternateForm: true,
              canHaveDisplayHorizontal: true,
              canHaveOptionCorrect: true,
              canHaveOptionValue: true,
              field_name: "number_input_9580A8A2-DC82-4FD8-B210-BA383CD21E2D",
              label: "Peak expiratory flow volume",
              dirty: false
            }
          ]
        }),
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  }
};
