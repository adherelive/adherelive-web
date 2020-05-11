const pharmaCompaniesService = require("../../services/pharmaCompanies/pharmaCompanies.service");
const errMessage = require("../../../config/messages.json").errMessages;
const constants = require("../../../config/constants");
const Response = require("../../helper/responseFormat");

class PharmaCompaniesController {
  constructor() {}

  async getAllPharmaCompanies(req, res) {
    try {
      let data = {};
      const pharmaCompanies = await pharmaCompaniesService.getAllPharmaCompanies();

      if (!pharmaCompanies) {
        throw new Error(constants.NO_PHARMA_COMPANIES_FOUND);
      } else {
        for (const key in pharmaCompanies) {
          const pharmaCompany = pharmaCompanies[key];
          data = Object.assign(data, {
            [pharmaCompany._id]: pharmaCompany
          });
        }

        let response = new Response(true, 200);
        response.setData({ pharmaCompanies: data });
        response.setMessage("fetched pharma companies successfully!!");
        return res.send(response.getResponse());
      }
    } catch (err) {
      let response = new Response(false, 500);
      response.setError(errMessage.INTERNAL_SERVER_ERROR);
      return res.status(500).json(response.getResponse());
    }
  }
}

module.exports = new PharmaCompaniesController();
