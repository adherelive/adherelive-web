import { TABLE_COLUMN, formatAppointmentTableData } from "../helper";

export default (data) => {
  const {
    id,
    openResponseDrawer,
    openEditDrawer,
    formatMessage,
    canViewDetails = false,
  } = data;
  const formattedData = formatAppointmentTableData(data);
  const { vitalData, vitalTemplateData } = formattedData || {};
  return {
    key: id,
    [TABLE_COLUMN.VITAL.dataIndex]: {
      vitalTemplateData,
    },
    [TABLE_COLUMN.TAKEN.dataIndex]: {
      vitalData,
    },
    [TABLE_COLUMN.DESCRIPTION.dataIndex]: {
      vitalData,
    },
    [TABLE_COLUMN.TIMELINE.dataIndex]: {
      id,
      openResponseDrawer,
      formatMessage,
    },
    [TABLE_COLUMN.EDIT.dataIndex]: {
      id,
      openEditDrawer,
      formatMessage,
      canViewDetails,
    },
  };
};
