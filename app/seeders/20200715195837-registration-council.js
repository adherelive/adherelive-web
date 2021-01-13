'use strict';

import {TABLE_NAME} from "../models/registrationCouncil";

const SUBHARTI_REGISTRATION_COUNCIL = [
  {
    name: 'Andhra Pradesh Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Arunachal Pradesh Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Assam Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Bhopal Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Bihar Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Bombay Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Chandigarh Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Chattisgarh Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Delhi Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Goa Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Gujarat Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Haryana Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Himanchal Pradesh Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Hyderabad Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Jammu & Kashmir Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Jharkhand Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Karnataka Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Madhya Pradesh Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Madras Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Mahakoshal Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Maharashtra Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Manipur Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Medical Council of India',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Medical Council of Tanganyika',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Mizoram Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Mysore Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Nagaland Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Orissa Council of Medical Registration',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Pondicherry Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Punjab Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Rajasthan Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Sikkim Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Tamil Nadu Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Telangana State Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Travancore Cochin Medical Council, Trivandrum',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Tripura State Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Uttar Pradesh Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Uttarakhand Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Vidharba Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'West Bengal Medical Council',
    created_at: new Date(),
    updated_at: new Date()
  }
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(TABLE_NAME,
        [
      {
        name: "I.C.M.R.",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "F.D.A.",
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]

    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  }
};
