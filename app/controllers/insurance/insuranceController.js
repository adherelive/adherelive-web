const insuranceService = require("../../services/insurance/insurance.service");
const errMessage = require("../../../config/messages.json").errMessages;
const constants = require("../../../config/constants");
const Response = require("../../helper/responseFormat");

class InsuranceController {
  constructor() {}

  async getAllInsuranceProviders(req, res) {
    try {
      let data = {};
      const insuranceProviders = await insuranceService.getAllInsuranceProviders();

      if (!insuranceProviders) {
        throw new Error(constants.NO_INSURANCE_PROVIDERS_FOUND);
      } else {
        for (const key in insuranceProviders) {
          const insuranceProvider = insuranceProviders[key];
          data = Object.assign(data, {
            [insuranceProvider._id]: insuranceProvider
          });
        }

        let response = new Response(true, 200);
        response.setData({ insuranceProviders: data });
        response.setMessage("Signed out successfully!");
        return res.send(response.getResponse());
      }
    } catch (err) {
      let response = new Response(false, 500);
      response.setError(errMessage.INTERNAL_SERVER_ERROR);
      return res.status(500).json(response.getResponse());
    }
  }

  async addInsuranceProvider(req, res) {
    try {
      if (req.insuranceDetails.exists) {
        const { name, isActive } = req.body;
        let insuranceProvider = await insuranceService.addInsuranceProvider({
          name,
          isActive
        });
        let response = new response(true, 200);
        response.setData({});
        response.setMessage("Insurnace Provider created.");
        return res.send(response.getResponse());
      }
    } catch (err) {
      let response = new Response(false, 500);
      response.setError(errMessage.INTERNAL_SERVER_ERROR);
      return res.status(500).json(response.getResponse());
    }
  }
}

module.exports = new InsuranceController();
