export const TABLE_COLUMN = {
  NAME: {
    key: "NAME",
    dataIndex: "NAME",
    fixed: "left",
  },
  CREATED_AT: {
    key: "CREATED_AT",
    width: 300,
    dataIndex: "CREATED_AT",
  },
  EDIT: {
    key: "EDIT",
    dataIndex: "EDIT",
    width: 100,
  },
};

export const formatTemplateTableData = (data) => {
  let {
    id,
    care_plan_templates,
    medicines,
    template_appointments,
    template_medications,
    template_vitals,
    vital_templates,
  } = data || {};

  const templateData = care_plan_templates[id] || {};

  const {
    template_appointment_ids = [],
    template_medication_ids = [],
    template_vital_ids = [],
  } = care_plan_templates[id] || {};
  let medicationsData = {};
  let appointmentsData = {};
  let vitalsData = {};

  for (let each of template_medication_ids) {
    medicationsData[each] = template_medications[each];
  }

  for (let each of template_appointment_ids) {
    appointmentsData[each] = template_appointments[each];
  }

  for (let each of template_vital_ids) {
    vitalsData[each] = template_vitals[each];
  }

  return {
    templateData,
    medicationsData,
    appointmentsData,
    vitalsData,
    medicines,
    vital_templates,
    template_medication_ids,
    template_appointment_ids,
    template_vital_ids,
  };
};
