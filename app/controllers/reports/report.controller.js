import Controller from "../index";

import { createLogger } from "../../../libs/log";
import moment from "moment";

// Services
import ReportService from "../../services/reports/report.service";
import uploadDocumentService from "../../services/uploadDocuments/uploadDocuments.service";

// Wrappers
import ReportWrapper from "../../apiWrapper/web/reports";

import { DOCUMENT_PARENT_TYPE } from "../../../constant";
import { getFilePath } from "../../helper/s3FilePath";
import * as ReportHelper from "./report.helper";

const log = createLogger("WEB > CONTROLLER > REPORTS");

class ReportController extends Controller {
  constructor() {
    super();
  }

  addReports = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const {
        body: { name, test_date, patient_id, documents = [] },
        userDetails: { userData: { category }, userCategoryId } = {},
      } = req;

      // create reports
      const reportService = new ReportService();
      const addReport = await reportService.addReport({
        name,
        patient_id,
        test_date,
        uploader_id: userCategoryId,
        uploader_type: category,
      });

      const report = await ReportWrapper({ data: addReport });

      // add documents
      for (let index = 0; index < documents.length; index++) {
        const { name, file } = documents[index] || {};
        await uploadDocumentService.addDocument({
          name,
          document: getFilePath(file),
          parent_type: DOCUMENT_PARENT_TYPE.REPORT,
          parent_id: report.getId(),
        });
        // const documentExists =
        //   (await uploadDocumentService.getDocumentByName({
        //     name,
        //     document: getFilePath(file),
        //     parent_type: DOCUMENT_PARENT_TYPE.REPORT,
        //     // parent_id: report.getId()
        //   })) || null;
        //
        // if (!documentExists) {
        // }
      }

      return raiseSuccess(
        res,
        200,
        {
          ...(await report.getReferenceInfo()),
        },
        "Report added successfully"
      );
    } catch (error) {
      log.debug("addReports 500 error", error);
      return raiseServerError(res);
    }
  };

  uploadReportDocuments = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { file = null, params: { patient_id = "NA" } = {} } = req;
      log.debug(`patient_id : ${patient_id}`);

      if (!file) {
        return raiseClientError(res, 422, {}, "Please select file to upload");
      }

      let documents = [];

      // for (let index = 0; index < files.length; index++) {
      const { originalname } = file || {};
      const fileUrl = await ReportHelper.uploadReport({
        file,
        id: patient_id,
      });
      documents.push({
        name: originalname,
        file: fileUrl,
      });
      // }

      return raiseSuccess(
        res,
        200,
        {
          documents,
        },
        "Files uploaded successfully"
      );
    } catch (error) {
      log.debug("uploadReportDocuments 500 error", error);
      return raiseServerError(res);
    }
  };

  updateReports = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        params: { id } = {},
        body: { name, test_date, documents = [] } = {},
      } = req;
      log.debug(`Report : id = ${id}`);

      if (!id) {
        return raiseClientError(
          res,
          422,
          {},
          "Please select correct report to update"
        );
      }

      const reportService = new ReportService();

      const existingReport = await ReportWrapper({ id });

      let data = {};

      if (name !== existingReport.getName()) {
        data = { ...data, name };
      }

      if (!moment(test_date).isSame(moment(existingReport.getTestDate()))) {
        data = { ...data, test_date };
      }

      // update only if name is changed
      if (Object.keys(data).length > 0) {
        await reportService.updateReport({ data, id });
      }

      // update new documents (if any)
      for (let index = 0; index < documents.length; index++) {
        const { name, file } = documents[index] || {};

        // check for exists
        const documentExists =
          (await uploadDocumentService.getDocumentByName({
            name,
            document: getFilePath(file),
            parent_id: existingReport.getId(),
            parent_type: DOCUMENT_PARENT_TYPE.REPORT,
          })) || null;

        if (!documentExists) {
          await uploadDocumentService.addDocument({
            name,
            document: getFilePath(file),
            parent_id: existingReport.getId(),
            parent_type: DOCUMENT_PARENT_TYPE.REPORT,
          });
        }
      }

      const updatedReport = await ReportWrapper({ id: existingReport.getId() });

      return raiseSuccess(
        res,
        200,
        {
          ...(await updatedReport.getReferenceInfo()),
        },
        "Report updated successfully"
      );
    } catch (error) {
      log.debug("updateReports 500 error", error);
      return raiseServerError(res);
    }
  };

  deleteReportDocument = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { params: { document_id } = {} } = req;
      log.debug(`params: document_id = ${document_id}`);

      if (!document_id) {
        return raiseClientError(
          res,
          422,
          {},
          "Please select correct document to delete"
        );
      }

      const response = await uploadDocumentService.deleteDocumentByData({
        id: document_id,
      });
      log.debug("response", response);

      return raiseSuccess(res, 200, {}, "Document deleted successfully");
    } catch (error) {
      log.debug("deleteReportDocument 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new ReportController();
