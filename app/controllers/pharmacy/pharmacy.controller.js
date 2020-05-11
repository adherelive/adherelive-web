const cityCountryService = require("../../services/cityCountry/cityCountry.service");
const Response = require("../../helper/responseFormat");
const errMessage = require("../../../config/messages.json").errMessages;
const { validationResult } = require("express-validator/check");

class PharmacyController {
  async getPharmaciesByCountry(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let response = new Response(false, 422);
      response.setError(errors.mapped());
      return res.status(422).json(response.getResponse());
    }
    try {
      const { id } = req.params;
      let result = await cityCountryService.getPharmaciesByCountries(id);
      let response = new Response(true, 200);
      response.setData({ pharmacies: result });
      response.setMessage("List of pharmacies");
      return res.send(response.getResponse());
    } catch (err) {
      let response = new Response(false, 500);
      response.setError(errMessage.INTERNAL_SERVER_ERROR);
      return res.status(500).json(response.getResponse());
    }
  }
}

module.exports = new PharmacyController();
