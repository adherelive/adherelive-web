import { TABLE_COLUMN, formatPatientTableData } from "../helper";

export default data => {
  const { id } = data;
  const formattedData = formatPatientTableData(data);
  console.log("1923134 ", formattedData);
  const { patientData, treatmentData, doctorData, providerData } =
    formattedData || {};
  return {
    key: id,
    [TABLE_COLUMN.PID.dataIndex]: {
      patientData
    },
    [TABLE_COLUMN.CONDITION.dataIndex]: {
      patientData
    },
    [TABLE_COLUMN.TREATMENT.dataIndex]: {
      treatmentData
    },
    [TABLE_COLUMN.SEVERITY.dataIndex]: {
      treatmentData
    },
    [TABLE_COLUMN.AGE.dataIndex]: {
      patientData
    },
    [TABLE_COLUMN.START_DATE.dataIndex]: {
      treatmentData
    },
    [TABLE_COLUMN.DOCTOR.dataIndex]: {
      patientData,
      doctorData
    },
    [TABLE_COLUMN.PROVIDER.dataIndex]: {
      patientData,
      providerData
    },
    [TABLE_COLUMN.NEW_SYMPTOMS.dataIndex]: {
      patientData
    }
  };
};
