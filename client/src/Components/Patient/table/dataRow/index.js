import { TABLE_COLUMN, formatPatientTableData } from "../helper";

export default data => {
  const { id,addToWatchlist, onRowClick} = data;
  const formattedData = formatPatientTableData(data);
  const { patientData, treatmentData, doctorData, providerData, chatData, carePlanData } =
    formattedData || {};

  return {
    key: id,
    [TABLE_COLUMN.PID.dataIndex]: {
      patientData,
      chatData,
      addToWatchlist,
      doctorData,
      onRowClick
    },
    [TABLE_COLUMN.WATCHLIST.dataIndex]: {
      patientData,
      addToWatchlist,
      doctorData,
    },
    [TABLE_COLUMN.CONDITION.dataIndex]: {
      patientData
    },
    [TABLE_COLUMN.TREATMENT.dataIndex]: {
      treatmentData,
      carePlanData
    },
    [TABLE_COLUMN.SEVERITY.dataIndex]: {
      treatmentData,
      carePlanData
    },
    [TABLE_COLUMN.AGE.dataIndex]: {
      patientData
    },
    [TABLE_COLUMN.START_DATE.dataIndex]: {
      treatmentData,
      carePlanData
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
