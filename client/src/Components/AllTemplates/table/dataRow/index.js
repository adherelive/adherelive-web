import { TABLE_COLUMN, formatTemplateTableData } from "../helper";

export default (data) => {
  const { id, duplicateCareplanTemplate, handleOpenEditDrawer } = data;
  const formattedData = formatTemplateTableData(data);
  const { templateData } = formattedData || {};

  return {
    key: id,
    [TABLE_COLUMN.NAME.dataIndex]: {
      templateData,
    },
    [TABLE_COLUMN.CREATED_AT.dataIndex]: {
      templateData,
    },
    [TABLE_COLUMN.EDIT.dataIndex]: {
      id,
      duplicateCareplanTemplate,
      handleOpenEditDrawer,
      templateData,
    },
  };
};
