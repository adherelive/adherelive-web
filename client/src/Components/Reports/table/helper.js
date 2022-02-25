import { USER_CATEGORY } from "../../../constant";

export const TABLE_COLUMN = {
  NAME: {
    key: "NAME",
    dataIndex: "NAME",
  },
  TIME: {
    key: "TIME",
    dataIndex: "TIME",
  },
  REPORT_DOCUMENTS: {
    key: "REPORT_DOCUMENTS",
    dataIndex: "REPORT_DOCUMENTS",
    // ellipsis: true
  },
  EDIT: {
    key: "EDIT",
    dataIndex: "EDIT",
    width: 100,
  },
};

export const formatReportData = ({
  id,
  reports,
  patients,
  doctors,
  upload_documents,
}) => {
  const reportData = reports[id] || {};

  const {
    basic_info: { patient_id } = {},
    uploader: { id: uploaderId, category: uploaderCategory } = {},
    report_document_ids = [],
  } = reportData || {};

  const patientData = patients[patient_id] || {};

  const uploaderData =
    uploaderCategory === USER_CATEGORY.DOCTOR ||
    uploaderCategory === USER_CATEGORY.HSP
      ? doctors[uploaderId]
      : patients[uploaderId];

  // documents
  let documentData = {};
  report_document_ids.forEach((documentId) => {
    documentData[documentId] = upload_documents[documentId] || {};
  });

  return {
    reportData,
    patientData,
    uploaderData,
    documentData,
  };
};

//   export const formatAppointmentTableData = data => {
//     const { vitals, id, vital_templates} = data || {};

//     const {basic_info: {vital_template_id} = {}} = vitals[id] || {};

//     const vitalTemplateData = vital_templates[vital_template_id] || {};

//     return {
//       vitalTemplateData,
//       vitalData: vitals[id],
//     };
//   };
