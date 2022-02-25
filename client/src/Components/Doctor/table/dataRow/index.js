import { TABLE_COLUMN, formatDoctorTableData } from "../helper";

export default (data) => {
  const { id, formatMessage } = data;
  const formattedData = formatDoctorTableData(data);
  const { userData, doctorData, specialityData } = formattedData || {};
  return {
    key: id,
    [TABLE_COLUMN.NAME.dataIndex]: {
      doctorData,
      userData,
      formatMessage,
    },
    [TABLE_COLUMN.VERIFIED.dataIndex]: {
      userData,
    },
    [TABLE_COLUMN.SPECIALITY.dataIndex]: {
      specialityData,
    },
    [TABLE_COLUMN.CONTACT_DETAILS.dataIndex]: {
      userData,
    },
    [TABLE_COLUMN.ADDRESS.dataIndex]: {
      doctorData,
    },
  };
};
