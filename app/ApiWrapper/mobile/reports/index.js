import BaseReport from "../../../services/reports";
import ReportService from "../../../services/reports/report.service";
import uploadDocumentService from "../../../services/uploadDocuments/uploadDocuments.service";
import FlashCardService from "../../../services/flashCard/flashCard.service"
import DocumentWrapper from "../../web/uploadDocument";

import Logger from "../../../../libs/log";
import { DOCUMENT_PARENT_TYPE } from "../../../../constant";

const Log = new Logger("MOBILE > API_WRAPPER > REPORTS");

class ReportWrapper extends BaseReport {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data } = this;
    const { id, patient_id, uploader_id, uploader_type, name, test_date } =
      _data || {};

    return {
      basic_info: {
        id,
        patient_id,
        name,
      },
      test_date,
      uploader: {
        id: uploader_id,
        category: uploader_type,
      },
    };
  };

  getAllInfo = async () => {
    const { getBasicInfo, getId } = this;
    try {
      const documents =
        (await uploadDocumentService.getAllByData({
          parent_id: getId(),
          parent_type: DOCUMENT_PARENT_TYPE.REPORT,
        })) || [];

      let uploadDocumentIds = [];

      for (let index = 0; index < documents.length; index++) {
        const document = await DocumentWrapper(documents[index]);
        uploadDocumentIds.push(document.getUploadDocumentId());
      }

      return {
        ...getBasicInfo(),
        report_document_ids: uploadDocumentIds,
      };
    } catch (error) {
      Log.debug("getAllInfo error", error);
      throw error;
    }
  };

  getReferenceInfo = async () => {
    const { getAllInfo, getId } = this;
    try {
      const documents =
        (await uploadDocumentService.getAllByData({
          parent_id: getId(),
          parent_type: DOCUMENT_PARENT_TYPE.REPORT,
        })) || [];

      let uploadDocuments = {};

      for (let index = 0; index < documents.length; index++) {
        const document = await DocumentWrapper(documents[index]);
        uploadDocuments[document.getUploadDocumentId()] =
          document.getBasicInfo();
      }

      const ref = await getAllInfo();
      if (ref["flas_card_id"]) {
        const flasCardService = new FlashCardService();
        const flascards = await flasCardService.getAllFlashCardByData({
          id: ref["flas_card_id"], is_published: true
        });
        ref["flashCard"] = flascards;
      }

      // flash card code here.

      return {
        reports: {
          [getId()]: ref,
        },
        upload_documents: {
          ...uploadDocuments,
        },
        report_ids: [getId()],
      };
    } catch (error) {
      Log.debug("getReferenceInfo error", error);
      throw error;
    }
  };
}

export default async ({ data = null, id = null }) => {
  try {
    if (data) {
      return new ReportWrapper(data);
    }
    const reportService = new ReportService();
    const reports = await reportService.getReportByData({ id });
    return new ReportWrapper(reports);
  } catch (error) {
    Log.debug("ReportWrapper catch error", error);
    throw error;
  }
};
