import { TABLE_COLUMN, formatMedicationTableData } from "../helper";

export default (data) => {
  const {
    id,
    openResponseDrawer,
    openEditDrawer,
    formatMessage,
    canViewDetails = false,
  } = data;
  const formattedData = formatMedicationTableData(data);
  const { medicationData, medicationTemplateData } = formattedData || {};

  return {
    key: id,
    [TABLE_COLUMN.MEDICINE.dataIndex]: {
      medicationTemplateData,
      medicationData,
    },
    [TABLE_COLUMN.TAKEN.dataIndex]: {
      medicationData,
    },
    [TABLE_COLUMN.INTAKE.dataIndex]: {
      medicationData,
    },
    [TABLE_COLUMN.DURATION.dataIndex]: {
      medicationData,
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
