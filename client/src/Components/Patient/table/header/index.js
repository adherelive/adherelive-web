import React from "react";

import { TABLE_COLUMN } from "../helper";
import messages from "../messages";
import PID from "../datacolumn/pid";
import Diagnosis from "../datacolumn/diagnosis";
import Treatment from "../datacolumn/treatment";
import Severity from "../datacolumn/severity";
import StartDate from "../datacolumn/startDate";
import CreatedAt from "../datacolumn/createdAt";
import moment from "moment";

export default (props) => {
  const { formatMessage, getColumnSearchProps } = props || {};

  return [
    {
      title: "Patient",
      ...TABLE_COLUMN.PID,
      render: (data) => {
        const {
          patientData,
          chatData,
          addToWatchlist,
          doctorData,
          onRowClick,
          removePatientFromWatchlist,
        } = data || {};
        return (
          <PID
            onRowClick={onRowClick}
            patientData={patientData}
            chatData={chatData}
            addToWatchlist={addToWatchlist}
            doctorData={doctorData}
            removePatientFromWatchlist={removePatientFromWatchlist}
          />
        );
      },
    },
    {
      title: formatMessage(messages.diagnosis),
      ...TABLE_COLUMN.DIAGNOSIS,
      render: (patientData) => <Diagnosis {...patientData} />,
      ...getColumnSearchProps(TABLE_COLUMN.DIAGNOSIS.dataIndex),
    },
    {
      title: formatMessage(messages.treatment),
      ...TABLE_COLUMN.TREATMENT,
      render: (data) => {
        const { patientData, treatmentData, carePlanData } = data;
        // console.log("82346234236492347 ========>",{treatmentData,carePlanData})
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
      sorter: (a, b) => {
        // console.log("38712397182 a, b", {a, b});

        const { carePlanData: { activated_on: aActivatedOn } = {} } =
          a[TABLE_COLUMN.START_DATE.dataIndex] || {};
        const { carePlanData: { activated_on: bActivatedOn } = {} } =
          b[TABLE_COLUMN.START_DATE.dataIndex] || {};

        if (moment(aActivatedOn).isBefore(moment(bActivatedOn))) {
          return 1;
        } else {
          return -1;
        }
      },
    },
    {
      title: formatMessage(messages.createdAt),
      ...TABLE_COLUMN.CREATED_AT,
      render: (patientData) => <CreatedAt {...patientData} />,
      sorter: (a, b) => {
        // console.log("38712397182 a, b", {a, b});

        const { patientData: { created_at: aCreatedAt } = {} } =
          a[TABLE_COLUMN.CREATED_AT.dataIndex] || {};
        const { patientData: { created_at: bCreatedAt } = {} } =
          b[TABLE_COLUMN.CREATED_AT.dataIndex] || {};

        if (moment(aCreatedAt).isBefore(moment(bCreatedAt))) {
          return 1;
        } else {
          return -1;
        }
      },
    },
  ];
};
