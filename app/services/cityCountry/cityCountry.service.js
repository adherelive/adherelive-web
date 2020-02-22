const ObjectId = require("mongodb").ObjectID;
const cityCountryModel = require("../../models/cityCountry");

class CityCountryService {
  async getCountries() {
    try {
      const response = await cityCountryModel.find({}, { name: "" });
      return response;
    } catch (err) {
      throw err;
    }
  }
  async getCityByCountries(id) {
    try {
      let results = await cityCountryModel.find(
        { _id: id },
        { cities: "", _id: 0 }
      );
      results = results[0].cities;
      let response = {};
      for (let i in results) {
        if (results[i]._id != undefined)
          response = Object.assign(response, {
            [results[i]._id]: results[i]
          });
      }
      return response;
    } catch (err) {
      throw err;
    }
  }
  async getCountryById(id) {
    try {
      let response = await cityCountryModel.find({ _id: id });
      return response[0];
    } catch (err) {
      throw err;
    }
  }

  async getCountryNameById(id) {
    try {
      let response = await cityCountryModel.find({ _id: id }).select("name");
      return response[0];
    } catch (err) {
      throw err;
    }
  }

  async getCityById(id) {
    try {
      if (id) {
        let response = await cityCountryModel.find(
          { "cities._id": ObjectId(`${id}`) },
          { "cities.$._id": "" }
        );
        return response[0].cities[0].name;
      }
      return "";
    } catch (err) {
      throw err;
    }
  }
  async getCityCountryByIds(ids = []) {
    try {
      const results = await cityCountryModel.find({
        "cities._id": {
          $in: ids
        }
      });

      //

      let response = {};
      let countriesList = {};
      let data = {};

      for (const result in results) {
        if (results[result]) {
          countriesList = Object.assign(countriesList, {
            [results[result]._id]: {
              _id: results[result]._id,
              name: results[result].name
            }
          });

          const { cities, _id: countryId } = results[result];
          data[countryId] = {};
          data[countryId].cities = {};
          for (const city in cities) {
            const { _id: cityId } = cities[city];
            if (cityId) {
              data[countryId].cities[cityId] = cities[city];
            }
          }
        }
      }
      response = Object.assign(
        response,
        { countries: countriesList },
        { cities: data }
      );
      return response;
      return results;
    } catch (err) {
      throw err;
    }
  }

  async getPharmaciesByCountries(id) {
    try {
      let results = await cityCountryModel.findOne(
        { _id: id },
        { pharmacies: "", _id: 0 }
      );
      results = results.pharmacies;
      let response = {};
      for (let i in results) {
        if (results[i]._id != undefined)
          response = Object.assign(response, {
            [results[i]._id]: results[i]
          });
      }
      return response;
    } catch (err) {
      throw err;
    }
  }

  async getPharmacyById(id) {
    try {
      let results = await cityCountryModel
        .findOne({
          "pharmacies._id": id
        })
        .lean();

      console.log("results: ", results);

      let data = {};
      let pharmacyData = {};
      if (results) {
        let { pharmacies = [] } = results || {};
        console.log("pharmacies----------->", pharmacies);
        pharmacies.forEach((pharmacy, index) => {
          pharmacyData[pharmacy._id] = pharmacy;
        });
        data[results._id] = { pharmacies: pharmacyData };
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new CityCountryService();
