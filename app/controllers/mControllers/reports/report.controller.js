import Controller from "../../index";
import { createLogger } from "../../../../libs/log";

// services
import ReportService from "../../../services/reports/report.service";
import uploadDocumentService from "../../../services/uploadDocuments/uploadDocuments.service";

// wrappers
import ReportWrapper from "../../../apiWrapper/mobile/reports";
import DoctorWrapper from "../../../apiWrapper/mobile/doctor";

import { DOCUMENT_PARENT_TYPE, USER_CATEGORY } from "../../../../constant";
import { getFilePath } from "../../../helper/s3FilePath";
import * as ReportHelper from "../../reports/report.helper";

const logger = createLogger("MOBILE > CONTROLLER > REPORTS");

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
      logger.debug("addReports 500 error", error);
      return raiseServerError(res);
    }
  };

  uploadReportDocuments = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { file = null, params: { patient_id = "NA" } = {} } = req;
      logger.debug(`patient_id : ${patient_id}`);
      logger.debug("files", file);

      if (!file) {
        return raiseClientError(res, 422, {}, "Please select files to upload");
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
      logger.debug("uploadReportDocuments 500 error", error);
      return raiseServerError(res);
    }
  };

  latestReport = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        query: { patient_id } = {},
        userDetails: { userData: { category } = {}, userCategoryId } = {},
      } = req;
      logger.debug(`query: patient_id : ${patient_id}`);

      if (!patient_id) {
        return raiseClientError(res, 422, {}, "Please select correct patient");
      }

      const reportService = new ReportService();
      const { count, rows: allReports = [] } =
        (await reportService.latestReportAndCount({
          patient_id,
        })) || {};

      if (allReports.length > 0) {
        const report = await ReportWrapper({ data: allReports[0] });
        let doctors = {};

        if (
          (category === USER_CATEGORY.DOCTOR ||
            category === USER_CATEGORY.HSP) &&
          userCategoryId === report.getUploaderId()
        ) {
          const doctor = await DoctorWrapper(null, report.getUploaderId());
          doctors[doctor.getDoctorId()] = await doctor.getAllInfo();
        }

        return raiseSuccess(
          res,
          200,
          {
            report_count: count,
            ...(await report.getReferenceInfo()),
            doctors: {
              ...doctors,
            },
          },
          "Latest report fetched successfully"
        );
      } else {
        return raiseSuccess(res, 201, {}, "No reports added yet");
      }
    } catch (error) {
      logger.debug("latestReport 500 error", error);
      return raiseServerError(res);
    }
  };

  deleteReportDocument = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { params: { document_id } = {} } = req;
      logger.debug(`params: document_id = ${document_id}`);

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
      logger.debug("response", response);

      return raiseSuccess(res, 200, {}, "Document deleted successfully");
    } catch (error) {
      logger.debug("deleteReportDocument 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new ReportController();
