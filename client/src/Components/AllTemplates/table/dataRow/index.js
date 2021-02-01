import { TABLE_COLUMN, formatTemplateTableData } from "../helper";

export default data => {
  const { id , repeat_intervals ,
     duplicateCareplanTemplate,
     handleOpenEditDrawer} = data;
  const formattedData = formatTemplateTableData(data);
  const { 
    templateData,
    medicationsData,
    appointmentsData,
    vitalsData,
    medicines,
    vital_templates,
    template_medication_ids,
    template_appointment_ids,
    template_vital_ids
  } =
    formattedData || {};

  return {
    key: id,
    [TABLE_COLUMN.NAME.dataIndex]: {
      templateData
    },
    [TABLE_COLUMN.CREATED_AT.dataIndex]: {
      templateData
    },
    // [TABLE_COLUMN.DUPLICATE.dataIndex]: {
    //   id,
    //   duplicateCareplanTemplate
    // },
    [TABLE_COLUMN.EDIT.dataIndex]: {
      id,
      duplicateCareplanTemplate,
      handleOpenEditDrawer,
      templateData
    },
  };
};
