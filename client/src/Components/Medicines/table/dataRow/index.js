import { TABLE_COLUMN } from "../helper";

export default (data) => {
  const {
    id = null,
    medicineData = {},
    doctors = {},
    makeMedicinePublic,
    currentPage = null,
    getPrivateMedicines,
    changeLoading,
    searchText = "",
    mapMedicineToPublic,
    deleteMedicine,
    getPublicMedicines,
    currentTab,
  } = data;

  return {
    key: id,
    [TABLE_COLUMN.MEDICINE_NAME.dataIndex]: {
      medicineData,
    },
    [TABLE_COLUMN.CREATOR_NAME.dataIndex]: {
      medicineData,
      doctors,
    },
    [TABLE_COLUMN.TYPE.dataIndex]: {
      medicineData,
    },
    [TABLE_COLUMN.UPDATED_AT.dataIndex]: {
      medicineData,
    },
    [TABLE_COLUMN.OPTIONS.dataIndex]: {
      medicineData,
      makeMedicinePublic,
      currentPage,
      getPrivateMedicines,
      changeLoading,
      searchText,
      mapMedicineToPublic,
      deleteMedicine,
      getPublicMedicines,
      currentTab,
    },
  };
};
