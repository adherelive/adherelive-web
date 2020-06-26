export const TABLE_COLUMN = {
  NAME: {
    key: "NAME",
    dataIndex: "NAME",
    width: 150,
    fixed: "left"
  },
  VERIFIED: {
    key: "VERIFIED",
    dataIndex: "VERIFIED",
    width: 100
  },
  SPECIALITY: {
    key: "SPECIALITY",
    dataIndex: "SPECIALITY",
    width: 100
  },
  CONTACT_DETAILS: {
    key: "CONTACT_DETAILS",
    dataIndex: "CONTACT_DETAILS",
    width: 150
  },
  ADDRESS: {
    key: "ADDRESS",
    dataIndex: "ADDRESS",
    width: 150
  }
};

export const formatDoctorTableData = data => {
  const { id, users, doctors } = data || {};

  const doctorData = doctors[id] || {};
  const {basic_info: {user_id} = {}} = doctors[id] || {};
  const userData = users[user_id] || {};

  return {
    userData,
    doctorData
  };
};
