export const TABLE_COLUMN = {
  NAME: {
    key: "NAME",
    dataIndex: "NAME",
    width: 300,
    // fixed: "left",
  },
  CONTACT_DETAILS: {
    key: "CONTACT_DETAILS",
    dataIndex: "CONTACT_DETAILS",
    // width: 300
  },
  ADDRESS: {
    key: "ADDRESS",
    dataIndex: "ADDRESS",
    // width: 300
  },
  EDIT: {
    key: "EDIT",
    dataIndex: "EDIT",
    // width: 300
  },
};

export const formatProviderTableData = (data) => {
  const { id, users, providers } = data || {};

  const providerData = providers[id] || {};
  const { basic_info: { user_id } = {} } = providers[id] || {};
  const userData = users[user_id] || {};

  return {
    userData,
    providerData,
  };
};
