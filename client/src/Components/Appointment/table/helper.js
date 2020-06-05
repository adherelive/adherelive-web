import {getUserDetails} from "../../../Helper/userDetails";

export const TABLE_COLUMN = {
  ORGANIZER: {
    key: "ORGANIZER",
    dataIndex: "ORGANIZER",
    width: 100
  },
  DATE: {
    key: "DATE",
    dataIndex: "DATE"
  },
  TIMING: {
    key: "TIMING",
    dataIndex: "TIMING"
  },
  DESCRIPTION: {
    key: "DESCRIPTION",
    dataIndex: "DESCRIPTION"
  }
};

export const formatAppointmentTableData = data => {
  const { appointments, id, users, doctors, patients, care_takers } = data || {};

  const {
    basic_info: { start_date, details: { start_time, end_time } = {} },
    organizer_id,
    organizer_type
  } = appointments[id] || {};

  const appointmentData = {
    date: start_date,
    start_time,
    end_time
  };

  const userData = getUserDetails({type: organizer_type, id: organizer_id, doctors, patients, care_takers});

  return {
    appointmentData,
    userData
  };
};
