import Controller from "../index";
import Logger from "../../../libs/log";
// services
const { createReport } = require("./genrateTable");
import FlashCardService from "../../services/flashCard/flashCard.service";
import ReportService from "../../services/reports/report.service";
import TxActivity from "../../services/transactionActivity/transactionActivity.service";
import { getFilePath } from "../../helper/filePath";
import { DOCUMENT_PARENT_TYPE } from "../../../constant";
import uploadDocumentService from "../../services/uploadDocuments/uploadDocuments.service";
import * as ReportHelper from "../reports/reportHelper"; // wrappers
import ReportWrapper from "../../ApiWrapper/web/reports";
import { USER_CATEGORY } from "../../../constant";
const fs = require("fs");
const Log = new Logger("WEB > CONTROLLER > Service Offering");

class FlashCardController extends Controller {
  constructor() {
    super();
  }
  create = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    Log.debug("flash card controller - create - called");

    const {
      userDetails: { userId, userData: { category } = {}, userCategoryId } = {},
      permissions = [],
    } = req;
    let doctor_id,
      provider_type,
      provider_id = null;
    let data = null;

    if (category === USER_CATEGORY.DOCTOR) {
      doctor_id = req.userDetails.userCategoryData.basic_info.id;
      provider_type = USER_CATEGORY.DOCTOR;
    }

    if (req.userDetails.userRoleData.basic_info.linked_with === "provider") {
      provider_id = req.userDetails.userRoleData.basic_info.linked_id;
      doctor_id = req.userDetails.userCategoryData.basic_info.id;
      provider_type = req.userDetails.userRoleData.basic_info.linked_with;
    }

    Log.debug("flash card controller - create - called");
    try {
      let data = { ...req.body, doctor_id, provider_type, provider_id };
      Log.debug("flash card controller data", data);
      const flashCardService = new FlashCardService();
      let flashCard = await flashCardService.addFlashCard(data);
      let { tx_activity_id, activity_status, is_published } = data;

      if (is_published) {
        activity_status = "completed";
      } else {
        activity_status = "inprogress";
      }

      let txActivity = new TxActivity();
      txActivity.updateTxActivities({ activity_status }, tx_activity_id);

      // need to add records.
      let reportBody = {
        uploader_id: userCategoryId,
        uploader_type: category,
        name: "flashcard record",
        test_date: new Date(),
        patient_id: data.patient_id,
        flas_card_id: flashCard.id,
      };

      if (req.body.data.flashCardData.length > 0) {
        await createReport(req.body.data.flashCardData, "myfashcord.pdf");
        let file = fs.readFileSync("myfashcord.pdf");
        const { originalname } = file || {};
        console.log({ file });
        let fileUrl = "";
        try {
          fileUrl = await ReportHelper.uploadToS3({
            filepath: "myfashcord.pdf",
            id: data.patient_id,
          });
        } catch (ex) {
          fileUrl = "https://www.africau.edu/images/default/sample.pdf";
        }

        const reportService = new ReportService();
        const addReport = await reportService.addReport(reportBody);
        const report = await ReportWrapper({ data: addReport });
        console.log(report.getId());
        console.log({
          name: "myfashcord.pdf",
          document: fileUrl,
          parent_type: DOCUMENT_PARENT_TYPE.REPORT,
          parent_id: report.getId(),
        });
        await uploadDocumentService.addDocument({
          name: "myfashcord.pdf",
          document: fileUrl,
          parent_type: DOCUMENT_PARENT_TYPE.REPORT,
          parent_id: report.getId(),
        });
      }

      return raiseSuccess(
        res,
        200,
        { flashCard },
        "FlashCard added successfully"
      );
    } catch (error) {
      Log.debug("addService 500 error", error);
      return raiseServerError(res);
    }
  };

  getFlashCardDetailsByPatientId = async (req, res) => {
    let { params: { patient_id } = {}, body } = req;
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      if (!patient_id)
        return raiseClientError(
          res,
          422,
          {},
          "Please select correct ServiceOffer to update"
        );

      let data = { patient_id };
      const flashCardService = new FlashCardService();
      let flashCard = await flashCardService.getAllFlashCardByData(data);
      return raiseSuccess(res, 200, { flashCard }, "success");
    } catch (error) {
      Log.debug("updateService 500 error", error);
      return raiseServerError(res);
    }
  };

  getFlashCardDetailsByActivityId = async (req, res) => {
    let { params: { tx_activity_id } = {}, body } = req;
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      if (!tx_activity_id)
        return raiseClientError(
          res,
          422,
          {},
          "Please select correct txId to update"
        );

      let data = { tx_activity_id };
      const flashCardService = new FlashCardService();
      let flashCard = await flashCardService.getAllFlashCardByData(data);
      return raiseSuccess(res, 200, { flashCard }, "success");
    } catch (error) {
      Log.debug("updateService 500 error", error);
      return raiseServerError(res);
    }
  };

  update = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      let { params: { id } = {}, body } = req;
      Log.info(`Report : id = ${id}`);
      if (!id) {
        return raiseClientError(
          res,
          422,
          {},
          "Please select correct FlashCard to update"
        );
      }
      const flashCardService = new FlashCardService();
      let flashCard = await flashCardService.updateFlashCardByData(body, id);
      let { tx_activity_id, activity_status, is_published } = body;
      if (is_published) {
        activity_status = "completed";
      } else {
        activity_status = "inprogress";
      }
      let txActivity = new TxActivity();
      txActivity.updateTxActivities({ activity_status }, tx_activity_id);

      return raiseSuccess(
        res,
        200,
        {
          ...flashCard,
        },
        "FlashCard updated successfully"
      );
    } catch (error) {
      Log.debug("updateFlashCard 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new FlashCardController();
