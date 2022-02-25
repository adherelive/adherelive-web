export const TABLE_COLUMN = {
  MEDICINE: {
    key: "MEDICINE",
    dataIndex: "MEDICINE",
  },
  TAKEN: {
    key: "TAKEN",
    dataIndex: "TAKEN",
  },
  INTAKE: {
    key: "INTAKE",
    dataIndex: "INTAKE",
  },
  DURATION: {
    key: "DURATION",
    dataIndex: "DURATION",
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

export const formatMedicationTableData = (data) => {
  const { medications, id, medicines } = data || {};

  const { basic_info: { details: { medicine_id } = {} } = {} } =
    medications[id] || {};

  const medicationTemplateData = medicines[medicine_id] || {};

  return {
    medicationTemplateData,
    medicationData: medications[id],
  };
};
