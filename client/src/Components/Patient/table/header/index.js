import React from "react";

import { TABLE_COLUMN } from "../helper";
import messages from "../messages";
import PID from "../datacolumn/pid";
// import Condition from "../datacolumn/condition";
import Diagnosis from "../datacolumn/diagnosis";
import Treatment from "../datacolumn/treatment";
import Severity from "../datacolumn/severity";
import EditPatientColumn from "../datacolumn/editColumn";
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
      title: 'Patient',
      ...TABLE_COLUMN.PID,
      render: data => {
        const { patientData, chatData,addToWatchlist ,doctorData, onRowClick,removePatientFromWatchlist} = data || {};
        return <PID onRowClick={onRowClick} patientData={patientData} chatData={chatData} addToWatchlist={addToWatchlist} doctorData={doctorData} removePatientFromWatchlist={removePatientFromWatchlist}/>;
      }
    },
    {
      title: formatMessage(messages.diagnosis),
      ...TABLE_COLUMN.DIAGNOSIS,
      render: patientData => <Diagnosis {...patientData} />
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
      title: formatMessage(messages.start_date),
      ...TABLE_COLUMN.START_DATE,
      render: carePlanData => <StartDate {...carePlanData} />
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
    },
    {
      title:"",
      ...TABLE_COLUMN.EDIT,
      render : data => {
        const {  patientData,
          carePlanData,
          openEditPatientDrawer} = data;
          return (
            <EditPatientColumn patientData={patientData} carePlanData={carePlanData}  openEditPatientDrawer={openEditPatientDrawer} />
          )

       
      }
    }
  ];
};
