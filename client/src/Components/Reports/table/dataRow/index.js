import { TABLE_COLUMN, formatReportData } from "../helper";

export default (data) => {
  const { formatMessage, openEditDrawer, id, openModal } = data;
  const formattedData = formatReportData(data);
  const { reportData, uploaderData, documentData } = formattedData || {};

  return {
    key: id,
    [TABLE_COLUMN.NAME.dataIndex]: {
      reportData,
      uploaderData,
    },
    [TABLE_COLUMN.TIME.dataIndex]: {
      reportData,
    },
    [TABLE_COLUMN.REPORT_DOCUMENTS.dataIndex]: {
      documentData,
      openModal,
    },
    [TABLE_COLUMN.EDIT.dataIndex]: {
      openEditDrawer,
      formatMessage,
      id,
      reportData,
      uploaderData,
      documentData,
    },
  };
};
