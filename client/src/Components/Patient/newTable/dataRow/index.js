import { TABLE_COLUMN, formatPatientTableData } from "../helper";

export default data => {
  const { id,addToWatchlist, onRowClick,removePatientFromWatchlist,
    currentTab,handleGetPatients,tabChanged , offset , paginatedPatientData} = data;


  const formattedData = formatPatientTableData(data);
  const { patientData, treatmentData, doctorData,  carePlanData} =
    formattedData || {};

  return {
    key: id,
    [TABLE_COLUMN.PID.dataIndex]: {
      patientData,
      addToWatchlist,
      doctorData,
      onRowClick,
      removePatientFromWatchlist,
      currentTab,
      handleGetPatients,
      tabChanged,
      offset,
      paginatedPatientData
    },
    [TABLE_COLUMN.DIAGNOSIS.dataIndex]: {
      // patientData
      carePlanData
    },
    [TABLE_COLUMN.TREATMENT.dataIndex]: {
      treatmentData,
      carePlanData
    },
    [TABLE_COLUMN.SEVERITY.dataIndex]: {
      treatmentData,
      carePlanData
    },
    [TABLE_COLUMN.START_DATE.dataIndex]: {
      treatmentData,
      carePlanData
    },
    [TABLE_COLUMN.DOCTOR.dataIndex]: {
      patientData,
      doctorData
    },
    [TABLE_COLUMN.CREATED_AT.dataIndex]: {
      patientData
    },
  };
};
