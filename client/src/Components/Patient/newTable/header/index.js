import React from "react";

import { TABLE_COLUMN } from "../helper";
import { ASCEND, DESCEND } from "../../../../constant";
import messages from "../messages";
import PID from "../datacolumn/pid";
import Diagnosis from "../datacolumn/diagnosis";
import Treatment from "../datacolumn/treatment";
import Severity from "../datacolumn/severity";
import StartDate from "../datacolumn/startDate";
import CreatedAt from "../datacolumn/createdAt";

export default (props) => {
  const { formatMessage, tabChanged, tabState, getColumnSearchProps } =
    props || {};

  const {
    filter_diagnosis,
    filter_treatment,
    offset,
    sort_createdAt,
    sort_name,
  } = tabState;

  return [
    {
      title: "Patient",
      ...TABLE_COLUMN.PID,

      render: (data) => {
        const {
          patientData,
          addToWatchlist,
          doctorData,
          onRowClick,
          removePatientFromWatchlist,
          currentTab,
          handleGetPatients,
          tabChanged,
          offset,
          paginatedPatientData,
          auth_role,
        } = data || {};

        return (
          <PID
            onRowClick={onRowClick}
            patientData={patientData}
            addToWatchlist={addToWatchlist}
            doctorData={doctorData}
            removePatientFromWatchlist={removePatientFromWatchlist}
            currentTab={currentTab}
            handleGetPatients={handleGetPatients}
            tabChanged={tabChanged}
            offset={offset}
            paginatedPatientData={paginatedPatientData}
            auth_role={auth_role}
          />
        );
      },
      sorter: () => null,
      sortOrder: sort_name === null ? null : sort_name === 0 ? ASCEND : DESCEND,
    },
    {
      title: formatMessage(messages.diagnosis),
      ...TABLE_COLUMN.DIAGNOSIS,
      render: (carePlanData) => <Diagnosis {...carePlanData} />,
      ...getColumnSearchProps(TABLE_COLUMN.DIAGNOSIS.dataIndex),
    },
    {
      title: formatMessage(messages.treatment),
      ...TABLE_COLUMN.TREATMENT,
      render: (data) => {
        const { patientData, treatmentData, carePlanData } = data;
        return (
          <Treatment
            patientData={patientData}
            treatmentData={treatmentData}
            carePlanData={carePlanData}
          />
        );
      },
      ...getColumnSearchProps(TABLE_COLUMN.TREATMENT.dataIndex),
    },
    {
      title: formatMessage(messages.severity),
      ...TABLE_COLUMN.SEVERITY,
      render: (treatmentData) => <Severity {...treatmentData} />,
    },
    {
      title: formatMessage(messages.start_date),
      ...TABLE_COLUMN.START_DATE,
      render: (carePlanData) => <StartDate {...carePlanData} />,
    },
    {
      title: "Created At",
      ...TABLE_COLUMN.CREATED_AT,
      render: (patientData) => <CreatedAt {...patientData} />,
      sorter: () => null,
      sortOrder: sort_createdAt === 0 ? DESCEND : ASCEND,
    },
  ];
};
