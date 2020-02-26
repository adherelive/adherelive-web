import { TABLE_COLUMN as COLUMN, formatWorkOrderData } from "../helper";

export default data => {
  const { id } = data;
  const formattedData = formatWorkOrderData(data);
  const {
    ticketData,
    companyData,
    //auditData,
    //clientData,
    ownerData,
    facilityData,
    managerData,
    workers
  } = formattedData;
  return {
    key: id,
    [COLUMN.GENERATE_REPORT.dataIndex]: {
      ticketData,
      companyData,
      facilityData,
      managerData
    },
    [COLUMN.TITLE.dataIndex]: {
      ticketData,
      companyData,
      facilityData,
      managerData
    },
    [COLUMN.PRIORITY.dataIndex]: ticketData,
    [COLUMN.STATUS.dataIndex]: ticketData,
    [COLUMN.CREATED_AT.dataIndex]: ticketData,
    [COLUMN.DUE_DATE.dataIndex]: ticketData,
    [COLUMN.SCHEDULED_DATE.dataIndex]: ticketData,
    [COLUMN.ASSIGNED_TO.dataIndex]: {
      ticketData,
      workers
    },
    [COLUMN.OWNER.dataIndex]: { ownerData }
  };
};
