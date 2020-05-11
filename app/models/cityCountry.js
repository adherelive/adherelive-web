const mongoose = require("mongoose");

const cityCountrySchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
      index: true
    },
    cities: [
      {
        name: {
          type: String
        }
      }
    ],
    pharmacies: [
      {
        name: {
          type: String
        }
      }
    ]
  },
  {
    collection: "cityCountries",
    timestamps: true
  }
);

module.exports = mongoose.model("cityCountry", cityCountrySchema);
