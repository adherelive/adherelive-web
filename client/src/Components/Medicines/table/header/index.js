import React from "react";

import { TABLE_COLUMN } from "../helper";
import messages from "../messages";
import MedicineName from "../dataColumn/medicineName";
import CreatorName from "../dataColumn/creatorName";
import Type from "../dataColumn/type";
import UpdatedAt from "../dataColumn/updatedAt";
import Options from "../dataColumn/options";

const ALL_TABS = {
  PUBLIC: "1",
  CREATOR: "2",
};

export default (props) => {
  const { formatMessage, currentTab, getColumnSearchProps, changeTab } =
    props || {};

  // if(currentTab === ALL_TABS.PUBLIC){
  //   return [
  //     {
  //       title: formatMessage(messages.medicineName),
  //       ...TABLE_COLUMN.MEDICINE_NAME,
  //       render: (data={}) => {
  //         return <MedicineName {...data} />;
  //       },
  //       ...getColumnSearchProps(TABLE_COLUMN.MEDICINE_NAME.dataIndex)
  //     },
  //     {
  //       title: formatMessage(messages.medicineType),
  //       ...TABLE_COLUMN.TYPE,
  //       render: (data={}) => {
  //         return (
  //           <Type {...data}
  //           formatMessage={formatMessage}
  //           />
  //         );
  //       }
  //     },
  //     {
  //         title: formatMessage(messages.updatedAt),
  //         ...TABLE_COLUMN.UPDATED_AT,
  //         render: (data={}) => <UpdatedAt {...data} />
  //       },
  //     {
  //       title: '',
  //       ...TABLE_COLUMN.OPTIONS,
  //       render: (data={}) => <Options {...data} formatMessage={formatMessage} />
  //     }
  //   ];

  // }else{

  return [
    {
      title: formatMessage(messages.medicineName),
      ...TABLE_COLUMN.MEDICINE_NAME,
      render: (data = {}) => {
        return <MedicineName {...data} />;
      },
      ...getColumnSearchProps(TABLE_COLUMN.MEDICINE_NAME.dataIndex),
    },
    {
      title: formatMessage(messages.creatorName),
      ...TABLE_COLUMN.CREATOR_NAME,
      render: (data = {}) => {
        const { medicineData = {}, doctors = {} } = data || {};
        return <CreatorName medicineData={medicineData} doctors={doctors} />;
      },
      ...getColumnSearchProps(TABLE_COLUMN.CREATOR_NAME.dataIndex),
    },
    {
      title: formatMessage(messages.medicineType),
      ...TABLE_COLUMN.TYPE,
      render: (data = {}) => {
        return <Type {...data} formatMessage={formatMessage} />;
      },
    },
    {
      title: formatMessage(messages.updatedAt),
      ...TABLE_COLUMN.UPDATED_AT,
      render: (data = {}) => <UpdatedAt {...data} />,
    },
    {
      title: "",
      ...TABLE_COLUMN.OPTIONS,
      render: (data = {}) => {
        const {
          medicineData = {},
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
        return (
          <Options
            medicineData={medicineData}
            makeMedicinePublic={makeMedicinePublic}
            currentPage={currentPage}
            getPrivateMedicines={getPrivateMedicines}
            changeLoading={changeLoading}
            searchText={searchText}
            formatMessage={formatMessage}
            mapMedicineToPublic={mapMedicineToPublic}
            deleteMedicine={deleteMedicine}
            getPublicMedicines={getPublicMedicines}
            currentTab={currentTab}
            changeTab={changeTab}
          />
        );
      },
    },
  ];
  // }
};
