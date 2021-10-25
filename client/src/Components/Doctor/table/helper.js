export const TABLE_COLUMN = {
  NAME: {
    key: "NAME",
    dataIndex: "NAME",
    width: 300,
    fixed: "left",
  },
  VERIFIED: {
    key: "VERIFIED",
    dataIndex: "VERIFIED",
    width: 300,
  },
  SPECIALITY: {
    key: "SPECIALITY",
    dataIndex: "SPECIALITY",
    width: 300,
  },
  CONTACT_DETAILS: {
    key: "CONTACT_DETAILS",
    dataIndex: "CONTACT_DETAILS",
    width: 300,
  },
  ADDRESS: {
    key: "ADDRESS",
    dataIndex: "ADDRESS",
    width: 300,
  },
  ACTIVE: {
    key: "ACTIVE",
    dataIndex: "ACTIVE",
    width: 300,
  },
};

export const formatDoctorTableData = (data) => {
  const { id, users, doctors, specialities } = data || {};

  const doctorData = doctors[id] || {};
  const { basic_info: { user_id, speciality_id } = {} } = doctors[id] || {};
  const userData = users[user_id] || {};
  const specialityData = specialities[speciality_id] || {};

  return {
    userData,
    doctorData,
    specialityData,
  };
};
