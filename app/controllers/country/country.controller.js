// const countryService = require("../services/country.services");
const cityCountryService = require("../../services/cityCountry/cityCountry.service");
const Response = require("../../helper/responseFormat");
const errMessage = require("../../../config/messages.json").errMessages;

class CountryController {
  /**
   *
   * @api {GET} /getCountries Get country list
   * @apiName getCountries
   * @apiGroup Countries
   * @apiVersion  1.0.0
   *
   *
   * @apiSuccess (200) {json} countries Countries data mapped with their Ids
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *     "status": true,
   *     "statusCode": 200,
   *     "payload": {
   *         "data": {
   *             "country": {
   *                 "5c2bc658b7bd7a01a3141028": {
   *                     "_id": "5c2bc658b7bd7a01a3141028",
   *                     "name": "Afghanistan"
   *                 },
   *                 "5c2bc658b7bd7a01a3141029": {
   *                     "_id": "5c2bc658b7bd7a01a3141029",
   *                     "name": "Albania"
   *                 },
   *                 "5c2bc658b7bd7a01a314102a": {
   *                     "_id": "5c2bc658b7bd7a01a314102a",
   *                     "name": "Algeria"
   *                 },
   *                 ...
   *                 ...
   *                 ...
   *                 "5c2bc658b7bd7a01a31410be": {
   *                     "_id": "5c2bc658b7bd7a01a31410be",
   *                     "name": "Zambia"
   *                 },
   *                 "5c2bc658b7bd7a01a31410bf": {
   *                     "_id": "5c2bc658b7bd7a01a31410bf",
   *                     "name": "Zimbabwe"
   *                 }
   *             }
   *         },
   *         "message": "List of countries"
   *     }
   * }
   *
   * @apiErrorExample {json} Error-Response:
   * {
   *    "status": false,
   *    "statusCode": 500,
   *    "payload": {
   *        "error": {
   *           "status": "INTERNAL_SERVER_ERROR",
   *           "message": "Something went wrong. Please try again."
   *        }
   *    }
   * }
   *
   */
  async getCountries(req, res) {
    try {
      let result = await cityCountryService.getCountries();

      let countriesData = {};

      result.map(c => {
        countriesData = Object.assign(countriesData, {
          [c._id]: { _id: c._id, name: c.name }
        });
      });
      let response = new Response(true, 200);
      response.setData({ country: countriesData });
      response.setMessage("List of countries");
      return res.send(response.getResponse());
    } catch (err) {
      let response = new Response(false, 500);
      response.setError(errMessage.INTERNAL_SERVER_ERROR);
      return res.status(500).json(response.getResponse());
    }
  }

  // async getCountryByCity(req, res) {
  //   try {
  //     let cityId = req.params.cityId;
  //     let response = await countryService.getCountryByCity(cityId);
  //     res.send(response);
  //   } catch (err) {
  //
  //     res.send({ err: 500, message: "unable to fetch countries by city" });
  //   }
  // }

  // async addCountry(req, res) {
  //   try {
  //     let response = await countryService.addCountry(req);
  //
  //     res.send(response);
  //   } catch (err) {
  //
  //     res.send({ err: 500, message: "unable to add country" });
  //   }
  // }
}

module.exports = new CountryController();
