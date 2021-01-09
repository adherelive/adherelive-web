import { TABLE_COLUMN, formatPatientTableData } from "../helper";

export default data => {
  const { id,addToWatchlist, onRowClick,removePatientFromWatchlist} = data;
  const formattedData = formatPatientTableData(data);
  const { patientData, treatmentData, doctorData, providerData, chatData, carePlanData ,openEditPatientDrawer} =
    formattedData || {};

  return {
    key: id,
    [TABLE_COLUMN.PID.dataIndex]: {
      patientData,
      chatData,
      addToWatchlist,
      doctorData,
      onRowClick,
      removePatientFromWatchlist
    },
    [TABLE_COLUMN.DIAGNOSIS.dataIndex]: {
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
    // [TABLE_COLUMN.AGE.dataIndex]: {
    //   patientData
    // },
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
    },
  };
};
