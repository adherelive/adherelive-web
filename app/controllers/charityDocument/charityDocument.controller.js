const charityDocumentService = require("../../services/charityDocuments");
const errMessage = require("../../../config/messages.json").errMessages;
const Log = require("../../../libs/log")("charityDocumentsController");
const minioService = require("../../services/minio/minio.service");
const Response = require("../../helper/responseFormat");
import { saveFileIntoUserBucket } from "../user/userControllerHelper";

class CharityDocumentsController {
  async getCharityDocuments(req, res) {
    try {
      const charityDocuments = await charityDocumentService.getCharityDocuments();
      let charityDocumentsObj = {};
      charityDocuments.forEach(cd => {
        charityDocumentsObj[cd._id] = cd;
      });
      let response = new Response(true, 200);
      response.setData({ charityDocuments: charityDocumentsObj });
      response.setMessage("Charity Documents fetched Successfully!!!");
      return res.status(response.getStatusCode()).send(response.getResponse());
    } catch (err) {
      let response = new Response(false, 500);
      response.setError(errMessage.INTERNAL_SERVER_ERROR);
      return res.status(500).json(response.getResponse());
    }
  }

  async uploadDoc(req, res) {
    let response;
    try {
      // console.log("req.file---------------- :", req.file);
      const files = await saveFileIntoUserBucket({
        service: minioService,
        file: req.file,
        userId: req.userDetails.userId
      });

      response = new Response(true, 200);
      response.setData({
        files: files
      });
      response.setMessage("Docs uploaded successfully!");
      return res.status(response.getStatusCode()).send(response.getResponse());
    } catch (err) {
      console.log("err-------------------- :", err);
      throw new Error("error in saving document");
    }
  }
}

module.exports = new CharityDocumentsController();
