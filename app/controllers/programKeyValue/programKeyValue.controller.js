const Log = require("../../../libs/log")("programKeyValueController");
const { validationResult } = require("express-validator/check");
const errMessage = require("../../../config/messages.json").errMessages;
const Response = require("../../helper/responseFormat");
const programKeyValueService = require("../../services/programKeyValue/programKeyValue.service");
const benefitPlanDocumentsService = require("../../services/benefitPlanDocuments/benefitPlanDocument.service");

class ProgramKeyValueController {
  async getProgramValues(req, res) {
    const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   let response = new Response(false, 422);
    //   response.setError(
    //     Object.assign(errors.mapped(), {
    //       message: "Invalid value"
    //     })
    //   );
    //   return res.status(422).json(response.getResponse());
    // }
    try {
      let { programId } = req.params;
      const programValues = await programKeyValueService.getProgramValues(
        programId
      );
      console.log("programValues=================== :", programValues);
      let response = new Response(true, 200);
      let { values } = programValues;
      response.setData({ programKeyValues: values });
      response.setMessage("Successfully fetched Program Key Values");
      return res.send(response.getResponse());
    } catch (error) {
      let response = new Response(false, 500);
      response.setError(errMessage.INTERNAL_SERVER_ERROR);
      return res.status(500).json(response.getResponse());
    }
  }

  async getProgramBenefitDocuments(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let response = new Response(false, 422);
      response.setError(
        Object.assign(errors.mapped(), {
          message: "Invalid value"
        })
      );
      return res.status(422).json(response.getResponse());
    }
    try {
      let { programId } = req.params;
      const programValues = await programKeyValueService.getProgramValues(
        programId
      );
      let response = new Response(true, 200);
      let { values: { benefitDocuments = [] } = {} } = programValues;
      let documents = [];
      if (benefitDocuments.length > 0) {
        documents = await benefitPlanDocumentsService.getBenefitPlan(
          benefitDocuments
        );
      }
      let benefitPlanDocuments = {};
      documents.forEach(doc => {
        const { _id } = doc;
        benefitPlanDocuments[_id] = doc;
      });
      console.log("documents=================== :", documents);
      response.setData({ benefitPlanDocuments: benefitPlanDocuments });
      response.setMessage("Successfully fetched Program Key benefit");
      return res.send(response.getResponse());
    } catch (error) {
      let response = new Response(false, 500);
      response.setError(errMessage.INTERNAL_SERVER_ERROR);
      return res.status(500).json(response.getResponse());
    }
  }
}

module.exports = new ProgramKeyValueController();
