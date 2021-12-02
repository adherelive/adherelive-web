import { getUserDetails } from "../../../Helper/userDetails";

export const TABLE_COLUMN = {
  ORGANIZER: {
    key: "ORGANIZER",
    dataIndex: "ORGANIZER",
    // width: 100
  },
  DATE: {
    key: "DATE",
    dataIndex: "DATE",
    // width: 100
  },
  TIMING: {
    key: "TIMING",
    dataIndex: "TIMING",
    // width: 150
  },
  DESCRIPTION: {
    key: "DESCRIPTION",
    dataIndex: "DESCRIPTION",
    // width: 100
  },
};

export const formatAppointmentTableData = (data) => {
  const { appointments, id, doctors, patients, care_takers } = data || {};

  const { organizer: { id: organizer_id, category } = {} } =
    appointments[id] || {};

  const userData = getUserDetails({
    type: category,
    id: organizer_id,
    doctors,
    patients,
    care_takers,
  });

  return {
    appointmentData: appointments[id],
    userData,
  };
};
