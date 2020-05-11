const cityCountryService = require("../../services/cityCountry/cityCountry.service");
const Response = require("../../helper/responseFormat");
const errMessage = require("../../../config/messages.json").errMessages;
const { validationResult } = require("express-validator/check");

class CityController {
  /**
   *
   * @api {GET} /getCitiesByCountry/:id Get all Cities Filtered By CountryID
   * @apiName getCitiesByCountry
   * @apiGroup Cities
   * @apiVersion  1.0.0
   *
   *
   * @apiParam  {String} countryId CountryId
   *
   * @apiSuccess (200) {json} cities returns an array of cities
   *
   * @apiParamExample  {url} Request-Example:
   * /getCitiesByCountry/5c2bc658b7bd7a01a31410bf
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   * 	"_id" : ObjectId("5c2bc658b7bd7a01a31410bf"),
   * 	"cities" : [
   * 		"Bulawayo",
   * 		"Chinhoyi",
   * 		"Greendale",
   * 		"Gwanda",
   * 		"Harare",
   * 		"Kwekwe",
   * 		"Mufakose",
   * 		"Mutare",
   * 		"Victoria Falls"
   * 	],
   * 	"name" : "Zimbabwe",
   * 	"createdAt" : ISODate("2019-01-01T19:58:16.650Z"),
   * 	"updatedAt" : ISODate("2019-01-01T19:58:16.650Z")
   * }
   *
   *
   */
  async getCitiesByCountry(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let response = new Response(false, 422);
      response.setError(errors.mapped());
      return res.status(422).json(response.getResponse());
    }
    try {
      const { id } = req.params;
      let result = await cityCountryService.getCityByCountries(id);
      let response = new Response(true, 200);
      response.setData({ cities: result });
      response.setMessage("List of cities");
      return res.send(response.getResponse());
    } catch (err) {
      let response = new Response(false, 500);
      response.setError(errMessage.INTERNAL_SERVER_ERROR);
      return res.status(500).json(response.getResponse());
    }
  }

  // async addCity(req, res) {
  //   try {
  //     let postData = req.body;
  //     let response = await cityService.addCity(postData);
  //     res.send(response);
  //   } catch (err) {
  //
  //     res.send({ err: 500, message: "unable to add city" });
  //   }
  // }
}

module.exports = new CityController();
