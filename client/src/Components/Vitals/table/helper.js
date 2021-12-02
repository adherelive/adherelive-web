export const TABLE_COLUMN = {
  VITAL: {
    key: "VITAL",
    dataIndex: "VITAL",
  },
  TAKEN: {
    key: "TAKEN",
    dataIndex: "TAKEN",
  },
  DESCRIPTION: {
    key: "DESCRIPTION",
    dataIndex: "DESCRIPTION",
    ellipsis: true,
  },
  TIMELINE: {
    key: "TIMELINE",
    dataIndex: "TIMELINE",
    width: 120,
  },
  EDIT: {
    key: "EDIT",
    dataIndex: "EDIT",
    width: 100,
  },
};

export const formatAppointmentTableData = (data) => {
  const { vitals, id, vital_templates } = data || {};

  const { basic_info: { vital_template_id } = {} } = vitals[id] || {};

  const vitalTemplateData = vital_templates[vital_template_id] || {};

  return {
    vitalTemplateData,
    vitalData: vitals[id],
  };
};
