export const TABLE_COLUMN = {
  VITAL: {
    key: "VITAL",
    dataIndex: "VITAL",
    // width: 100
  },
  TAKEN: {
    key: "TAKEN",
    dataIndex: "TAKEN",
    // width: 100
  },
  DESCRIPTION: {
    key: "DESCRIPTION",
    dataIndex: "DESCRIPTION",
    // width: 100
  },
  TIMELINE: {
    key: "TIMELINE",
    dataIndex: "TIMELINE",
    // width: 100
  },
  EDIT: {
    key: "EDIT",
    dataIndex: "EDIT",
  }
};

export const formatAppointmentTableData = data => {
  const { vitals, id, vital_templates } = data || {};

  const {basic_info: {vital_template_id} = {}} = vitals[id] || {};

  const vitalTemplateData = vital_templates[vital_template_id] || {};

  return {
    vitalTemplateData,
    vitalData: vitals[id]
  };
};
