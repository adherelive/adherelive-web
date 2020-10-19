import React from "react";

import { TABLE_COLUMN } from "../helper";
import messages from "../messages";
import PID from "../datacolumn/pid";
import Condition from "../datacolumn/condition";
import Treatment from "../datacolumn/treatment";
import Severity from "../datacolumn/severity";
import Age from "../datacolumn/age";
import StartDate from "../datacolumn/startDate";
import Doctor from "../datacolumn/doctor";
import Provider from "../datacolumn/provider";
import NewSymptoms from "../datacolumn/newSymptoms";
import Watchlist from "../datacolumn/watchlist";

export default props => {
  const { formatMessage } = props || {};

  return [
    {
      // title: formatMessage(messages.pid),
      title: 'Patient',
      ...TABLE_COLUMN.PID,
      render: data => {
        const { patientData, chatData,addToWatchlist ,doctorData, onRowClick} = data || {};
        return <PID onRowClick={onRowClick} patientData={patientData} chatData={chatData} addToWatchlist={addToWatchlist} doctorData={doctorData}/>;
      }
    },
    {
      title: formatMessage(messages.watchlist),
      ...TABLE_COLUMN.WATCHLIST,
      render: ({doctorData, addToWatchlist, patientData}) => <Watchlist patientData={patientData} doctorData={doctorData} addToWatchlist={addToWatchlist} />
    },
    {
      title: formatMessage(messages.condition),
      ...TABLE_COLUMN.CONDITION,
      render: patientData => <Condition {...patientData} />
    },
    {
      title: formatMessage(messages.treatment),
      ...TABLE_COLUMN.TREATMENT,
      render: data => {
        const { patientData, treatmentData, carePlanData } = data;
        return (
          <Treatment patientData={patientData} treatmentData={treatmentData} carePlanData={carePlanData} />
        );
      }
    },
    {
      title: formatMessage(messages.severity),
      ...TABLE_COLUMN.SEVERITY,
      render: treatmentData => <Severity {...treatmentData} />
    },
    {
      title: formatMessage(messages.age),
      ...TABLE_COLUMN.AGE,
      render: patientData => <Age {...patientData} />
    },
    {
      title: formatMessage(messages.start_date),
      ...TABLE_COLUMN.START_DATE,
      render: carePlanData => <StartDate {...carePlanData} />
    },
    {
      title: formatMessage(messages.doctor),
      ...TABLE_COLUMN.DOCTOR,
      render: data => {
        const { patientData, doctorData } = data;
        return <Doctor patientData={patientData} doctorData={doctorData} />;
      }
    },
    {
      title: formatMessage(messages.provider),
      ...TABLE_COLUMN.PROVIDER,
      render: data => {
        const { patientData, providerData } = data;
        return (
          <Provider patientData={patientData} providerData={providerData} />
        );
      }
    },
    {
      title: formatMessage(messages.new_symptoms),
      ...TABLE_COLUMN.NEW_SYMPTOMS,
      render: patientData => <NewSymptoms {...patientData} />
    }
  ];
};
