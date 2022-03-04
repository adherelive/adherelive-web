import { TABLE_COLUMN, formatProviderTableData } from "../helper";

export default (data) => {
  const { id, openEditProviderDrawer } = data;
  const formattedData = formatProviderTableData(data);
  const { userData, providerData } = formattedData || {};

  return {
    key: id,
    [TABLE_COLUMN.NAME.dataIndex]: {
      providerData,
    },
    [TABLE_COLUMN.CONTACT_DETAILS.dataIndex]: {
      userData,
    },
    [TABLE_COLUMN.ADDRESS.dataIndex]: {
      providerData,
    },
    [TABLE_COLUMN.EDIT.dataIndex]: {
      providerData,
      openEditProviderDrawer,
    },
  };
};
